<script setup lang="ts">
import type { ModalBase } from "#build/components";
import { logErrorMessages } from "@vue/apollo-util";
import { round } from "mathjs";

useSeoMeta({
  title: "Nilai Kegiatan",
});

interface evaluatee {
  id: number;
  username: string;
  nama?: string;
  detail?: string;
}
type indicator = {
  urutan: number;
  nama: string;
  kategoriIndikator_id: number;
  kategori: string;
  bobot: number;
  is_benefit: number;
};
type data_nilai = {
  id?: string;
  nilai?: string;
  valid: boolean;
  is_final?: boolean;
};

// query
const route = useRoute();
const { survei_kd, keg_kd, branch_kd, posisi_kd, tahun } = route.query;
//modal
const isDataSent = ref(false);
const isDataLoading = ref(false);
const isDataError = ref(false);
//1. A. Get KegSurvei for is_confirm
const { data: resultKegSurvei, refresh: refreshKegSurvei } = await useAsyncQuery(useGetKegSurvei(), { survei_kd, keg_kd });
const dataKegSurvei = resultKegSurvei.value?.KegSurvei[0];
const isOperatorEditable = ref();

//2. Get nilai (nilaiKategoriIndikator)
const { data: resultSavedNilai } = await useAsyncQuery(useGetNilaiKategoriIndikator(), { survei_kd, keg_kd, branch_kd, posisi_kd, tahun });
const dataSavedNilai: any[] = resultSavedNilai.value?.NilaiKategoriIndikator;

// 3. kategori nested, get indikator name. Mencari kategori penilaian sesuai kegiatan survei beserta kategori umum(wajib)
const { data: resultJumPosisiPetugasKegSurvei } = await useAsyncQuery(useSearchJumPosisiPetugasKegSurvei(), { survei_kd, keg_kd, branch_kd, posisi_kd });
const dataJumPosisiPetugasKegSurvei = resultJumPosisiPetugasKegSurvei.value?.searchJumPosisiPetugasKegSurvei;
const isOperatorConfirmed = ref();

const { data: resultKategoriUmum } = await useAsyncQuery(useGetKategori(), { id: 1 });
const dataKategoriUmum: any[] = resultKategoriUmum.value?.Kategori.KategoriIndikator;
let Indicators: indicator[] = [];
let n: number;
try {
  n = dataKategoriUmum.length; //splt data
  isOperatorEditable.value = dataKegSurvei.is_confirm; // false then is_confirmed always true, doesn't need any agreement.
  isOperatorConfirmed.value = dataJumPosisiPetugasKegSurvei[0].is_confirmed;
  if (!useIncludes(useToLower(resultKategoriUmum.value?.Kategori.nama), "umum")) {
    console.log(resultKategoriUmum.value);
    throw new Error("Gagal mendapatkan kategori umum!");
  }
  for (const item of dataKategoriUmum) {
    const temp: indicator = {
      urutan: item.no_urut,
      nama: item.indikator.nama,
      kategoriIndikator_id: parseInt(item.kategoriIndikator_id),
      kategori: resultKategoriUmum.value?.Kategori.nama,
      bobot: item.bobot,
      is_benefit: item.indikator.is_benefit,
    };
    Indicators.push(temp);
  }

  for (const item of dataJumPosisiPetugasKegSurvei[0].kategori.KategoriIndikator) {
    const temp: indicator = {
      urutan: item.no_urut + n,
      nama: item.indikator.nama,
      kategoriIndikator_id: parseInt(item.kategoriIndikator_id),
      kategori: dataJumPosisiPetugasKegSurvei[0].kategori.nama,
      bobot: item.bobot,
      is_benefit: item.indikator.is_benefit,
    };
    Indicators.push(temp);
  }
} catch (e) {
  console.log(e);
}
Indicators = useSortBy(Indicators, ["urutan"]);
//4. Semua username yang telibat mjd petugas(harus dinilai) pada PenugasanStruktur
const { data: resultPenugasanStruktur } = await useAsyncQuery(useGetPenugasanStruktur(), { survei_kd, keg_kd, branch_kd, posisi_kd });
const dataPenugasanStruktur: any[] = resultPenugasanStruktur.value?.PenugasanStruktur;
const Evaluatees: evaluatee[] = reactive([]);
try {
  Evaluatees.push(...dataPenugasanStruktur?.map((item) => ({ id: item.User.user_id, username: item.username, nama: item.User.nama })));
} catch (e) {
  console.log(e);
}
//5. Buat data matriks nilai petugas dan kategori penilaian bersesuaian
const p = Evaluatees.length;
const q = Indicators.length;
const dataNilai: data_nilai[][] = reactive(Array.from(Array(p), () => new Array(q)));
const progress = ref(0);
const progressPercentage = ref(0.0);
for (let i = 0; i < p; i++) {
  for (let j = 0; j < q; j++) {
    let foundObj = useFind(dataSavedNilai, { username: Evaluatees[i].username, kategoriIndikator_id: Indicators[j].kategoriIndikator_id });
    let temp: data_nilai = { valid: true };
    if (foundObj) {
      temp.id = foundObj.nilaikategoriindikator_id;
      temp.nilai = foundObj.nilai;
      temp.is_final = foundObj.is_final;
      if (foundObj.is_final) {
        progress.value++;
      }
    }
    dataNilai[i][j] = temp;
  }
  if (i == p - 1) {
    progressPercentage.value = round((progress.value / (p * q)) * 100, 2);
  }
}

// warn/ prevent generate/confirm dg nilai kosong
const isDataValid = ref(true);
const isDataScaleValid = ref(true);
const dataScale = ["1", "2", "3", "4", "5"];
function validateValue() {
  return new Promise((resolve) => {
    isDataValid.value = true;
    isDataScaleValid.value = true;
    console.log("validating data...");
    dataNilai.forEach((row) => {
      row.forEach((element) => {
        const temp = element.nilai ? element.nilai.toString() : "";
        if (!element.nilai) {
          element.valid = false;
          isDataValid.value = false;
        }
        if (!useIncludes(dataScale, temp)) {
          element.valid = false;
          isDataScaleValid.value = false;
        }
      });
    });
    resolve(isDataValid.value && isDataScaleValid.value);
  });
}
function validateInput(i: number, j: number) {
  const temp = dataNilai[i][j].nilai ? dataNilai[i][j].nilai.toString() : "";
  dataNilai[i][j].valid = useIncludes(dataScale, temp);
  const validArr = dataNilai.flatMap((row) => {
    return row.map((el) => el.valid);
  });
  isDataScaleValid.value = !useIncludes(validArr, false);
}
// Simpan perubahan
function validateAll() {
  return new Promise((resolve) => {
    dataNilai.forEach((row, i) => {
      row.forEach((el, j) => {
        validateInput(i, j);
      });
    });
    resolve(isDataScaleValid.value);
  });
}
async function saveChanges() {
  const isValid = await validateAll();
  // console.log(isValid);
  if (!isValid) {
    return;
  } else {
    isDataLoading.value = true;
    try {
      const isUpdated = await updateDataNilai();
      if (isUpdated) {
        const waiting = await useWaitS(1.5);
        if (waiting) reloadNuxtApp();
      }
    } catch (e) {
      isDataLoading.value = false;
      isDataError.value = true;
    }
  }
}
// update data nilai termasuk sblm generate peringkat
function updateDataNilai() {
  return new Promise((resolve, reject) => {
    //define query
    const { mutate: sendUpdateNilai, onDone: resultUpdateNilai, onError: errorUpdateNilai, loading: loadingUpdateNilai } = useMutation(useUpdateNilaiKategoriIndikator());
    // loop user
    for (let i = 0; i < Evaluatees.length; i++) {
      for (let j = 0; j < dataNilai[i].length; j++) {
        if (dataNilai[i][j].is_final) {
          sendUpdateNilai({
            id: parseInt(dataNilai[i][j].id || "0"),
            nilai: dataNilai[i][j].nilai ? parseInt(dataNilai[i][j].nilai) : null,
            is_final: dataNilai[i][j].is_final,
          });
          errorUpdateNilai((error) => {
            logErrorMessages(error);
            reject(false);
          });
          // console.log(dataNilaiKategoriIndikator);
        }
      }
    }
    resultUpdateNilai(() => {
      resolve(true);
    });
  });
}

// Konfirmasi persetujuam
const persetujuanModal = ref<InstanceType<typeof ModalBase> | null>(null);
const persetujuan = ref(true);
const persetujuanMsg = ref("");
let resolvePromise: (value: PromiseLike<boolean> | boolean) => void;
async function confirmData(): Promise<void> {
  persetujuan.value = true;
  persetujuanMsg.value = "Anda yakin akan menyetujui penilaian dan membuat peringkat ?";
  const confirmed = await isConfirmed(); // menunggu jawaban dari modal
  const { mutate: sendUpdateConfirmed, onDone: resultUpdateConfirmed, onError: errorUpdateConfirmed } = useMutation(useUdateJumPosisiPetugasKegSurvei());
  if (confirmed) {
    isDataLoading.value = true;
    try {
      const isUpdated = await updateDataNilai();
      const dataRanked = await generateRank();
      if (isUpdated && dataRanked) {
        // ubah status is_confirmed: menjadi true(telah dikonfirmasi dan/atau telah dibuat peringkat)
        sendUpdateConfirmed({ id: parseInt(dataJumPosisiPetugasKegSurvei[0]?.jumposisipetugaskegsurvei_id), is_confirmed: true });
        errorUpdateConfirmed((error) => {
          logErrorMessages(error);
          isDataLoading.value = false;
          isDataError.value = true;
          throw new Error("Gagal mengupdate status persetujuan");
        });
        const savedRank = await saveRank();
        if (savedRank) {
          // arahkan ke halaman laporan peringkat
          navigateTo({ path: "/rekrutmen/nilai/laporan/" + "kegiatan?survei_kd=" + survei_kd + "&keg_kd=" + keg_kd + "&branch_kd=" + branch_kd + "&posisi_kd=" + posisi_kd + "&tahun=" + tahun });
        }
      }
    } catch (e) {
      console.log(e);
    }
  }
}
function isConfirmed() {
  return new Promise((resolve) => {
    resolvePromise = resolve;
  });
}

function handleUserInput(value: boolean) {
  if (!resolvePromise) return;
  resolvePromise(value);
}
//Tolak persetujuan
const { mutate: sendFinalizeNilai, onDone: resultFinalizeNilai, onError: erroFinalizeeNilai, loading: loadingFinalizeNilai } = useMutation(useFinalizeNilaiKategoriIndikator());
async function rejectData() {
  persetujuan.value = false;
  persetujuanMsg.value = "Anda yakin akan menolak persetujuan penilaian dan mengembalikan status final setiap penilaian?";
  const confirmed = await isConfirmed(); // menunggu jawaban dari modal
  if (confirmed) {
    isDataLoading.value = true;
    sendFinalizeNilai({
      survei_kd,
      keg_kd,
      branch_kd,
      posisi_kd,
      tahun,
      is_final: false,
    });
    erroFinalizeeNilai((error) => {
      logErrorMessages(error);
      isDataLoading.value = false;
      isDataError.value = true;
    });
    resultFinalizeNilai(async () => {
      isDataSent.value = true;
      isDataLoading.value = false;
      await useWaitS(3.5);
      reloadNuxtApp();
    });
  }
}
// Generate peringkat
const isRanked = ref(false);
const dataRankUmum = ref();
const dataRankPosisi = ref();
function generateRank() {
  isRanked.value = true;
  return new Promise((resolve, reject) => {
    const score: number[][] = dataNilai.map((row) => row.map((col) => parseInt(col.nilai || "0", 10)));
    const score_1: number[][] = score.map((row) => useSlice(row, 0, n)); //n: jumlah katgori umum
    const score_2: number[][] = score.map((row) => useSlice(row, n));
    const weight: number[] = Indicators.map((ind) => ind.bobot);
    const weight_1: number[] = useSlice(weight, 0, n);
    const weight_2: number[] = useSlice(weight, n);
    const is_benefit: boolean[] = Indicators.map((ind) => (ind.is_benefit == 1 ? true : false));
    const is_benefit_1: boolean[] = useSlice(is_benefit, 0, n);
    const is_benefit_2: boolean[] = useSlice(is_benefit, n);
    const evaluatees: { name?: string; username: string }[] = Evaluatees.map((e) => ({ name: e.nama, username: e.username }));
    dataRankUmum.value = useTopsis(score_1, weight_1, is_benefit_1, evaluatees);
    dataRankPosisi.value = useTopsis(score_2, weight_2, is_benefit_2, evaluatees);
    if (!dataRankUmum.value || !dataRankPosisi.value) {
      reject("Gagal membuat rank");
    } else {
      resolve(dataRankPosisi.value);
    }
  });
}

// Add generated rank to database
function saveRank() {
  //save rank secara umum => rank mitra(???)
  return new Promise((resolve, reject) => {
    //save rank tiap poskeg
    const { mutate: sendRankMitraPosKegSurvei, onDone: resultRankMitraPosKegSurvei, onError: errorRankMitraPosKegSurvei } = useMutation(useCreateRankMitraPosKegSurvei());
    dataRankPosisi.value?.map((item: { username: string; preference_value: number }) => {
      sendRankMitraPosKegSurvei({
        input: {
          survei_kd,
          keg_kd,
          branch_kd,
          posisi_kd,
          username: item.username,
          nilai: item.preference_value,
        },
      });
      errorRankMitraPosKegSurvei((error) => {
        logErrorMessages(error);
        isDataLoading.value = false;
        isDataError.value = true;
        reject("Gagal menyimpan data peringkat");
      });
    });
    resolve("Berhasil menyimpan data peringkat");
  });
}
</script>

<template>
  <h3 class="font-bold">Daftar Penilaian</h3>
  <section>
    <!-- <h6>Tentang penilaian</h6> -->
    <table class="my-3">
      <tr class="">
        <td class="mb-2 pe-3">Survei</td>
        <td class="mb-2">: {{ dataKegSurvei?.Survei?.nama }}</td>
      </tr>
      <tr>
        <td class="mb-2 pe-3">Kegiatan</td>
        <td class="mb-2">: {{ dataKegSurvei?.Kegiatan?.nama }}</td>
      </tr>
      <tr>
        <td class="mb-2 pe-3">Posisi</td>
        <td class="mb-2">: {{ dataJumPosisiPetugasKegSurvei ? dataJumPosisiPetugasKegSurvei[0].Posisi.nama : "" }}</td>
      </tr>
      <tr>
        <td class="mb-2 pe-3">Jumlah Petugas</td>
        <td class="mb-2">: {{ dataJumPosisiPetugasKegSurvei ? dataJumPosisiPetugasKegSurvei[0].jumlah : "" }}</td>
      </tr>
      <tr>
        <td class="mb-2 pe-3">Progress Penilaian</td>
        <td class="mb-2">: {{ progressPercentage }}%</td>
      </tr>
      <tr>
        <td class="mb-2 pe-3">Opsi Persetujuan Operator</td>
        <td class="mb-2">: {{ isOperatorEditable ? "Perlu Persetujuan" : "Tanpa Persetujuan" }}</td>
      </tr>
      <tr v-if="isOperatorEditable">
        <td class="mb-2 pe-3">Status Persetujuan Operator</td>
        <td class="mb-2">: {{ isOperatorConfirmed ? "Telah Disetujui" : "Belum Disetujui" }}</td>
      </tr>
    </table>
    <BaseButtonMode
      v-if="!isOperatorConfirmed && isOperatorEditable && progressPercentage == 100"
      shape="square"
      mode="outlined"
      class="py-2 px-4 me-3"
      @click.prevent="
        async () => {
          const validated = await validateValue();
          if (!validated) {
            return;
          } else {
            persetujuanModal?.open();
            rejectData();
          }
        }
      "
      title="Seluruh penilaian akan dikembalikan kepada penilai dan status final dibatalkan"
      >Tolak Penilaian</BaseButtonMode
    >
    <BaseButtonMode
      v-if="!isOperatorConfirmed && isOperatorEditable && progressPercentage == 100"
      shape="square"
      mode="normal"
      class="py-2 px-4"
      @click.prevent="
        async () => {
          const validated = await validateValue();
          if (!validated) {
            return;
          } else {
            persetujuanModal?.open();
            confirmData();
          }
        }
      "
      >Setujui Penilaian dan Buat Peringkat</BaseButtonMode
    >
    <BaseButtonMode
      v-if="!isOperatorConfirmed && !isOperatorEditable && progressPercentage == 100"
      shape="square"
      mode="normal"
      class="py-2 px-4"
      @click.prevent="
        async () => {
          const validated = await validateValue();
          if (!validated) {
            return;
          } else {
            persetujuanModal?.open();
            confirmData();
          }
        }
      "
      >Buat Peringkat</BaseButtonMode
    >
    <NuxtLink :to="'/rekrutmen/nilai/laporan/' + 'kegiatan?survei_kd=' + survei_kd + '&keg_kd=' + keg_kd + '&branch_kd=' + branch_kd + '&posisi_kd=' + posisi_kd + '&tahun=' + tahun">
      <BaseButtonMode v-if="isOperatorConfirmed && progressPercentage == 100" shape="square" mode="outlined" class="py-3 px-4 ms-3">Lihat Laporan Evaluasi</BaseButtonMode>
    </NuxtLink>
    <!-- <ButtonLinkLaporan v-if="isOperatorConfirmed && progressPercentage == 100" :survei_kd="survei_kd.toString()" :keg_kd="keg_kd?.toString()" :branch_kd="branch_kd?.toString()" :posisi_kd="posisi_kd?.toString()" :tahun="tahun?.toString()" /> -->
  </section>
  <section>
    <div class="table-container rounded overflow-auto max-h-[480px] 2xl:max-h-[720px]">
      <table class="bg-white min-w-full" id="main-table">
        <thead class="text-slate-800 text-lg border-b border-slate-500 shadow">
          <tr>
            <th class="py-3 px-4">Petugas</th>
            <th class="py-3 px-4" v-for="ind in Indicators" :key="ind.urutan">{{ ind.nama }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(petugas, i) in Evaluatees" :key="petugas.id" class="hover:bg-slate-100 border-b border-slate-300">
            <td id="first-col" class="pe-6 hover:bg-slate-100">
              <div class="petugas logo py-2 px-4 flex items-center">
                <span class="me-3 inline-flex justify-center items-center h-12 w-12 rounded-full bg-slate-400 text-white">
                  <IconUserPenilaian />
                </span>
                <div class="petugas">
                  <p class="body1">{{ petugas.username }}</p>
                  <p class="body2 text-slate-500">{{ petugas.detail }}</p>
                </div>
              </div>
            </td>
            <td v-for="(ind, j) in Indicators" class="py-2 px-3">
              <div class="flex justify-center">
                <span v-if="!isOperatorEditable || isOperatorConfirmed">{{ dataNilai[i][j].nilai }}</span>
                <input
                  v-else
                  type="text"
                  v-model="dataNilai[i][j].nilai"
                  @click="dataNilai[i][j].valid = true"
                  class="py-2 px-3 w-24 border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                  :class="!dataNilai[i][j].valid && ' border-red-500 '"
                  :disabled="isOperatorConfirmed || !dataNilai[i][j].is_final || !dataNilai[i][j].id"
                  @change="validateInput(i, j)"
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="!isDataScaleValid" class="my-3 p-2 flex items-center rounded-lg border border-red-500 text-red-500 font-semibold"><IconWarning class="h-8 w-8 me-2" /> Pastikan nilai antara 1-5 tanpa koma!</div>
    <div class="my-3 p-3 flex item-center text-red-600 border rounded-lg" v-if="!isDataValid"><IconWarning class="w-6 h-6 me-2" />Pastikan semua nilai petugas telah terisi semua!</div>
    <div class="flex justify-end mt-3" v-if="isOperatorEditable">
      <BaseButtonMode v-if="!isOperatorConfirmed && isOperatorEditable" shape="square" mode="outlined" class="py-3 px-4" @click.prevent="saveChanges()">Simpan Perubahan</BaseButtonMode>
    </div>
    <ModalBase ref="persetujuanModal">
      <template #header><h5 class="font-bold text-gray-800">Konfirmasi {{ persetujuan ? 'persetujuan' : 'tolak'}} penilaian?</h5></template>
      <template #body>
        <div class="grid place-content-center">
          <IconWarning class="justify-self-center h-24 w-24 text-slate-800" />
          <div class="text-center">{{ persetujuanMsg }}</div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-around">
          <BaseButtonMode
            shape="square"
            mode="outlined"
            @click="
              {
                handleUserInput(false);
                persetujuanModal?.close();
              }
            "
            class="px-8"
            >Batal</BaseButtonMode
          >
          <BaseButtonMode
            shape="square"
            mode="normal"
            @click="
              {
                handleUserInput(true);
                persetujuanModal?.close();
              }
            "
            class="px-8"
            >Konfirmasi</BaseButtonMode
          >
        </div>
      </template>
    </ModalBase>
  </section>
  <section v-if="isRanked">
    Peringkat:
    <p>{{ dataRankUmum }}</p>
    <p>{{ dataRankPosisi }}</p>
  </section>
  <!-- Modal -->
  <ModalSuccess v-if="isDataSent" @close="isDataSent = !isDataSent" />
  <ModalLoading v-if="isDataLoading" @close="isDataLoading = !isDataLoading" />
  <ModalError v-if="isDataError" @close="isDataError = !isDataError" />
</template>
<style scope>
#main-table tr th:first-child,
#main-table td:first-child {
  position: sticky;
  left: 0;
  z-index: 10;
  background: #fff;
}
#main-table td:first-child:hover {
  background-color: rgb(241 245 249);
}
#main-table tr th:first-child {
  z-index: 11;
}
#main-table tr th {
  position: sticky;
  top: 0;
  z-index: 9;
  background: #fff;
}
</style>

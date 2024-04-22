<script setup lang="ts">
import { logErrorMessages } from "@vue/apollo-util";
import { useGetNilaiKategoriIndikator, useUpdateNilaiKategoriIndikator } from "~/composables/useQueries";
useSeoMeta({
  title: "Nilai Mitra",
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
};
type savedNilai = {
  nilaikategoriindikator_id?: string;
  nilai: string;
};
//modal
const isDataSent = ref(false);
const isDataLoading = ref(false);
const isDataError = ref(false);
// query
const route = useRoute();
const { survei_kd, keg_kd, branch_kd, posisi_kd, tahun } = route.query;

// Getting data
// 1. poskegsurvei bersesuaian

// 1.b petugas survei
// 2. struktur penugasan, user= parent. Mencari petugas yang akan dinilai
const { data: resultPenugasanStruktur } = await useAsyncQuery(useSearchPenugasanStruktur(), { keg_kd, branch_kd, posisi_kd });
const dataPenugasanStruktur: any[] = resultPenugasanStruktur.value?.searchPenugasanStruktur;

// 3. kategori nested, get indikator name. Mencari kategori penilaian sesuai kegiatan survei beserta kategori umum(wajib)
const { data: resultJumPosisiPetugasKegSurvei } = await useAsyncQuery(useSearchJumPosisiPetugasKegSurvei(), { survei_kd, keg_kd, branch_kd, posisi_kd });
const dataJumPosisiPetugasKegSurvei: any[] = resultJumPosisiPetugasKegSurvei.value?.searchJumPosisiPetugasKegSurvei;
const { data: resultKategoriUmum } = await useAsyncQuery(useGetKategori(), { id: 1 });
const dataKategoriUmum: any[] = resultKategoriUmum.value?.Kategori.KategoriIndikator;

// 4. Nilai yang pernah disimpan
const { data: resultSavedNilai } = await useAsyncQuery(useGetNilaiKategoriIndikator(), { survei_kd, keg_kd, branch_kd, posisi_kd });
const dataSavedNilai: any[] = resultSavedNilai.value?.NilaiKategoriIndikator;

// initialize data
// data query: user & indicators; data nilai yg telah disimpan -> bind dg data input: dataNliai
let Evaluatees: evaluatee[] = [];
let Indicators: indicator[] = [];

try {
  if (useToLower(resultKategoriUmum.value?.Kategori.nama) !== "umum") {
    console.log(resultKategoriUmum.value);
    throw new Error("Gagal mendapatkan kategori umum!");
  }
  for (const item of dataPenugasanStruktur) {
    const temp: evaluatee = {
      id: item.User.user_id,
      username: item.username,
    };
    Evaluatees.push(temp);
  }
  for (const item of dataKategoriUmum) {
    const temp: indicator = {
      urutan: item.no_urut,
      nama: item.indikator.nama,
      kategoriIndikator_id: parseInt(item.kategoriIndikator_id),
    };
    Indicators.push(temp);
  }
  const n = dataKategoriUmum.length;
  for (const item of dataJumPosisiPetugasKegSurvei[0].kategori.KategoriIndikator) {
    const temp: indicator = {
      urutan: item.no_urut + n,
      nama: item.indikator.nama,
      kategoriIndikator_id: parseInt(item.kategoriIndikator_id),
    };
    Indicators.push(temp);
  }
} catch (e) {
  console.log(e);
}
Indicators = useSortBy(Indicators, ["urutan"]);
const kategoriIndikator_id = Indicators.map((ind) => ind.kategoriIndikator_id);
const i = Evaluatees.length;
const j = Indicators.length;
const dataNilai: string[][] = reactive(Array.from(Array(i), () => new Array(j).fill('')));
const dataNilaiId: string[][] = reactive(Array.from(Array(i), () => new Array(j).fill('')));
const dataNilaiValidation: boolean[][] = reactive(Array.from(Array(i), () => new Array(j).fill(true)));
const isDataFinalized = ref(false); //cek data terkahir
// Masukan data nilai yang telah ada
if (dataSavedNilai.length > 0) {
  for (let i = 0; i < Evaluatees.length; i++) {
    for (let j = 0; j < Indicators.length; j++) {
      let temp = useFind(dataSavedNilai, { username: Evaluatees[i].username, kategoriIndikator_id: Indicators[j].kategoriIndikator_id });
      if (temp) {
        if(i== (Evaluatees.length-1) && j==(Indicators.length-1)) isDataFinalized.value = temp.is_final;
        dataNilaiId[i][j] = temp.nilaikategoriindikator_id;
        dataNilai[i][j] = temp.nilai;
      }
    }
  }
}
/**
 * Sending data
 */
// validation input: untuk finalisasi, data tidak boleh kososng.
const dataValid = ref(true);
function validateForm() {
  dataValid.value = true;
  for (let i = 0; i < dataNilai.length; i++) {
    for (let j = 0; j < dataNilai[i].length; j++) {
      if (dataNilai[i][j] === "0" || isNil(dataNilai[i][j])) {
        dataNilaiValidation[i][j] = false
        if(dataValid.value) dataValid.value = false
      };
    }
  }
  // let temp = useWithout(dataNilaiValidation, [true]);
  // let temp = dataNilaiValidation.map(b => b===false);
  // if (temp.length > 0) dataValid.value = false;
}
// send data
function sendData(is_final: boolean) {
  if (is_final) {
    validateForm();
    if (!dataValid.value) return;
  }
  isDataLoading.value = true;
  if (dataSavedNilai.length > 0) {
    updateDataNilai(is_final);
  } else {
    createDataNilai(is_final);
  }
}
function createDataNilai(is_final: boolean) {
  //define query
  const { mutate: sendNilaiKategoriIndikator, onDone: resultNilaiKategoriIndikator, onError: errorNilaiKategoriIndikator, loading: loadingNilaiKategoriIndikator } = useMutation(useCreateNilaiKategoriIndikator());
  // loop user
  for (let i = 0; i < Evaluatees.length; i++) {
    const nilai = dataNilai[i].flatMap((v) => parseInt(v));
    const dataNilaiKategoriIndikator = sendNilaiKategoriIndikator({
      input: {
        survei_kd,
        keg_kd,
        branch_kd,
        posisi_kd,
        username: Evaluatees[i].username,
        kategoriIndikator_id,
        nilai,
        is_final,
        tahun,
      },
    });
    errorNilaiKategoriIndikator((error) => {
      logErrorMessages(error);
      isDataLoading.value = false;
      isDataError.value = true;
      // break;
      return;
    });
    console.log(dataNilaiKategoriIndikator);
  }
  resultNilaiKategoriIndikator(async() => {
    isDataLoading.value = false;
    // isDataSent.value = true;
    const waiting =  await useWaitS(2);
    if(waiting) reloadNuxtApp();
  });
}
function updateDataNilai(is_final: boolean) {
  //define query
  const { mutate: sendUpdateNilai, onDone: resultUpdateNilai, onError: errorUpdateNilai, loading: loadingUpdateNilai } = useMutation(useUpdateNilaiKategoriIndikator());
  // loop user
  for (let i = 0; i < Evaluatees.length; i++) {
    for (let j = 0; j < dataNilai[i].length; j++) {
      const dataNilaiKategoriIndikator = sendUpdateNilai({
        id: parseInt(dataNilaiId[i][j]),
        nilai: parseInt(dataNilai[i][j]),
        is_final,
      });
      errorUpdateNilai((error) => {
        logErrorMessages(error);
        isDataLoading.value = false;
        isDataError.value = true;
        // break;
        return;
      });
      console.log(dataNilaiKategoriIndikator);
    }
  }
  resultUpdateNilai(async () => {
    isDataLoading.value = false;
    // isDataSent.value = true;
    // reload/navigate
    const waiting =  await useWaitS(2);
    if(waiting) reloadNuxtApp();
  });
}
// console.log(Evaluatees)
function cek() {
  validateForm();
  console.log(dataNilai);
  console.log(dataNilaiValidation);
}
</script>

<template>
  <h3 class="font-bold">Form Penilaian</h3>

  <section>
    <div class="detail">Tetang kegiatan</div>
    <div class="flex justify-between items-center">
      <h6>Nilai menggunakan excel :</h6>
      <div class="flex">
        <BaseButtonMode shape="square" mode="normal" :class="'me-5'">
          <div class="flex items-center">
            Unduh Template Penilaian
            <IconDownload />
          </div>
        </BaseButtonMode>
        <!-- <BaseButtonMode shape="square" mode="outlined">
          <div class="flex items-center">
            Unggah Penilaian
            <IconUpload/>
          </div>
        </BaseButtonMode> -->
      </div>
    </div>
    <div class="flex justify-between items-center mt-3">
      <h6>Unggah Penilaian :</h6>
      <div class="flex">
        <form>
          <label class="block">
            <input
              type="file"
              class="block w-full text-sm text-gray-500 file:me-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:disabled:opacity-50 file:disabled:pointer-events-none"
            />
          </label>
        </form>
      </div>
    </div>
  </section>

  <section>
    <form class="">
      <div class="table-container rounded overflow-auto max-h-[480px] 2xl:max-h-[720px]">
        <table class="bg-white min-w-full">
          <thead class="text-slate-800 text-lg border-b border-slate-500 shadow">
            <tr>
              <th class="py-3 px-6 bg-white">Petugas</th>
              <th class="py-3 px-6" v-for="ind in Indicators" :key="ind.urutan">{{ ind.nama }}</th>
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
              <td v-for="(ind, j) in Indicators" class="py-2 px-4">
                <div class="flex justify-center">
                  <input
                    type="text"
                    v-model="dataNilai[i][j]"
                    :class="!dataNilaiValidation[i][j] && 'border-red-500 '"
                    @click="dataNilaiValidation[i][j] = true"
                    class="py-2 px-3 w-24 border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                    placeholder=""
                    :disabled="isDataFinalized"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="!dataValid" class="my-3 p-2 flex items-center rounded-lg border border-red-500 text-red-500 font-semibold"><IconWarning class="h-8 w-8 me-2" /> Pastikan seluruh nilai telah diiisi untuk memfinalisasi!</div>
      <div class="submission flex justify-end mt-6">
        <BaseButtonMode shape="square" mode="outlined" class="me-5" @click.prevent="sendData(false)" :not-active="isDataFinalized"> Simpan Data </BaseButtonMode>
        <BaseButtonMode shape="square" mode="normal" @click.prevent="sendData(true)"  :not-active="isDataFinalized">Finalisasi</BaseButtonMode>
        <!-- <BaseButtonMode shape="square" mode="normal" @click.prevent="cek()">Cekingg</BaseButtonMode> -->
        <!-- http://localhost:3000/evaluasi/nilaimitra/kegiatan?survei_kd=0203A&keg_kd=0123B&branch_kd=000abc&posisi_kd=0123C -->
      </div>
    </form>
  </section>
  <!-- Modal -->
  <ModalSuccess v-if="isDataSent" @close="isDataSent = !isDataSent" />
  <ModalLoading v-if="isDataLoading" @close="isDataLoading = !isDataLoading" />
  <ModalError v-if="isDataError" @close="isDataError = !isDataError" />
</template>

<style scope>
/* tr th {
  border: 1px solid blue;
}
tr td {
  border: 1px solid blueviolet;
} */
table tr th:first-child,
table td:first-child {
  position: sticky;
  left: 0;
  z-index: 10;
  background: #fff;
}
table tr th:first-child {
  z-index: 11;
}
table tr th {
  position: sticky;
  top: 0;
  z-index: 9;
  background: #fff;
}
</style>

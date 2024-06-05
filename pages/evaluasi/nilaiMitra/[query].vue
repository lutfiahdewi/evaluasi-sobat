<script setup lang="ts">
import { logErrorMessages } from "@vue/apollo-util";
import { useGetNilaiKategoriIndikator, useUpdateNilaiKategoriIndikator } from "~/composables/useQueries";
import * as XLSX from "xlsx";

useSeoMeta({
  title: "Nilai Mitra",
});

interface MixedDictionary {
  // staticKey: string;
  [key: string]: string | number | undefined; // Can accommodate the staticKey too
}
interface evaluatee {
  id: number;
  username: string;
  nama?: string;
  detail?: string;
}
type indicator = {
  urutan: number;
  nama: string;
  definisi: string;
  kategoriIndikator_id: number;
};
type savedNilai = {
  nilaikategoriindikator_id?: string;
  nilai: string;
};
//modal
const isDataLoading = ref(false);
const isDataError = ref(false);
// query
const route = useRoute();
const { survei_kd, keg_kd, branch_kd, posisi_kd, tahun } = route.query;

// Getting data
// 1. poskegsurvei bersesuaian
const { data: resultKegSurvei } = await useAsyncQuery(useGetKegSurvei(), { survei_kd, keg_kd });
const dataKegSurvei = resultKegSurvei.value?.KegSurvei[0];
const isOperatorEditable = ref();

// 1.b petugas survei
// 2. struktur penugasan, user= parent. Mencari petugas yang akan dinilai
const { data: resultPenugasanStruktur } = await useAsyncQuery(useSearchPenugasanStruktur(), { survei_kd, keg_kd, branch_kd, posisi_kd });
const dataPenugasanStruktur: any[] = resultPenugasanStruktur.value?.searchPenugasanStruktur;

// 3. kategori nested, get indikator name. Mencari kategori penilaian sesuai kegiatan survei beserta kategori umum(wajib)
const { data: resultJumPosisiPetugasKegSurvei } = await useAsyncQuery(useSearchJumPosisiPetugasKegSurvei(), { survei_kd, keg_kd, branch_kd, posisi_kd });
const dataJumPosisiPetugasKegSurvei: any[] = resultJumPosisiPetugasKegSurvei.value?.searchJumPosisiPetugasKegSurvei;
const isOperatorConfirmed = ref();

const { data: resultKategoriUmum } = await useAsyncQuery(useGetKategori(), { id: 1 });
const dataKategoriUmum: any[] = resultKategoriUmum.value?.Kategori.KategoriIndikator;

// 4. Nilai yang pernah disimpan(saat load data)

// initialize data
// data query: user & indicators; data nilai yg telah disimpan -> bind dg data input: dataNliai
let Evaluatees: evaluatee[] = [];
let Indicators: indicator[] = [];

try {
  if (!useIncludes(useToLower(resultKategoriUmum.value?.Kategori.nama), "umum")) {
    console.log(resultKategoriUmum.value);
    throw new Error("Gagal mendapatkan kategori umum!");
  }
  isOperatorEditable.value = dataKegSurvei.is_confirm;
  isOperatorConfirmed.value = dataJumPosisiPetugasKegSurvei[0].is_confirmed;
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
      definisi: item.indikator.definisi,
      kategoriIndikator_id: parseInt(item.kategoriIndikator_id),
    };
    Indicators.push(temp);
  }
  const n = dataKategoriUmum.length;
  for (const item of dataJumPosisiPetugasKegSurvei[0].kategori.KategoriIndikator) {
    const temp: indicator = {
      urutan: item.no_urut + n,
      nama: item.indikator.nama,
      definisi: item.indikator.definisi,
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
const dataNilai: string[][] = reactive(Array.from(Array(i), () => new Array(j).fill("")));
const dataNilaiId: string[][] = reactive(Array.from(Array(i), () => new Array(j).fill("")));
const dataNilaiValidation: boolean[][] = reactive(Array.from(Array(i), () => new Array(j).fill(true)));
const isDataFinalized = ref(false); //cek data terkahir
// Masukan data nilai yang telah ada
async function loadSavedData() {
  for (let i = 0; i < Evaluatees.length; i++) {
    // 4. Nilai yang pernah disimpan
    const { data: resultSavedNilai } = await useAsyncQuery(useGetNilaiKategoriIndikator(), { survei_kd, keg_kd, branch_kd, posisi_kd, username: Evaluatees[i].username });
    if (resultSavedNilai.value) {
      for (let j = 0; j < Indicators.length; j++) {
        let temp = useFind(resultSavedNilai.value?.NilaiKategoriIndikator, { kategoriIndikator_id: Indicators[j].kategoriIndikator_id });
        if (temp) {
          if (i == Evaluatees.length - 1 && j == Indicators.length - 1) isDataFinalized.value = temp.is_final;
          dataNilaiId[i][j] = temp.nilaikategoriindikator_id;
          dataNilai[i][j] = temp.nilai;
        }
      }
    }
  }
}
loadSavedData();
/**
 * Sending data
 */
// validation input: untuk finalisasi, data tidak boleh kososng.
const dataValid = ref(true);
const dataScaleValid = ref(true);
const dataScale = ["1", "2", "3", "4", "5"];
function validateForm() {
  dataValid.value = true;
  for (let i = 0; i < dataNilai.length; i++) {
    for (let j = 0; j < dataNilai[i].length; j++) {
      if (!useIncludes(dataScale, dataNilai[i][j].toString()) || isNil(dataNilai[i][j])) {
        dataNilaiValidation[i][j] = false;
        validateInput(i, j);
        if (dataValid.value) dataValid.value = false;
      }
    }
  }
}
function validateInput(i: number, j: number) {
  if (!isNil(dataNilai[i][j])) {
    if (!useIncludes(dataScale, dataNilai[i][j].toString())) {
      dataNilaiValidation[i][j] = false;
    }
    dataScaleValid.value = !useIncludes(useFlatMapDeep(dataNilaiValidation), false);
  }
}

// send data
function sendData(is_final: boolean) {
  if (is_final) {
    validateForm();
    if (!dataValid.value || !dataScaleValid.value) return;
  } else {
    dataNilai.forEach((row, i) => {
      row.forEach((_: any, j: number) => validateInput(i, j));
    });
    if (!dataScaleValid.value) return;
  }
  isDataLoading.value = true;
  if (dataNilaiId[0][0] != "") {
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
      return;
    });
    // console.log(dataNilaiKategoriIndikator);
  }
  resultNilaiKategoriIndikator(async () => {
    isDataLoading.value = false;
    const waiting = await useWaitS(2);
    if (waiting) reloadNuxtApp();
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
        // console.log({ id: dataNilaiId[i][j], nilai: dataNilai[i][j], is_final });
        logErrorMessages(error);
        isDataLoading.value = false;
        isDataError.value = true;
        // break;
        return;
      });
      // console.log(dataNilaiKategoriIndikator);
    }
  }
  resultUpdateNilai(async () => {
    isDataLoading.value = false;
    const waiting = await useWaitS(2);
    if (waiting) reloadNuxtApp();
  });
}

// Export template and read data
function downloadTemplate() {
  const dataTemplate: MixedDictionary[] = [];
  Evaluatees.forEach((item, i) => {
    let temp: MixedDictionary = {
      id: item.id,
      petugas: item.nama ?? item.username,
    };
    Indicators.forEach((ind, j) => {
      temp[ind.nama] = dataNilai[i][j];
    });
    dataTemplate.push(temp);
  });
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(dataTemplate);
  XLSX.utils.book_append_sheet(workbook, worksheet, "Penilaian");
  const title: string = (dataKegSurvei ? dataKegSurvei?.Survei?.nama + " " + dataKegSurvei?.Kegiatan?.nama : "Survei Kegiatan ") + (dataJumPosisiPetugasKegSurvei ? " " + dataJumPosisiPetugasKegSurvei[0].Posisi.nama : " Posisi");
  XLSX.writeFile(workbook, "Template Penilaian Evaluasi " + title + ".xlsx");
}
const fileInput = ref<HTMLInputElement | null>(null);
const files = ref();

function handleFileChange() {
  files.value = fileInput.value?.files;
  readTemplate();
}
const isFileSame = ref(true);
async function readTemplate() {
  try {
    const file = files.value[0];
    const title: string = (dataKegSurvei ? dataKegSurvei?.Survei?.nama + " " + dataKegSurvei?.Kegiatan?.nama : "Survei Kegiatan ") + (dataJumPosisiPetugasKegSurvei ? " " + dataJumPosisiPetugasKegSurvei[0].Posisi.nama : " Posisi");
    isFileSame.value = useIncludes(file.name, title);
    if (!isFileSame.value) {
      // throw new Error("Nama file tidak sama!");
      return;
    } else {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      var first_sheet = workbook.Sheets[workbook.SheetNames[0]];
      const uploadedData: MixedDictionary[] = XLSX.utils.sheet_to_json(first_sheet);
      for (let i = 0; i < Evaluatees.length; i++) {
        let matchPetugas = useFind(uploadedData, { id: Evaluatees[i].id });
        if (!matchPetugas) {
          isFileSame.value = false;
          return;
        } else {
          for (let j = 0; j < Indicators.length; j++) {
            dataNilai[i][j] = matchPetugas[Indicators[j].nama]?.toString() || '';
            // console.log(matchPetugas[Indicators[j].nama])
          }
        }
      }
      const delay = await useWaitS(0.05 * uploadedData.length);
      // if (delay) sendData(false);
    }
  } catch (e) {
    console.log(e);
  }
}
</script>

<template>
  <h3 class="font-bold">Form Penilaian</h3>

  <section>
    <div class="detail-kegiatan">
      <div class="hs-accordion-group mb-6">
        <div class="hs-accordion" id="hs-basic-with-title-and-arrow-stretched-heading-one">
          <button
            class="hs-accordion-toggle hs-accordion-active:text-blue-700 hs-accordion-active:border-blue-700 p-3 inline-flex items-center justify-between gap-x-3 w-full text-start hover:bg-slate-200 rounded-lg border border-slate-500 disabled:opacity-50 disabled:pointer-events-none"
            aria-controls="hs-basic-with-title-and-arrow-stretched-collapse-one"
          >
            Detail Kegiatan
            <IconArrowDown class="hs-accordion-active:hidden block size-4" />
            <IconArrowUp class="hs-accordion-active:block hidden size-4" />
          </button>
          <div
            id="hs-basic-with-title-and-arrow-stretched-collapse-one"
            class="hs-accordion-content bg-slate-200 rounded hidden w-full p-3 overflow-hidden transition-[height] duration-300"
            aria-labelledby="hs-basic-with-title-and-arrow-stretched-heading-one"
          >
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
                <td class="mb-2 pe-3">Opsi Persetujuan</td>
                <td class="mb-2">: {{ isOperatorEditable ? "Perlu Persetujuan" : "Tanpa Persetujuan" }}</td>
              </tr>
              <tr v-if="isOperatorEditable">
                <td class="mb-2 pe-3">Status Persetujuan</td>
                <td class="mb-2">: {{ isOperatorConfirmed ? "Telah Disetujui" : "Belum Disetujui" }}</td>
              </tr>
            </table>
          </div>
        </div>
        <div class="hs-accordion" id="hs-basic-two">
          <button
            class="hs-accordion-toggle hs-accordion-active:text-blue-700 hs-accordion-active:border-blue-700 p-3 inline-flex items-center justify-between gap-x-3 w-full text-start hover:bg-slate-200 rounded-lg border border-slate-500 disabled:opacity-50 disabled:pointer-events-none"
            aria-controls="hs-basic-two"
          >
            Penjelasan indikator penilaian
            <IconArrowDown class="hs-accordion-active:hidden block size-4" />
            <IconArrowUp class="hs-accordion-active:block hidden size-4" />
          </button>
          <div id="hs-basic-two" class="hs-accordion-content bg-slate-200 rounded hidden w-full p-3 overflow-hidden transition-[height] duration-300" aria-labelledby="hs-basic-two">
            <ul>
              <li v-for="ind in Indicators" :key="ind.urutan" class="mb-2">
                {{ ind.nama }} :
                <div v-html="ind.definisi" class="wysiwyg ps-4"></div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="flex justify-between items-center ps-3">
      <h6>Nilai menggunakan excel :</h6>
      <BaseButtonMode shape="square" mode="normal" :class="'me-5'" @click="downloadTemplate()">
        <div class="flex items-center">
          Unduh Template Penilaian
          <IconDownload />
        </div>
      </BaseButtonMode>
    </div>
    <div class="flex justify-between items-center mt-3 ps-3">
      <h6>Unggah Penilaian :</h6>
      <div class="flex">
        <form>
          <label class="block">
            <input
              ref="fileInput"
              type="file"
              @change="handleFileChange"
              :disabled="isDataFinalized"
              class="block w-full text-sm text-gray-500 file:me-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:disabled:opacity-50 file:disabled:pointer-events-none"
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            />
          </label>
        </form>
      </div>
    </div>
    <div v-if="!isFileSame" class="my-3 p-3 flex item-center text-red-600 border rounded-lg"><IconWarning class="w-6 h-6 me-2" />File yang diunggah tidak sama dengan template!</div>
  </section>

  <section>
    <form class="">
      <div class="table-container rounded overflow-auto max-h-[480px] 2xl:max-h-[720px]">
        <table class="bg-white min-w-full" id="penilaian">
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
                    <p class="body1">{{ petugas.nama ?? petugas.username  }}</p>
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
                    :disabled="isDataFinalized"
                    @focusout="validateInput(i, j)"
                    @enter="validateInput(i, j)"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="!dataScaleValid" class="my-3 p-2 flex items-center rounded-lg border border-red-500 text-red-500 font-semibold"><IconWarning class="h-8 w-8 me-2" /> Pastikan nilai antara 1-5 tanpa koma!</div>
      <div v-if="!dataValid" class="my-3 p-2 flex items-center rounded-lg border border-red-500 text-red-500 font-semibold"><IconWarning class="h-8 w-8 me-2" /> Pastikan seluruh nilai telah diiisi untuk memfinalisasi!</div>
      <div class="submission flex justify-end mt-6">
        <BaseButtonMode shape="square" mode="outlined" class="me-5" @click.prevent="sendData(false)" :not-active="isDataFinalized"> Simpan Data </BaseButtonMode>
        <BaseButtonMode shape="square" mode="normal" @click.prevent="sendData(true)" :not-active="isDataFinalized">Finalisasi</BaseButtonMode>
      </div>
    </form>
  </section>
  <!-- Modal -->
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
#penilaian tr th:first-child,
#penilaian td:first-child {
  position: sticky;
  left: 0;
  z-index: 10;
  background: #fff;
}
#penilaian tr th:first-child {
  z-index: 11;
}
#penilaian tr th {
  position: sticky;
  top: 0;
  z-index: 9;
  background: #fff;
}
</style>

<script setup lang="ts">
import { logErrorMessages } from '@vue/apollo-util';

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
let n :number
try {
  n = dataKategoriUmum.length;//splt data
  isOperatorEditable.value = dataKegSurvei.is_confirm;
  isOperatorConfirmed.value = dataJumPosisiPetugasKegSurvei[0].is_confirmed;
  if (useToLower(resultKategoriUmum.value?.Kategori.nama) !== "umum") {
    console.log(resultKategoriUmum.value);
    throw new Error("Gagal mendapatkan kategori umum!");
  }
  //   for (const item of dataPenugasanStruktur) {
  //     const temp: evaluatee = {
  //       id: item.User.user_id,
  //       username: item.username,
  //     };
  //     Evaluatees.push(temp);
  //   }
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
      is_benefit: item.indikator.is_benefit
    };
    Indicators.push(temp);
  }
} catch (e) {
  console.log(e);
}
Indicators = useSortBy(Indicators, ["urutan"]);
//4. Semua username yang telibat mjd petugas(harus dinilai) pada PenugasanStruktur
const { data: resultPenugasanStruktur } = await useAsyncQuery(useGetPenugasanStruktur(), { keg_kd, branch_kd, posisi_kd });
const dataPenugasanStruktur: any[] = resultPenugasanStruktur.value?.PenugasanStruktur;
const Evaluatees: evaluatee[] = dataPenugasanStruktur?.map((item) => ({ id: item.User.user_id, username: item.username, nama: item.User.nama }));
//5. Buat data matriks nilai petugas dan kategori penilaian bersesuaian
const p = Evaluatees?.length;
const q = Indicators.length;
const dataNilai: data_nilai[][] = reactive(Array.from(Array(p), () => new Array(q)));
for (let i = 0; i < p; i++) {
  for (let j = 0; j < q; j++) {
    let foundObj = useFind(dataSavedNilai, { username: Evaluatees[i].username, kategoriIndikator_id: Indicators[j].kategoriIndikator_id });
    let temp: data_nilai = { valid: true };
    if (foundObj) {
      temp.id = foundObj.nilaikategoriindikator_id;
      temp.nilai = foundObj.nilai;
      temp.is_final = foundObj.is_final;
    }
    dataNilai[i][j] = temp;
  }
}

// valiadasi jika konfirmasi persetujuan  dengan nilai kosong

// valiadasi jika generate dengan nilai kosong

// Simpan perubahan
function updateDataNilai() {
  isDataLoading.value = true;
  //define query
  const { mutate: sendUpdateNilai, onDone: resultUpdateNilai, onError: errorUpdateNilai, loading: loadingUpdateNilai } = useMutation(useUpdateNilaiKategoriIndikator());
  // loop user
  for (let i = 0; i < Evaluatees.length; i++) {
    for (let j = 0; j < dataNilai[i].length; j++) {
      sendUpdateNilai({
        id: parseInt(dataNilai[i][j].id || '0'),
        nilai: parseInt(dataNilai[i][j].nilai || '0'),
        is_final: dataNilai[i][j].is_final,
      });
      errorUpdateNilai((error) => {
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
    // isDataSent.value = true;
    // reload/navigate
    const waiting =  await useWaitS(2);
    if(waiting) reloadNuxtApp();
  });
}

// Konfirmasi persetujuam

// Generate peringkat
const isRanked = ref(false);
const dataRankUmum = ref();
const dataRankPosisi = ref();
function generateRank(){
  isRanked.value = true;
  const score :number[][]= dataNilai.map(row => row.map(col => parseInt(col.nilai || '0', 10)));
  const score_1 :number[][]= score.map(row => useSlice(row, 0, n)); //n: jumlah katgori umum
  const score_2 :number[][]= score.map(row => useSlice(row, n));
  const weight :number[]= Indicators.map(ind => ind.bobot);
  const weight_1 :number[]= useSlice(weight, 0, n)
  const weight_2 :number[]= useSlice(weight, n)
  const is_benefit :boolean[] = Indicators.map(ind => ind.is_benefit==1 ? true : false);
  const is_benefit_1 :boolean[] =useSlice(is_benefit, 0 ,n)
  const is_benefit_2 :boolean[] =useSlice(is_benefit, n)
  const evaluatees :{name: string}[]= Evaluatees.map(e => ({name: e.nama ? e.nama : e.username}))
  /*console.log(score);
  console.log(score_1);
  console.log(score_2);
  console.log(weight);
  console.log(weight_1);
  console.log(weight_2);
  console.log(is_benefit);
  console.log(evaluatees);*/
  dataRankUmum.value = useTopsis(score_1, weight_1, is_benefit_1, evaluatees);
  dataRankPosisi.value = useTopsis(score_2, weight_2, is_benefit_2, evaluatees);
}
</script>

<template>
  <h3 class="font-bold">Daftar Penilaian</h3>
  <section>
    <h6>Tentang penilaian</h6>
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
        <td class="mb-2">: {{ dataJumPosisiPetugasKegSurvei ? dataJumPosisiPetugasKegSurvei[0].Posisi.nama : '' }}</td>
      </tr>
      <tr>
        <td class="mb-2 pe-3">Jumlah Petugas</td>
        <td class="mb-2">: {{  dataJumPosisiPetugasKegSurvei ? dataJumPosisiPetugasKegSurvei[0].Posisi.jumlah : ''  }}</td>
      </tr>
      <tr>
        <td class="mb-2 pe-3">Opsi Persetujuan Operator</td>
        <td class="mb-2">: {{ isOperatorEditable ? "Perlu Persetujuan" : "Tanpa Persetujuan" }}</td>
      </tr>
      <tr>
        <td class="mb-2 pe-3">Progress Penilaian</td>
        <td class="mb-2">:???</td>
      </tr>
      <tr v-if="isOperatorEditable">
        <td class="mb-2 pe-3">Status Persetujuan Operator</td>
        <td class="mb-2">: {{ isOperatorConfirmed ? "Telah Disetujui" : "Belum Disetujui" }}</td>
      </tr>
    </table>
    <BaseButtonMode shape="square" mode="normal" class="py-2 px-4">Setujui Penilaian dan Buat Peringkat</BaseButtonMode>
    <BaseButtonMode shape="square" mode="normal" class="py-2 px-4" @click.prevent="generateRank()">Buat Peringkat</BaseButtonMode>
  </section>
  <section>
    <div class="table-container rounded overflow-auto max-h-[480px] 2xl:max-h-[720px]">
      <table class="bg-white min-w-full" id="main-table">
        <thead class="text-slate-800 text-lg border-b border-slate-500 shadow">
          <tr>
            <th class="py-3 px-4">Petugas</th>
            <th class="py-3 px-4" v-for="ind in Indicators" :key="ind.urutan">{{ ind.nama }}</th>
            <!-- <th class="py-3 px-4" v-if="isOperatorEditable">Aksi</th> -->
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
                <span v-if="!isOperatorEditable">{{ dataNilai[i][j].nilai }}</span>
                <input
                  v-else
                  type="text"
                  v-model="dataNilai[i][j].nilai"
                  :class="!dataNilai[i][j].valid && 'border-red-500 '"
                  @click="dataNilai[i][j].valid = true"
                  class="py-2 px-3 w-24 border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                  placeholder="-"
                  :disabled="isOperatorConfirmed || !dataNilai[i][j].is_final || !dataNilai[i][j].id"
                />
              </div>
            </td>
            <!-- <td v-if="isOperatorEditable">
            <div class="flex justify-between px-3">
              <IconEdit class="w-8 h-8 p-1 rounded-md bg-slate-600 text-white hover:bg-slate-700" />
              <IconDelete class="w-8 h-8 p-[1px] rounded-md bg-red-600 text-white hover:bg-red-700 pointer-events-auto" />
            </div>
            </td> -->
          </tr>
        </tbody>
      </table>
    </div>
    <div class="flex justify-end mt-3" v-if="isOperatorEditable">
      <BaseButtonMode shape="square" mode="outlined" class="py-3 px-4" @click.prevent="updateDataNilai()">Simpan Perubahan</BaseButtonMode>
    </div>
  </section>
  <section v-if="isRanked">Peringkat:
  <p>{{dataRankUmum}}</p>
  <p>{{dataRankPosisi}}</p>
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

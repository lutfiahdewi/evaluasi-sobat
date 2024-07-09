<script setup lang="ts">
import * as XLSX from "xlsx";

useSeoMeta({
  title: "Laporan Penilaian",
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
  kategoriIndikator_id: number;
  kategori: string;
  bobot: number;
  is_benefit: number;
};
type data_nilai = {
  id: string;
  nilai: string;
  //   valid: boolean;
  //   is_final: boolean;
};
type rank = {
  username: string;
  nama?: string;
  nilai_preferensi: number;
  nilai_indikator: number[];
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

//2. Get nilai (nilaiKategoriIndikator)
const { data: resultSavedNilai } = await useAsyncQuery(useGetNilaiKategoriIndikator(), { survei_kd, keg_kd, branch_kd, posisi_kd, tahun });
const dataSavedNilai: any[] = resultSavedNilai.value?.NilaiKategoriIndikator;

// 3. kategori nested, get indikator name. Mencari kategori penilaian sesuai kegiatan survei beserta kategori umum(wajib)
const { data: resultJumPosisiPetugasKegSurvei } = await useAsyncQuery(useSearchJumPosisiPetugasKegSurvei(), { survei_kd, keg_kd, branch_kd, posisi_kd });
const dataJumPosisiPetugasKegSurvei = resultJumPosisiPetugasKegSurvei.value?.searchJumPosisiPetugasKegSurvei;
const { data: resultKategoriUmum } = await useAsyncQuery(useGetKategori(), { id: 1 });
const dataKategoriUmum: any[] = resultKategoriUmum.value?.Kategori.KategoriIndikator;
let Indicators_umum: indicator[] = [];
let Indicators_posisi: indicator[] = [];

try {
  if(!useIncludes(useToLower(resultKategoriUmum.value?.Kategori.nama),  "umum")){
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
    Indicators_umum.push(temp);
  }

  for (const item of dataJumPosisiPetugasKegSurvei[0].kategori.KategoriIndikator) {
    const temp: indicator = {
      urutan: item.no_urut,
      nama: item.indikator.nama,
      kategoriIndikator_id: parseInt(item.kategoriIndikator_id),
      kategori: dataJumPosisiPetugasKegSurvei[0].kategori.nama,
      bobot: item.bobot,
      is_benefit: item.indikator.is_benefit,
    };
    Indicators_posisi.push(temp);
  }
} catch (e) {
  console.log(e);
}
Indicators_umum = useSortBy(Indicators_umum, ["urutan"]);
Indicators_posisi = useSortBy(Indicators_posisi, ["urutan"]);
//4. Semua username yang telibat mjd petugas(harus dinilai) pada PenugasanStruktur
const { data: resultPenugasanStruktur } = await useAsyncQuery(useGetPenugasanStruktur(), { survei_kd, keg_kd, branch_kd, posisi_kd });
const dataPenugasanStruktur: any[] = resultPenugasanStruktur.value?.PenugasanStruktur;
const Evaluatees: evaluatee[] = dataPenugasanStruktur?.map((item) => ({ id: item.User.user_id, username: item.username, nama: item.User.nama }));
//5. Buat data matriks nilai petugas dan kategori penilaian bersesuaian
const p = Evaluatees?.length;
const q1 = Indicators_umum.length;
const q2 = Indicators_posisi.length;
const dataNilai_umum: data_nilai[][] = reactive(Array.from(Array(p), () => new Array(q1)));
const dataNilai_posisi: data_nilai[][] = reactive(Array.from(Array(p), () => new Array(q2)));
matchingData(dataNilai_umum, Indicators_umum);
matchingData(dataNilai_posisi, Indicators_posisi);
function matchingData(data: data_nilai[][], indicators: indicator[]) {
  for (let i = 0; i < p; i++) {
    for (let j = 0; j < indicators.length; j++) {
      let foundObj = useFind(dataSavedNilai, { username: Evaluatees[i].username, kategoriIndikator_id: indicators[j].kategoriIndikator_id });
      let temp: data_nilai = {
        id: "",
        nilai: "",
      };
      if (foundObj) {
        temp.id = foundObj.nilaikategoriindikator_id;
        temp.nilai = foundObj.nilai;
      }
      data[i][j] = temp;
    }
  }
}

function generateRank(
  data: data_nilai[][],
  indicators: indicator[]
): Promise<
  {
    username: string;
    name?: string;
    preference_value?: number;
  }[]
> {
  return new Promise((resolve, reject) => {
    try{
      const score: number[][] = data.map((row) => row.map((col) => parseInt(col.nilai || "0", 10)));
      const weight: number[] = indicators.map((ind) => ind.bobot);
      const is_benefit: boolean[] = indicators.map((ind) => (ind.is_benefit == 1 ? true : false));
      const evaluatees: { name?: string; username: string }[] = Evaluatees.map((e) => ({ name: e.nama, username: e.username }));
      const dataResult = useTopsis(score, weight, is_benefit, evaluatees);
      if (!dataResult) {
        reject("Gagal membuat rank");
      } else {
        resolve(dataResult);
      }
    }catch(e){
      console.log(e);
      reject(false);
    }
  });
}

// data ranking
let rankPosisi: rank[] = [];
let rankUmum: rank[] = [];
// query peringkat pd tabel RankMitraPosKegSurvei dg filter survei_kd, keg_kd, branch_kd, posisi_kd 
const { data: resultSavedRank } = await useAsyncQuery(useGetRankMitraPosKegSurvei(), { survei_kd, keg_kd, branch_kd, posisi_kd });
const dataRankPosisi = resultSavedRank.value?.RankMitraPosKegSurvei;

// Generate peringkat
const dataRankUmum = await generateRank(dataNilai_umum, Indicators_umum);
try {
  Evaluatees.forEach((element, idx) => {
    let matchObj = useFind(dataRankPosisi, { username: element.username });
    rankPosisi.push({
      username: element.username,
      nama: element.nama,
      nilai_indikator: dataNilai_posisi[idx].map((el) => parseInt(el.nilai)),
      nilai_preferensi: matchObj?.nilai,
    });
    let matchObj2 = useFind(dataRankUmum, { username: element.username });
    rankUmum.push({
      username: element.username,
      nama: element.nama,
      nilai_indikator: dataNilai_umum[idx].map((el) => parseInt(el.nilai)),
      nilai_preferensi: matchObj2?.preference_value || 0,
    });
  });
} catch (e) {
  console.log(e);
}
rankPosisi = useOrderBy(rankPosisi, ["nilai_preferensi"], ["desc"]);
rankUmum = useOrderBy(rankUmum, ["nilai_preferensi"], ["desc"]);

const dataUmum: MixedDictionary[] = [];
const dataPosisi: MixedDictionary[] = [];
tableData(dataUmum, rankUmum, Indicators_umum);
tableData(dataPosisi, rankPosisi, Indicators_posisi);
function tableData(data: MixedDictionary[], rank: rank[], indicators: indicator[]) {
  for (let i = 0; i < rank.length; i++) {
    let temp: MixedDictionary = {
      peringkat: i + 1,
      nama: rank[i].nama,
      username: rank[i].username,
      nilai_preferensi: rank[i].nilai_preferensi,
    };
    indicators.forEach((ind, idx) => {
      temp[ind.nama] = rank[i].nilai_indikator[idx];
    });
    data.push(temp);
  }
}
// Make xlsx file
function downloadData() {
  const worksheet = XLSX.utils.json_to_sheet(dataUmum);
  const worksheet2 = XLSX.utils.json_to_sheet(dataPosisi);

  // Create a new workbook
  // const workbook = XLSX.utils.book_new

  // Add the worksheet to the workbook
  // XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Kategori Umum");
  XLSX.utils.book_append_sheet(workbook, worksheet2, "Kategori "+Indicators_posisi[0].kategori);

  // Write the workbook to a file
  const title :string = (dataKegSurvei ? dataKegSurvei?.Survei?.nama + " " + dataKegSurvei?.Kegiatan?.nama : "Survei Kegiatan " ) +  (dataJumPosisiPetugasKegSurvei ? dataJumPosisiPetugasKegSurvei[0].Posisi.nama : "Posisi ");
  XLSX.writeFile(workbook, "Peringkat Evaluasi " + title +".xlsx");
}

//tabel detail:
const column = [
  {
    label: "Nama Petugas",
    field: "nama",
  },
  {
    label: "Peringkat",
    field: "peringkat",
  },
  {
    label: "Nilai preferensi",
    field: "nilai_preferensi",
  },
];
const columnUmum = [...column];
const columnPosisi = [...column];
columnUmum.push(
  ...Indicators_umum.map((ind) => ({
    label: ind.nama,
    field: ind.nama,
  }))
);
columnPosisi.push(
  ...Indicators_posisi.map((ind) => ({
    label: ind.nama,
    field: ind.nama,
  }))
);
</script>

<template>
  <h3 class="font-bold">Laporan Penilaian</h3>
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
    </table>
    <BaseButtonMode shape="square" mode="outlined" class="py-3 px-4" @click.prevent="downloadData()">Unduh Penilaian</BaseButtonMode>
  </section>
  <section>
    <h6 class="font-semibold mb-3">Penilaian berdasarkan posisi : kategori {{ Indicators_posisi[0].kategori }}</h6>
    <!-- <div class="table-container rounded overflow-auto max-h-[480px] 2xl:max-h-[720px]">
      <table class="bg-white min-w-full" id="main-table">
        <thead class="text-slate-800 text-lg border-b border-slate-500 shadow">
          <tr>
            <th class="py-3 px-4">Petugas</th>
            <th class="py-3 px-4">Peringkat</th>
            <th class="py-3 px-4">Nilai preferensi</th>
            <th class="py-3 px-4" v-for="ind in Indicators_posisi" :key="ind.urutan">{{ ind.nama }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in rankPosisi" :key="i" class="hover:bg-slate-100 border-b border-slate-300">
            <td id="first-col" class="pe-6 hover:bg-slate-100">
              <div class="petugas logo py-2 px-4 flex items-center">
                <span class="me-3 inline-flex justify-center items-center h-12 w-12 rounded-full bg-slate-400 text-white">
                  <IconUserPenilaian />
                </span>
                <div class="petugas">
                  <p class="body1">{{ item?.username }}</p>
                </div>
              </div>
            </td>
            <td>
              <div class="flex justify-center">
                <span>{{ i + 1 }}</span>
              </div>
            </td>
            <td>
              <div class="flex justify-center">
                <span>{{ item?.nilai_preferensi }}</span>
              </div>
            </td>
            <td v-for="(ind, j) in Indicators_umum" class="py-2 px-3">
              <div class="flex justify-center">
                <span>{{ item?.nilai_indikator[j] }}</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div> -->
    <vue-good-table
      :columns="columnPosisi"
      :rows="dataPosisi"
      :sort-options="{
        enabled: true,
        initialSortBy: { field: 'peringkat', type: 'asc' },
      }"
      :search-options="{
        enabled: true,
      }"
      :pagination-options="{
        enabled: true,
      }"
    >
      <template #table-row="props">
        <span v-if="props.column.field == 'nama'">
          {{ props.row.nama ?? props.row.username }}
        </span>
        <span v-else>
          {{ props.formattedRow[props.column.field] }}
        </span>
      </template>
    </vue-good-table>
  </section>
  <section>
    <h6 class="font-semibold mb-3">Kategori Umum</h6>
    <vue-good-table
      :columns="columnUmum"
      :rows="dataUmum"
      :sort-options="{
        enabled: true,
        initialSortBy: { field: 'peringkat', type: 'asc' },
      }"
      :search-options="{
        enabled: true,
      }"
      :pagination-options="{
        enabled: true,
      }"
    >
      <template #table-row="props">
        <span v-if="props.column.field == 'nama'">
          {{ props.row.nama ?? props.row.username }}
        </span>
        <span v-else>
          {{ props.formattedRow[props.column.field] }}
        </span>
      </template>
    </vue-good-table>
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

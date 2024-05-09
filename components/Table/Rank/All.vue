<script setup lang="ts">
import { logErrorMessages } from "@vue/apollo-util";

interface Rank {
  // staticKey: string;
  username: string;
  nama?: string;
  nilai?: number;
  [key: string]: number | string | undefined; // Can accommodate the staticKey too, dynamic key for indicators name and it's value
}
type indicator = {
  urutan: number;
  nama: string;
  kategoriIndikator_id: number;
  kategori: string;
  bobot: number;
  is_benefit: number;
};
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
    field: "nilai",
  },
];

/**
 * Ranking semua mitra/petugas hanya melihat( kategori umum untuk bisa saling dibandingkan tanpa melihat posisi/kegiatan ???)
 * Langkah:
 * A. Query kategori umum beserta kategoriIndikator dan indikator2nya
 * B. Query semua user & nilai dari branch yg sama dari rankMitra
 * C. Query juga nilai per indikator dari tabel nilaiKategoriIndikator
 * D. NIlai dg indikatorKategori sama akan dirata2kan
 *
 * Generate/Re-Generate rank
 * 1. Lakukan query diatas. Jika query (B) kosong, generate/ create. Jika ada, re-generate/update
 * 2. Generate/Create:
 *    - Pada langkah A dan C perhatikan branch_kd dan kategoriIndikator_id
 *    - Lakukan juga query bobot pada tabel kategoriIndikator utk menghitung dg topsis
 *    - Sesuaikan struktur data dan lakukan perangkingan dengan useTopsis
 *    - create data pada tabel rankMitra
 * 3. Update:
 *    - Query data dari tabel RankMitra (Langkah A-C telah dijalankan)
 *    - Jalankan ulang perangkingan dg useTopsis
 *    - update data pda tabel rankMitra
 */

// A. Query kategori umum
const { data: resultKategoriUmum } = await useAsyncQuery(useGetKategori(), { id: 1 });
const dataKategoriUmum: any[] = resultKategoriUmum.value?.Kategori.KategoriIndikator;
let Indicators_umum: indicator[] = [];
try {
  if (useToLower(resultKategoriUmum.value?.Kategori.nama) !== "umum") {
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
  Indicators_umum = useSortBy(Indicators_umum, ["urutan"]);
} catch (e) {
  console.log(e);
}
column.push(
  ...Indicators_umum.map((ind) => ({
    label: ind.nama,
    field: ind.nama,
  }))
);
// B. Query tabel rankMitra
//const branch_kd = "0123ABC"
const branch_kd = "000abc";
const { data: resultRankMitra } = await useAsyncQuery(useGetRankMitra(), { branch_kd });
const dataRankMitra: any[] = resultRankMitra.value?.RankMitra;
// C. Query tabel nilaiKategoriIndikator
const { data: resultSavedNilai } = await useAsyncQuery(useGetNilaiKategoriIndikator(), { branch_kd });
const dataSavedNilai: any[] = resultSavedNilai.value?.NilaiKategoriIndikator;
// D nilai pada indikatorKategori dirata2kan jika 1 indikatorKategori_id punya nilai >1
// Proses ini dg cara menemukan object apakah satu user dan satu indikatorKategori_id punya >1 nilai
// struct data
const dataRank: Rank[] = reactive([]);
function structData() {
  try {
    const users = useUniqBy(dataSavedNilai, "username");
    //console.log(users);
    users.forEach((item, idx) => {
      let temp: Rank = {
        username: item.username,
        nama: item.User.nama,
      };
      Indicators_umum.forEach((ind) => {
        // let matchObj = useFind(dataSavedNilai, { username: item.username, kategoriIndikator_id: ind.kategoriIndikator_id });
        // temp[ind.nama] = matchObj ? matchObj.nilai : undefined;
        let matchObj = useFilter(dataSavedNilai, { username: item.username, kategoriIndikator_id: ind.kategoriIndikator_id });
        // if(matchObj.length >= 1){
          temp[ind.nama] = useMeanBy(matchObj, 'nilai');
        // }
      });
      dataRank.push(temp);
    });
  } catch (e) {
    console.log(e);
  }
}
structData();
if (dataRankMitra.length > 0) {
  dataRank.forEach((item) => {
    let matchObj = useFind(dataRankMitra, { username: item.username });
    // use filter
    item.nilai = matchObj.nilai;
  });
}

function generateRank() {
  const score = dataRank.map((row) => Indicators_umum.map((ind) => row[ind.nama]));
  //console.log(score)
  const weight = Indicators_umum.map((el) => el.bobot);
  const is_benefit = Indicators_umum.map((el) => (el.is_benefit == 1 ? true : false));
  const evaluatees = dataRank.map((el) => ({ username: el.username }));

  const dataResult = useTopsis(score, weight, is_benefit, evaluatees);
  dataRank.forEach((item) => {
    let matchObj = useFind(dataResult, { username: item.username });
    item.nilai = matchObj?.preference_value;
  });
}

function createRank() {
  const { mutate: sendCreateRank, onDone: resultCreateRank, onError: errorCreateRank, loading: loadingCreateRank } = useMutation(useCreateRankMitra());
  dataRank.forEach((item) => {
    sendCreateRank({
      input: {
        branch_kd,
        username: item.username,
        kategori_id: resultKategoriUmum.value?.Kategori.kategori_id,
        nilai: item.nilai,
      },
    });
    errorCreateRank((error) => {
      logErrorMessages(error);
      return;
    });
  });
  resultCreateRank(() => reloadNuxtApp);
}

function updateRank(){

}
</script>
<template>
  <section>
    <h6 class="font-semibold mb-3">Peringkat Semua Mitra</h6>
    <BaseButtonMode class="mb-3" mode="normal" shape="square" v-if="dataRankMitra.length < 1" @click="generateRank()">Generate peringkat</BaseButtonMode>
    <vue-good-table
      :columns="column"
      :rows="dataRank"
      :search-options="{
        enabled: true,
      }"
    >
      <template #table-row="props">
        <span v-if="props.column.field == 'nama'">
          {{ props.row.nama || props.row.username }}
        </span>
        <span v-else>
          {{ props.formattedRow[props.column.field] }}
        </span>
      </template>
    </vue-good-table>
  </section>
  {{ dataRank }}
</template>

<script setup lang="ts">
import type { AlertSuccess, AlertError } from "#build/components";
import { logErrorMessages } from "@vue/apollo-util";
import { useGetRankMitraTahunKerja } from "~/composables/useQueries";
import * as XLSX from "xlsx";
const props = defineProps<{
  tahun: string;
}>();
interface Rank {
  // staticKey: string;
  rankmitra_id?: string;
  username: string;
  nama?: string;
  nilai?: number;
  peringkat?: number;
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
    type: "number",
  },
  {
    label: "Nilai preferensi",
    field: "nilai",
    type: "number",
  },
];

/**
 * Ranking semua mitra/petugas hanya melihat kategori umum pada tahun tertentu
 * Langkah:
 * A. Query kategori umum beserta kategoriIndikator dan indikator2nya
 * B. Query semua user & nilai dari branch & TAHUN yg sama dari RankMitraTahunKerja
 * C. Query juga nilai per indikator dari tabel nilaiKategoriIndikator (filter user+tahun)
 * D. NIlai dg indikatorKategori sama akan dirata2kan
 * E. Pemeringkatan:
 * Generate/Re-Generate rank langkah hampir sama dg semua mitra tetapi create/update pada tabel RankMitraTahunKerja
 */

// B. Query tabel RankMitraTahunKerja
const branch_kd = "0123ABC";
const tahun = ref(props.tahun);
const { data: resultRankMitraTahunKerja, refresh: refreshRankMitraTahunKerja, status: statusRankMitraTahunKerja } = await useAsyncQuery(useGetRankMitraTahunKerja(), { branch_kd, tahun });
const dataRankMitraTahunKerja: any[] = [];

// A. Query kategori umum
const { data: resultKategoriUmum } = await useAsyncQuery(useGetKategori(), { id: 1 });
const dataKategoriUmum: any[] = resultKategoriUmum.value?.Kategori.KategoriIndikator;
const kategori_id: number = parseInt(resultKategoriUmum.value?.Kategori.kategori_id);
let Indicators_umum: indicator[] = [];
// C. Query tabel nilaiKategoriIndikator
const dataSavedNilai: any[] = reactive([]);
try {
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
    Indicators_umum.push(temp);
    const { data: resultSavedNilai } = await useAsyncQuery(useGetNilaiKategoriIndikator(), { branch_kd, tahun, kategoriIndikator_id: parseInt(item.kategoriIndikator_id) });
    dataSavedNilai.push(...resultSavedNilai.value?.NilaiKategoriIndikator);
  }
  Indicators_umum = useSortBy(Indicators_umum, ["urutan"]);
} catch (e) {
  console.log(e);
}
// menambahkan kolom indikator pada tabel
column.push(
  ...Indicators_umum.map((ind) => ({
    label: ind.nama,
    field: ind.nama,
    type: "number",
  }))
);

// D. nilai pada indikatorKategori dirata2kan jika 1 indikatorKategori_id punya nilai >1
// Proses ini dg cara menemukan object apakah satu user dan satu indikatorKategori_id punya >1 nilai
// struct data
const dataRank: Rank[] = reactive([]);
// fungsi utk mendapatkan nilai2 kategori umum setiap petugas. Jika ada >1 nilai (byk penilaian) dirata2kan
function structData() {
  // getNilai();
  try {
    const users = useUniqBy(dataSavedNilai, "username");
    // console.log(users);
    users.forEach((item, idx) => {
      let temp: Rank = {
        username: item.username,
        nama: item.User.nama,
      };
      Indicators_umum.forEach((ind) => {
        let matchObj = useFilter(dataSavedNilai, { username: item.username, kategoriIndikator_id: ind.kategoriIndikator_id });
        // useFilter return an array, nilai2nya dirata2
        temp[ind.nama] = useRound(useMeanBy(matchObj, "nilai"),3);
      });
      dataRank.push(temp);
    });
  } catch (e) {
    console.log(e);
  }
}

structData();
// jika sudah ada data pemeringkatan tersimpan, nilai (preferensi diambil)
const isDataRanked = ref(false);
const lastUpdated = ref();
function getSavedRank(restruct?: boolean) {
  if (restruct) dataRankMitraTahunKerja.length = 0;
  dataRankMitraTahunKerja.push(...resultRankMitraTahunKerja.value?.RankMitraTahunKerja);
  try {
    if (dataRankMitraTahunKerja.length > 0) {
      lastUpdated.value = new Date(dataRankMitraTahunKerja[0].updated_at ?? dataRankMitraTahunKerja[0].created_at);
      isDataRanked.value = true;
      dataRank.forEach((item) => {
        // useFind only return first object found
        let matchObj = useFind(dataRankMitraTahunKerja, { username: item.username });
        item.rankmitra_id = matchObj.rankmitratahunkerja_id;
        item.nilai = matchObj.nilai;
      });
      sortNilai();
    }
  } catch (e) {
    console.log(e);
  }
}
getSavedRank();
// E. Proses pemeringkatan
function sortNilai() {
  const temp :Rank[] = useSortBy(dataRank, "nilai");
  dataRank.length = 0;
  const n = temp.length;
  temp.forEach((item, idx) => {
    item.peringkat = n - idx;
  });
  dataRank.push(...temp);
}
function generateRank() {
  try {
    const score = dataRank.map((row) => Indicators_umum.map((ind) => (row[ind.nama] ? row[ind.nama] : 0)));
    const weight = Indicators_umum.map((el) => el.bobot);
    const is_benefit = Indicators_umum.map((el) => (el.is_benefit == 1 ? true : false));
    const evaluatees = dataRank.map((el) => ({ username: el.username }));
    const dataResult = useTopsis(score, weight, is_benefit, evaluatees);
    dataRank.forEach((item) => {
      let matchObj = useFind(dataResult, { username: item.username });
      item.nilai = matchObj?.preference_value;
    });
    sortNilai();
  } catch (e) {
    console.log(e);
  }
}

function createRank() {
  generateRank();
  const { mutate: sendCreateRank, onDone: resultCreateRank, onError: errorCreateRank, loading: loadingCreateRank } = useMutation(useCreateRankMitraTahunKerja());
  const arrResult = [];
  try {
    dataRank.forEach((item) => {
      const temp = sendCreateRank({
        input: {
          branch_kd,
          username: item.username,
          kategori_id,
          nilai: item.nilai,
          tahun: tahun.value,
        },
      });
      errorCreateRank((error) => {
        toggleAlertError();
        logErrorMessages(error);
        throw new Error("Gagal membuat peringkat!");
      });
      arrResult.push(temp);
    });
  } catch (e) {
    console.log(e);
  }
  resultCreateRank(() => {
    toggleAlertSuccess();
    refresh();
  });
}

function updateRank() {
  generateRank();
  console.log("updating rank!");
  const { mutate: sendUpdateRank, onDone: resultUpdateRank, onError: errorUpdateRank, loading: loadingUpdateRank } = useMutation(useUpdateRankMitraTahunKerja());
  const arrResult: any[] = [];
  try {
    dataRank.forEach(async (item) => {
      if (!item.rankmitra_id) throw new Error("Data peringkat belum ada sebelumnya, gagal membuat ulang peringkat!");
      const id: number = parseInt(item.rankmitra_id);
      const temp = sendUpdateRank({
        id,
        input: {
          branch_kd,
          username: item.username,
          kategori_id,
          nilai: item.nilai,
          tahun: tahun.value,
        },
      });
      errorUpdateRank((error) => {
        //alert failed
        toggleAlertError();
        logErrorMessages(error);
        throw new Error("Gagal membuat peringkat!");
      });
      arrResult.push(temp);
    });
  } catch (e) {
    console.log(e);
  }
  // console.log(arrResult);
  resultUpdateRank(() => {
    toggleAlertSuccess();
    refresh();
  });
}
async function refresh() {
  refreshRankMitraTahunKerja();
  await busyWait(() => statusRankMitraTahunKerja.value === "success");
  getSavedRank(true);
}
async function busyWait(test: () => any) {
  // wait time: 0.5s/data
  const delay = dataRank.length >= 50 ? 20 : dataRank.length <= 20 ? 10 : dataRank.length * 0.5;
  while (!test()) await useWaitS(delay);
}
// alert
const alertSuccess = ref<InstanceType<typeof AlertSuccess> | null>(null);
const alertError = ref<InstanceType<typeof AlertError> | null>(null);
const toggleAlertSuccess = (sec?: number) => {
  alertSuccess.value?.call(sec);
};
const toggleAlertError = (sec?: number) => {
  alertError.value?.call(sec);
};
function downloadData() {
  // Create a new workbook
  const workbook = XLSX.utils.book_new();
  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(dataRank);
  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Kategori Umum");

  // Write the workbook to a file
  const now = new Date();
  const title: string = "Peringkat Tahun "+tahun.value+"_" + now.getDay() + now.getMonth() + now.getFullYear() + ".xlsx";
  XLSX.writeFile(workbook, title);
}
</script>
<template>
  <section>
    <AlertSuccess ref="alertSuccess">
      <template #content>
        <p class="font-medium">Data berhasil diperbarui!</p>
      </template>
    </AlertSuccess>
    <AlertError ref="alertError">
      <template #content>
        <p class="font-medium">Data gagal diperbarui!</p>
      </template>
    </AlertError>
    <!-- <BaseButtonMode class="mb-3" mode="normal" shape="square" @click="toggleAlertError()">Show Alert</BaseButtonMode> -->
    <h6 class="font-semibold mb-3">Peringkat Mitra Tahun {{ tahun }}</h6>
    <BaseButtonMode class="mb-3" mode="normal" shape="square" v-if="!isDataRanked" @click="createRank()">Buat peringkat</BaseButtonMode>
    <BaseButtonMode class="mb-3" mode="outlined" shape="square" v-if="isDataRanked" @click="updateRank()">Buat ulang peringkat</BaseButtonMode>
    <BaseButtonMode class="mx-3 mb-3 border" mode="normal" shape="square" @click="downloadData()"><IconDownload class="inline" /> Unduh Data</BaseButtonMode>
    <div v-if="isDataRanked" class="mb-3">Terakhir kali diperbarui: {{ lastUpdated.toLocaleString("id-ID") }}</div>
    <div v-if="!tahun">Pilih satu tahun untuk menampilkan peringkat</div>
    <div v-else>
      <vue-good-table
        :columns="column"
        :rows="dataRank"
        :search-options="{
          enabled: true,
        }"
        :pagination-options="{
          enabled: true,
        }"
        :sort-options="{
          enabled: true,
          initialSortBy: { field: 'peringkat', type: 'asc' },
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
    </div>
  </section>
</template>

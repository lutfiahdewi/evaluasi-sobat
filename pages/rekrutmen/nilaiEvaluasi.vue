<script setup lang="ts">
useSeoMeta({
  title: "Daftar Penilaian Mitra",
});
const columns = [
  {
    label: "ID",
    field: "sobat_id",
  },
  {
    label: "Nama Mitra",
    field: "nama",
  },
  {
    label: "Survei",
    field: "survei",
  },
  {
    label: "Kegiatan",
    field: "kegiatan",
  },
  {
    label: "Posisi",
    field: "posisi",
  },
  {
    label: "Tahun",
    field: "tanggal",
    type: "date",
    dateInputFormat: "yyyy-MM-dd",
    dateOutputFormat: "yyyy",
  },
  {
    label: "Nilai",
    field: "nilai",
  },
];
const rows = [{ a: 1 }];

//data filter
// 1. Survei
const selectedSurvei = ref([]);
const { data: resultSurvei } = await useAsyncQuery(useGetSurvei());
const dataSurvei: { survei_id: number; nama: string; kode: string; tahun: string; tipe: number; unit_kd: string }[] = resultSurvei.value?.Survei;

// 2. Kegiatan
const selectedKegiatan = ref([]);
const { data: resultKegiatan } = await useAsyncQuery(useGetKegiatan());
const dataKegiatan: any[] = resultKegiatan.value?.Kegiatan;
// 3. Posisi
const selectedPosisi = ref([]);
const { data: resultPosisi } = await useAsyncQuery(useGetPosisi());
const dataPosisi: { nama: string; kode: string; posisi_id: number }[] = resultPosisi.value?.Posisi;
// 4. Tahun
const selectedTahun = ref([]);
const dataTahun = useUniqBy(dataSurvei, "tahun");
</script>

<template>
  <h3 class="font-bold mb-3">Daftar Penilaian Mitra</h3>
  <section>
    <!-- 
    <div class="grid grid-cols-6">
      <h6 class="mb-3">Survei:</h6>
      <input type="text" class="col-span-5 mb-3 py-2 px-3 block w-full border-slate-400 rounded-lg body2 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none" placeholder="Filter survei" />
      <h6 class="mb-3">Kegiatan:</h6>
      <input type="text" class="col-span-5 mb-3 py-2 px-3 block w-full border-slate-400 rounded-lg body2 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none" placeholder="Filter kegiatan" />
      <h6 class="mb-3">Posisi:</h6>
      <select class="col-span-2 py-2 px-3 pe-9 block w-full bg-gray-100 border-slate-400 rounded-lg body2 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none">
        <option selected disabled class="text-slate-300">Pilih Posisi</option>
        <option>1</option>
        <option>2</option>
        <option>3</option>
      </select>
      <h6 class="justify-self-center mb-3">Tahun:</h6>
      <select class="col-span-2 py-2 px-3 pe-9 block w-full bg-gray-100 border-slate-400 rounded-lg body2 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none">
        <option selected disabled class="text-slate-300">Pilih Tahun</option>
        <option>2020</option>
        <option>2021</option>
        <option>2022</option>
      </select>
    </div>
  -->
    <div class="filter-section">
      <h6 class="font-semibold mb-3">Filter peringkat:</h6>
      <div class="grid grid-cols-6 mb-3">
        <label for="survei" class="text-xl self-center">Survei:</label>
        <div class="col-span-5 mb-3 block w-full bg-slate-50 border-slate-400 rounded-lg text-slate-600">
          <v-select id="opsi" multiple v-model="selectedSurvei" :options="dataSurvei" label="nama" placeholder="Pilih satu atau lebih survei"></v-select>
        </div>
        <label for="kegiatan" class="text-xl self-center">Kegiatan:</label>
        <div class="col-span-5 mb-3 block w-full bg-slate-50 border-slate-400 rounded-lg text-slate-600">
          <v-select id="opsi" multiple v-model="selectedKegiatan" :options="dataKegiatan" label="nama" placeholder="Pilih satu atau lebih kegiatan"></v-select>
        </div>
        <label class="text-xl self-center" for="posisi">Posisi:</label>
        <div class="col-span-2 block w-full bg-slate-50 border-slate-400 rounded-lg text-slate-600">
          <v-select id="opsi" v-model="selectedPosisi" :options="dataPosisi" label="nama" placeholder="Pilih posisi"></v-select>
        </div>
        <label for="tahun" class="text-xl justify-self-center self-center">Tahun:</label>
        <div class="col-span-2 block w-full bg-slate-50 border-slate-400 rounded-lg text-slate-600">
          <v-select id="opsi" multiple v-model="selectedTahun" :options="dataTahun" label="tahun" placeholder="Pilih satu atau lebih tahun"></v-select>
        </div>
      </div>
    </div>
  </section>
  <section>
    <vue-good-table
      :columns="columns"
      :rows="rows"
      :search-options="{
        enabled: true,
      }"
    >
    </vue-good-table>
  </section>
</template>

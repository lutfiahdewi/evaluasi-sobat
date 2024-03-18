<script setup lang="ts">
useSeoMeta({
  title: "Peringkat Mitra",
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
const rows = [
  { sobat_id: 112728, nama: "mitra 1", nilai: 87, survei: "Sensus Penduduk 2020", kegiatan: "Lapangan", tanggal: "2020-01-12", status: 3, persetujuan: 2 },
  { sobat_id: 138934, nama: "mitra 2", nilai: 88, survei: "Sensus Penduduk 2020", kegiatan: "Lapangan", tanggal: "2020-01-12", status: 2, persetujuan: 2 },
  { sobat_id: 412125, nama: "mitra 3", nilai: 78, survei: "SAKERNAS 2021", kegiatan: "Lapangan", tanggal: "2021-01-12", status: 1, persetujuan: 1 },
  { sobat_id: 598748, nama: "mitra 4", nilai: 89, survei: "Survei 2022", kegiatan: "Lapangan", tanggal: "2022-02-12", status: 1, persetujuan: 0 },
  { sobat_id: 321325, nama: "mitra 5", nilai: 81, survei: "SUSENAS 2022", kegiatan: "Lapangan", tanggal: "2022-08-17", status: 1, persetujuan: 2 },
  { sobat_id: 298749, nama: "mitra 6", nilai: 93, survei: "Sensus Pertanian 2023", kegiatan: "Lapangan", tanggal: "2022-01-12", status: 0, persetujuan: 0 },
];
</script>

<template>
  <h3 class="font-bold mb-3">Peringkat Mitra</h3>
  <section>
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

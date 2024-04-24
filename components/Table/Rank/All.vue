<script setup lang="ts">
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
    <section>
        <h6 class="font-semibold mb-3">Peringkat Semua Mitra</h6>
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
<script setup lang="ts">
definePageMeta({
  layout: "mitra",
});
useSeoMeta({
  title: "Riwayat Daftar",
});
const activeBar = useCookie("activeBar");
activeBar.value = "Riwayat Daftar";

const columns = [
  {
    label: "Nama Survei",
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
    label: "Tanggal Pelaksanaan",
    field: "tanggal",
    type: "date",
    dateInputFormat: "yyyy-MM-dd",
    dateOutputFormat: "dd MMM yyyy",
  },
  {
    label: "Nilai",
    field: "nilai",
  },
  {
    label: "Status Kegiatan",
    field: "status",
  },
];
const rows = [
  { id: 1, survei: "Sensus Penduduk 2020", kegiatan: "Lapangan", tanggal: "2020-01-12", status: 3, persetujuan: 2 },
  { id: 1, survei: "Sensus Penduduk 2020", kegiatan: "Lapangan", tanggal: "2020-01-12", status: 2, persetujuan: 2 },
  { id: 4, survei: "SAKERNAS 2021", kegiatan: "Lapangan", tanggal: "2021-01-12", status: 1, persetujuan: 1 },
  { id: 5, survei: "Survei 2022", kegiatan: "Lapangan", tanggal: "2022-02-12", status: 1, persetujuan: 0 },
  { id: 3, survei: "SUSENAS 2022", kegiatan: "Lapangan", tanggal: "2022-08-17", status: 1, persetujuan: 2 },
  { id: 2, survei: "Sensus Pertanian 2023", kegiatan: "Lapangan", tanggal: "2022-01-12", status: 0, persetujuan: 0 },
];
</script>

<template>
  <h3 class="font-bold mb-3">Riwayat Daftar Kegiatan Survei/Sensus</h3>
  <SectionFilter/>
  <section>
    <vue-good-table
      :columns="columns"
      :rows="rows"
      :search-options="{
        enabled: true,
      }"
    >
      <template #table-row="props">
        <span v-if="props.column.field == 'status'">
          <ButtonKegiatan :status="props.row.status" />
          {{ props.row.status }}
        </span>
        <span v-else>
          {{ props.formattedRow[props.column.field] }}
        </span>
      </template>
    </vue-good-table>
  </section>
</template>

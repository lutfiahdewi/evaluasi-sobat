<script setup lang="ts">
const columns = [
  {
    label: "Kode",
    field: "id",
  },
  {
    label: "Nama Survei",
    field: "survei",
  },
  {
    label: "Tipe",
    field: "tipe",
  },
  {
    label: "Tahapan",
    field: "tahapan",
  },
  {
    label: "Status Kegiatan",
    field: "status",
  },
  {
    label: "Aksi",
    field: "aksi",
  },
];
const rows = [
  { id: 1, survei: "Sensus Penduduk 2020", tahapan: "Lapangan", tipe: "sensus", status: 3, persetujuan: 3 },
  { id: 1, survei: "Sensus Penduduk 2020", tahapan: "Lapangan", tipe: "lainnya", status: 2, persetujuan: 2 },
  { id: 4, survei: "SAKERNAS 2021", tahapan: "Lapangan", tipe: "survei", status: 1, persetujuan: 1 },
  { id: 5, survei: "Survei 2022", tahapan: "Lapangan", tipe: "sensus", status: 1, persetujuan: 0 },
  { id: 3, survei: "SUSENAS 2022", tahapan: "Lapangan", tipe: "surevi", status: 1, persetujuan: 2 },
  { id: 2, survei: "Sensus Pertanian 2023", tahapan: "Lapangan", tipe: "lainnya", status: 0, persetujuan: 0 },
];
</script>

<template>
  <div>
    <vue-good-table :columns="columns" :rows="rows">
      <template #table-row="props">
        <span v-if="props.column.field == 'status'">
          <ButtonKegiatan :status="props.row.status" />
          {{ props.row.status }}
        </span>
        <span v-else-if="props.column.field == 'aksi'"  class="flex justify-evenly">
          <ButtonUpdate :id="props.row.id" baseLink="#"/>
          <ButtonDelete :id="props.row.id"  baseLink="#"/>
        </span>
        <span v-else>
          {{ props.formattedRow[props.column.field] }}
        </span>
      </template>
    </vue-good-table>
  </div>
</template>

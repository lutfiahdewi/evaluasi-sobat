<script setup lang="ts">
const columns = [
  {
    label: "Kategori",
    field: "kategori",
  },
  {
    label: "Indikator",
    field: "indikator",
  },
  {
    label: "Tanggal Modifikasi",
    field: "tanggal",
    type: "date",
    dateInputFormat: "yyyy-MM-dd",
    dateOutputFormat: "dd MMM yyyy",
  },
  {
    label: "Aksi",
    field: "id",
  },
];
const rows = [
  { id: 112728, kategori: "kategori 1", indikator: "indikator1, indikator2, indikator3", tanggal: "2020-01-12" },
  { id: 138934, kategori: "kategori 2", indikator: "indikator1, indikator2, indikator3", tanggal: "2020-01-12" },
  { id: 298749, kategori: "kategori 4", indikator: "indikator1, indikator2, indikator3...", tanggal: "2022-01-12" },
];
</script>
<template>
  <vue-good-table
    :columns="columns"
    :rows="rows"
    :search-options="{
      enabled: true,
    }"
  >
    <template #table-row="props">
      <span v-if="props.column.field == 'id'" class="flex justify-evenly">
        <ButtonUpdate baseLink="/pengaturan/tambahIndikator/" :id="props.row.id" />
        <ButtonDelete baseLink="/pengaturan/tambahIndikator/" :id="props.row.id" />
      </span>
      <span v-else>
        {{ props.formattedRow[props.column.field] }}
      </span>
    </template>
  </vue-good-table>
</template>

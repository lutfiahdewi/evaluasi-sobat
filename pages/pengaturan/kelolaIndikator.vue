<script setup lang="ts">
useSeoMeta({
  title: "Kelola Indikator",
});
import data from "public/data.js";
const dataColumn = [
  { label: "Nama Indikator", field: "nama" },
  { label: "Kategori", field: "kategori" },
];

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
  <h3 class="font-bold mb-3">Kelola Indikator</h3>
  <section>
    <NuxtLink to="/pengaturan/tambahIndikator" class="mb-3">
      <BaseButtonMode shape="square" mode="normal"> <IconAdd class="h-4 w-4 me-1 inline" /> Tambah Indikator </BaseButtonMode>
    </NuxtLink>
    <div class="my-6">
      <!-- <vue-good-table
        :columns="dataColumn"
        :rows="data.indikator"
        :search-options="{
          enabled: true,
          placeholder: 'Cari...',
        }"
      /> -->
      <vue-good-table
        :columns="columns"
        :rows="rows"
        :search-options="{
          enabled: true,
        }"
      >
        <template #table-row="props">
          <span v-if="props.column.field == 'id'" class="flex justify-evenly">
            <ButtonUpdate :id="props.row.id" />
            <ButtonDelete :id="props.row.id" />
          </span>
          <span v-else>
            {{ props.formattedRow[props.column.field] }}
          </span>
        </template>
      </vue-good-table>
    </div>
  </section>
</template>

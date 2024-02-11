<script setup lang="ts">
useSeoMeta({
  title: "Kelola Indikator",
});
import data from "public/data.js";
const dataColumn = [
  { label: "Nama Indikator", field: "nama" },
  { label: "Kategori", field: "kategori" },
];
</script>
<template>
  <section>
    <NuxtLink to="/pengaturan/tambahIndikator" class="mb-3">
      <BaseButtonMode shape="square" mode="normal"> (+) Tambah Indikator </BaseButtonMode>
    </NuxtLink>
    <div>
      <vue-good-table :columns="dataColumn" :rows="data.indikator" />
    </div>
  </section>
</template>

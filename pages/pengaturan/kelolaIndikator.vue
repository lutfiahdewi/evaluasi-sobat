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
    <div class="my-6">
      <vue-good-table
        :columns="dataColumn"
        :rows="data.indikator"
        :search-options="{
          enabled: true,
          placeholder: 'Cari...',
        }"
      />
    </div>
  </section>
</template>

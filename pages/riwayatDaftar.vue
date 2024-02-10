<script setup lang="ts">
definePageMeta({
  layout: "mitra",
});
useSeoMeta({
  title: "Riwayat Daftar",
});
const activeBar = useCookie('activeBar');
activeBar.value = 'Riwayat Daftar';
</script>

<template>
  <section>
    <h3 class="font-bold">Riwayat</h3>
    <BaseTable/>
  </section>
</template>

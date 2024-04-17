<script setup lang="ts">
useHead({
  title: "Kegiatan",
});
</script>

<template>
  <h3 class="font-bold">Daftar Kegiatan untuk Dievaluasi</h3>
  <!-- <SectionFilter /> -->
  <section>
    <BaseTable class="py-3" />
    <TableEvaluasiKegiatan/>
  </section>
</template>

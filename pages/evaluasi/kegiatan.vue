<script setup lang="ts">
useHead({
  title: "Kegiatan",
});
</script>

<template>
  <h3 class="font-bold">Daftar Kegiatan untuk Dievaluasi</h3>
  <SectionFilter />
  <section>
    Form Penilaian:
    <NuxtLink to="/evaluasi/nilaimitra">
      <BaseButtonMode shape="pill" mode="outlined">Nilai Mitra</BaseButtonMode>
    </NuxtLink>
    <BaseTable class="border rounded-lg" />
  </section>
</template>

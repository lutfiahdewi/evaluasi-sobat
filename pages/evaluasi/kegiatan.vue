<template>
  <h3 class="font-bold">Daftar Kegiatan untuk Dievaluasi</h3>
  <section>
    <h4>Filter</h4>
  </section>
  <section>
    Form Penilaian: 
    <NuxtLink to="/evaluasi/nilaimitra">
      <ButtonMode shape="pill" mode="outlined">Nilai Mitra</ButtonMode>
    </NuxtLink>
    <div class="kumpulan-button">
      <p>Buttons</p>
      <NuxtLink to="/">
        
      </NuxtLink>
      <ButtonMode shape="square" mode="outlined">outlined</ButtonMode>
      <ButtonMode shape="square" mode="gray">gray</ButtonMode>
    </div>
    <div class="kumpulan-button">
      <p>Buttons</p>
      <ButtonMode shape="pill" mode="normal">Coba1</ButtonMode>

      <ButtonMode shape="pill" mode="gray">gray</ButtonMode>
    </div>
  </section>
</template>

<script setup lang="ts">
definePageMeta({
  title: "Kegiatan",
});
useHead({
  title: "Kegiatan - Evaluasi SOBAT Mitra",
});
</script>

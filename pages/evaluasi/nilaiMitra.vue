<template>
  <h3 class="font-bold">Daftar Mitra untuk Dievaluasi</h3>
  <section>
    <div class="flex justify-between items-center">
      <h5>Nilai menggunakan excel :</h5>
      <div class="flex">
        <ButtonMode shape="square" mode="normal" :class="'me-5'">Unduh Template Penilaian</ButtonMode>
        <ButtonMode shape="square" mode="outlined">Unggah Penilaian</ButtonMode>
      </div>
    </div>
  </section>
  <section>
    <h5 class="mb-3">Form Penilaian</h5>
    <CardAssesement v-for="user in users" :key="user.id" :name="user.name" :detail="user.detail" />
  </section>
</template>

<script setup lang="ts">
definePageMeta({
  title: "Nilai Mitra",
});
interface user {
  id: number;
  name: string;
  detail: string;
}
const users: user[] = [
  { id: 1, name: "nama1", detail: "detail1" },
  { id: 2, name: "nama2", detail: "detail123" },
  { id: 3, name: "nama3", detail: "detail147" },
];
</script>

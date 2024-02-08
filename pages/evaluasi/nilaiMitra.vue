<script setup lang="ts">
definePageMeta({
  title: "Nilai Mitra",
});
useSeoMeta({
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

<template>
  <h3 class="font-bold">Daftar Mitra untuk Dievaluasi</h3>
  <section>
    <div class="flex justify-between items-center">
      <h5>Nilai menggunakan excel :</h5>
      <div class="flex">
        <BaseButtonMode shape="square" mode="normal" :class="'me-5'">
          <div class="flex items-center">
            Unduh Template Penilaian
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
              />
            </svg>
          </div>
        </BaseButtonMode>
        <BaseButtonMode shape="square" mode="outlined">
          <div class="flex items-center">
            Unggah Penilaian
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="ms-1 w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
            </svg>
          </div>
        </BaseButtonMode>
      </div>
    </div>
    <div class="flex justify-between items-center mt-3">
      <h5>Unggah Penilaian :</h5>
      <div class="flex">
        <form>
          <label class="block">
            <input
              type="file"
              class="block w-full text-sm text-gray-500 file:me-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:disabled:opacity-50 file:disabled:pointer-events-none"
            />
          </label>
        </form>
      </div>
    </div>
  </section>
  <section>
    <h5 class="mb-3">Form Penilaian</h5>
    <CardAssesement v-for="user in users" :key="user.id" :name="user.name" :detail="user.detail" />
    <div class="submission flex justify-end mt-6">
      <BaseButtonMode shape="square" mode="outlined" class="me-5"> Simpan Data </BaseButtonMode>
      <BaseButtonMode shape="square" mode="normal">Finalisasi</BaseButtonMode>
    </div>
  </section>
</template>

<script setup lang="ts">
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
      <h6>Nilai menggunakan excel :</h6>
      <div class="flex">
        <BaseButtonMode shape="square" mode="normal" :class="'me-5'">
          <div class="flex items-center">
            Unduh Template Penilaian
            <IconDownload/>
          </div>
        </BaseButtonMode>
        <!-- <BaseButtonMode shape="square" mode="outlined">
          <div class="flex items-center">
            Unggah Penilaian
            <IconUpload/>
          </div>
        </BaseButtonMode> -->
      </div>
    </div>
    <div class="flex justify-between items-center mt-3">
      <h6>Unggah Penilaian :</h6>
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
    <h6 class="mb-3 font-bold">Form Penilaian</h6>
    <CardAssesement v-for="user in users" :key="user.id" :name="user.name" :detail="user.detail" />
    <div class="submission flex justify-end mt-6">
      <BaseButtonMode shape="square" mode="outlined" class="me-5"> Simpan Data </BaseButtonMode>
      <BaseButtonMode shape="square" mode="normal">Finalisasi</BaseButtonMode>
    </div>
  </section>
</template>

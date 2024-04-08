<script setup lang="ts">
import type { ModalBase } from "#build/components";

useSeoMeta({
  title: "Kelola Indikator",
});

const currentIndicators = useState<number>("indicators", () => 1);
const newCatIndModal = ref<InstanceType<typeof ModalBase> | null>(null);
const newCatModal = ref<InstanceType<typeof ModalBase> | null>(null);
const newIndModal = ref<InstanceType<typeof ModalBase> | null>(null);
</script>
<template>
  <!-- Daftar Kategori -->
  <h3 class="font-bold mb-3">Kategori Indikator</h3>
  <section class="mb-3">
    <!-- Modal membuat kategori dan indikator baru -->
    <ModalBase ref="newCatIndModal">
      <template #header>
        <h5 class="font-bold text-gray-800">Buat kategori indikator baru</h5>
      </template>
      <template #body>
        <label for="weight-label" class="block mb-2">Jumlah indikator</label>
        <select v-model="currentIndicators" id="weight-label" class="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none" autofocus>
          <option>1</option>
          <option>2</option>
          <option>3</option>
          <option>4</option>
          <option>5</option>
          <option>6</option>
          <option>7</option>
          <option>8</option>
          <option>9</option>
        </select>
      </template>
      <template #footer>
        <div class="flex justify-end">
          <NuxtLink to="/pengaturan/tambahIndikator/" class="">
            <BaseButtonMode shape="square" mode="normal" @click="newCatIndModal?.close()"> Buat kategori </BaseButtonMode>
          </NuxtLink>
        </div>
      </template>
    </ModalBase>
    <BaseButtonMode shape="square" mode="normal" class="me-3" @click="newCatIndModal?.open()"> <IconAdd class="h-4 w-4 me-1 inline" /> Tambah Kategori dan Indikator </BaseButtonMode>
    <!-- Modal membuat kategori baru -->
    <BaseButtonMode shape="square" mode="outlined"> <IconAdd class="h-4 w-4 me-1 inline" /> Tambah Kategori dari indikator tersedia </BaseButtonMode>
    <div class="my-6">
      <TableKategoriIndikator />
    </div>
  </section>

  <!-- Daftar Indikator -->
  <h3 class="font-bold mb-3">Satuan Indikator</h3>
  <section>
    <!-- Modal section: tambah indikator -->
    <ModalBase ref="newIndModal">
      <template #header>
        <h5 class="font-bold">Buat Indikator</h5>
      </template>
      <template #body>
        <form>
          <label for="nama" class="block font-medium mb-2">Nama Indikator</label>
          <input type="text" id="nama" class="py-3 px-4 mb-3 block w-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none" placeholder="Nama indikator" />
          <label for="definsi" class="block font-medium mb-2">Definisi Indikator</label>
        </form>
      </template>
      <template #footer>
        <div class="flex justify-end items-center gap-x-2">
          <BaseButtonMode shape="square" mode="normal" @click="newIndModal?.close()"> Buat indikator </BaseButtonMode>
        </div>
      </template>
    </ModalBase>
    <BaseButtonMode shape="square" mode="normal" class="me-3" @click="newIndModal?.open()"> <IconAdd class="h-4 w-4 me-1 inline" /> Tambah Indikator </BaseButtonMode>
    <div class="my-6">
      <TableIndikator />
    </div>
  </section>

  
</template>

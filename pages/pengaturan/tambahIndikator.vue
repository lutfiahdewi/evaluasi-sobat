<script setup lang="ts">
useSeoMeta({
  title: "Tambah Indikator",
});
</script>
<template>
  <section>
    <form>
      <div class="grid grid-cols-2 gap-8">
        <div class="col-span-2">
          <label for="name-label" class="block font-medium mb-2">Nama Indikator</label>
          <input type="text" id="name-label" class="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none" placeholder="..." />
        </div>
        <div>
          <label for="category-label" class="block font-medium mb-2">Kategori</label>
          <input type="text" id="category-label" class="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none" placeholder="..." />
        </div>
        <div>
          <label for="weight-label" class="block font-medium mb-2">Bobot</label>
          <input type="text" id="weight-label" class="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none" placeholder="..." />
        </div>
        <div class="col-span-2">
          <label for="textarea-label" class="block font-medium mb-2">Konsep dan Definisi</label>
          <textarea
            id="textarea-label"
            class="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
            rows="4"
            placeholder="Say hi..."
          ></textarea>
        </div>
        <div class="col-end-3 flex justify-end">
            <BaseButtonMode shape="square" mode="normal" >Buat Indikator</BaseButtonMode>
        </div>
      </div>
    </form>
  </section>
</template>

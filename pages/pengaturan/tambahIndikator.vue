<script setup lang="ts">
useSeoMeta({
  title: "Tambah Indikator",
});

const sumIndicators: Ref<number> = ref(4);
</script>

<template>
  <h3 class="font-bold mb-3">Buat Indikator Penilaian</h3>
  <form>
    <section>
      <div class="grid grid-cols-2 gap-8">
        <div>
          <label for="category-label" class="block font-medium mb-2">Nama Kategori</label>
          <input
            type="text"
            id="category-label"
            class="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
            placeholder="Isikan nama kategori indikator"
          />
        </div>
        <div>
          <label for="weight-label" class="block font-medium mb-2">Jumlah Indikator</label>
          <!-- <input type="text" id="weight-label" class="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none" 
          :value="sumIndicators" @input="(e) => (sumIndicators = e.target.value)"/> -->
          <select v-model="sumIndicators" id="weight-label" class="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none">
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
        </div>
        <div class="col-span-2">
          <label for="textarea-label" class="block font-medium mb-2">Konsep dan Definisi</label>
          <textarea
            id="textarea-label"
            class="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
            rows="4"
            placeholder="Penjelasan mengenai kategori indikator"
          ></textarea>
        </div>
      </div>
    </section>
    <section v-for="i in sumIndicators" :key="i">
      <label :for="'name-label' + i" class="block font-medium mb-2">Nama Indikator {{ i }}</label>
      <input
        type="text"
        :id="'name-label' + i"
        class="mb-3 py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
        :placeholder="'Nama indikator ' + i"
      />
      <label :for="'textarea-label' + i" class="block font-medium mb-2">Konsep dan Definisi</label>
      <textarea
        :id="'textarea-label' + i"
        class="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
        rows="3"
        :placeholder="'Penjelasan mengenai indikator ' + i"
      ></textarea>
    </section>
    <section>
      <h5 class="mb-3">Matriks Perbandingan</h5>
      <div v-for="i in sumIndicators" :key="i">
        <div v-if="i === 1" class="grid grid-flow-col auto-cols-max gap-4 mb-4">
          <div class="min-w-24"></div>
          <div v-for="j in sumIndicators" :key="j" class="min-w-24">Indikator {{ j }}</div>
        </div>
        <div class="grid grid-flow-col auto-cols-max gap-4 mb-4">
          <div class="min-w-24">Indikator {{ i }}</div>
          <input v-for="j in sumIndicators" :key="j" :disabled="j <= i" type="number" class="w-24 border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none" />
        </div>
      </div>
    </section>
    <div class="flex justify-end">
      <NuxtLink to="/pengaturan/kelolaIndikator">
        <BaseButtonMode shape="square" mode="outlined" class="me-3 font-semibold">Batal</BaseButtonMode>
      </NuxtLink>
      <BaseButtonMode shape="square" mode="normal">Buat Indikator</BaseButtonMode>
    </div>
  </form>
</template>

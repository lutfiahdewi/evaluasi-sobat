<script setup lang="ts"></script>

<template>
  <section>
    <div class="grid grid-cols-6 my-3">
      <h6 class="mb-3">Survei:</h6>
      <input type="text" class="col-span-5 mb-3 py-2 px-3 block w-full border-slate-400 rounded-lg body2 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none" placeholder="Cari" />
      <h6 class="mb-3">Kegiatan:</h6>
      <select class="col-span-2 py-2 px-3 pe-9 block w-full bg-gray-100 border-slate-400 rounded-lg body2 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none">
        <option selected disabled class="text-slate-300">Pilih Kegiatan</option>
        <option>1</option>
        <option>2</option>
        <option>3</option>
      </select>
      <h6 class="justify-self-center mb-3">Status:</h6>
      <select class="col-span-2 py-2 px-3 pe-9 block w-full bg-gray-100 border-slate-400 rounded-lg body2 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none">
        <option selected disabled class="text-slate-300">Pilih Kegiatan</option>
        <option>1</option>
        <option>2</option>
        <option>3</option>
      </select>
    </div>
  </section>
</template>


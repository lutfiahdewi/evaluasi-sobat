<script setup lang="ts">
const indicators = [
  { id: 123, name: "indikator 1" },
  { id: 121, name: "indikator 2" },
  { id: 122, name: "indikator 3" },
  { id: 124, name: "indikator 4" },
];
defineProps<{
  name: string,
  detail: string,
}>()
</script>

<template>
  <div class="grid grid-cols-3 gap-y-3 gap-x-1 bg-white hover:bg-slate-50 p-4 rounded-lg mb-3">
    <div class="user logo flex items-center">
      <span class="me-3 inline-flex justify-center items-center h-16 w-16 rounded-full bg-slate-400 text-white">
        <IconUserPenilaian/>
      </span>
      <div class="user">
        <p class="body1">{{ name }}</p>
        <p class="body2 text-slate-500">{{detail}}</p>
      </div>
    </div>
    <div class="indicators col-span-2" :style="{ overflow: 'auto', 'white-space': 'nowrap' }">
      <input
        type="text"
        class="py-3 px-4 me-5 w-max-12 border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
        v-for="ind in indicators"
        :placeholder="ind.name"
        :key="ind.id"
      />
    </div>
  </div>
</template>


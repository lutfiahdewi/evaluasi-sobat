<template>
  <div class="grid grid-cols-3 gap-3 bg-white hover:bg-slate-50 p-4 rounded-lg mb-3">
    <div class="user logo flex items-center">
      <span class="me-3 inline-flex justify-center items-center h-16 w-16 rounded-full bg-slate-400 text-white">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-15 h-15">
          <path
            fill-rule="evenodd"
            d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
            clip-rule="evenodd"
          />
        </svg>
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

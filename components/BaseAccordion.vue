<script setup lang="ts">
const activeMenu = ref(false);
interface menuItem {
  title: string;
  url: string;
}
defineProps<{
  mainMenu: string;
  childMenu: menuItem[];
}>();
</script>

<template>
  <div class="">
    <div class=" hs-accordion" :class="activeMenu ? ' active' : ''" id="hs-basic-with-title-and-arrow-stretched-heading-one">
      <button
        class="p-3 hs-accordion-toggle hs-accordion-active:text-blue-600 inline-flex items-center justify-between gap-x-3 w-full text-base text-start text-gray-800 hover:text-gray-500 rounded-lg disabled:opacity-50 disabled:pointer-events-none"
        aria-controls="hs-basic-with-title-and-arrow-stretched-collapse-one"
      >
        {{ $props.mainMenu }}
        <svg class="hs-accordion-active:hidden block size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m6 9 6 6 6-6" />
        </svg>
        <svg class="hs-accordion-active:block hidden size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m18 15-6-6-6 6" />
        </svg>
      </button>
      <div
        id="hs-basic-with-title-and-arrow-stretched-collapse-one"
        :class="activeMenu ? '' : 'hidden'"
        class="hs-accordion-content rounded bg-slate-300 w-full overflow-hidden transition-[height] duration-300"
        aria-labelledby="hs-basic-with-title-and-arrow-stretched-heading-one"
      >
        <NuxtLink v-for="child in $props.childMenu" :to="child.url" class="block px-3 py-2">
          {{ child.title }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

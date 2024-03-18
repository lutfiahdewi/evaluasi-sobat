<script setup lang="ts">
defineProps<{
  id: number;
}>();
</script>

<template>
  <NuxtLink :to="'/pengaturan/tambahIndikator/' + id">
    <IconDelete class="w-8 h-8 p-[1px] rounded-md bg-red-600 text-white hover:bg-red-700" />
  </NuxtLink>
</template>

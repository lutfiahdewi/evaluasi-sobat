<script setup lang="ts">
defineProps<{
  id: number;
}>();
</script>

<template>
  <NuxtLink :to="'/pengaturan/tambahIndikator/' + id">
    <IconEdit class="w-8 h-8 p-1 rounded-md bg-slate-600 text-white hover:bg-slate-700" />
  </NuxtLink>
</template>

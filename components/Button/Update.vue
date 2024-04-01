<script setup lang="ts">
defineProps<{
  id: number,
  baseLink: string,
}>();
</script>

<template>
  <NuxtLink :to="baseLink + id">
    <IconEdit class="w-8 h-8 p-1 rounded-md bg-slate-600 text-white hover:bg-slate-700" />
  </NuxtLink>
</template>

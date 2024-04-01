<script setup lang="ts">
defineProps<{
  id: number,
  baseLink: string
}>();
</script>

<template>
  <NuxtLink :to="baseLink + id">
    <IconDelete class="w-8 h-8 p-[1px] rounded-md bg-red-600 text-white hover:bg-red-700" />
  </NuxtLink>
</template>

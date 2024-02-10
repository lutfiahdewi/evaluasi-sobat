<script setup lang="ts">
definePageMeta({
  layout: "admin",
});
const activeBar = useCookie('activeBar');
activeBar.value = 'Rekrutmen'
</script>

<template>
  <NuxtPage />
</template>

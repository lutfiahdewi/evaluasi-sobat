<script setup lang="ts">
defineProps<{
  query: string;
  notActive?: boolean;
}>();
</script>

<template>
  <NuxtLink v-if="!notActive" :to="'/evaluasi/kondef/' + query">
    <BaseButtonMode shape="square" mode="outlined"> Lihat </BaseButtonMode>
  </NuxtLink>
  <BaseButtonMode v-else shape="square" mode="outlined" :notActive="notActive"> Lihat </BaseButtonMode>
</template>

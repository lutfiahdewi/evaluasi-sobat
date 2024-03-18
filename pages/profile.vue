<script setup lang="ts">
definePageMeta({
  layout: "mitra",
});
useSeoMeta({
  title: "Profil",
});
const activeBar = useCookie("activeBar");
activeBar.value = "Profil";


</script>

<template>
  <h3 class="font-bold mb-3">Profil</h3>

</template>

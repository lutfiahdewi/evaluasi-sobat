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
  <table>
    <tr>
      <td>Nama</td>
      <td></td>
    </tr>
    <tr>
      <td>Email</td>
      <td></td>
    </tr>
    <tr>
      <td>Username</td>
      <td></td>
    </tr>
    <tr>
      <td>Status</td>
      <td></td>
    </tr>
    <tr>
      <td>Status Kinerja</td>
      <td></td>
    </tr>
    
  </table>
</template>

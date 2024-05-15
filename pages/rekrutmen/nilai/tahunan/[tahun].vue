<script setup lang="ts">
useSeoMeta({
  title: "Peringkat Tahunan",
});
// getting params from route
const route = useRoute();
const tahun = route.params.tahun;

</script>

<template>
    <TableRankAnnual :tahun="tahun"/>
</template>
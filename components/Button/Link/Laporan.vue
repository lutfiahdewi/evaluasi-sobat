<script setup lang="ts">
defineProps<{
//   query?: string;
survei_kd: string;
keg_kd: string;
branch_kd: string;
posisi_kd: string;
tahun: string;
    
}>();
</script>

<template>
  <NuxtLink :to="'/rekrutmen/nilai/laporan/' + 'kegiatan?survei_kd=' + survei_kd + '&keg_kd=' + keg_kd + '&branch_kd=' + branch_kd + '&posisi_kd=' + posisi_kd + '&tahun=' + tahun">
    <BaseButtonMode shape="square" mode="outlined" class="py-3 px-4 ms-3">Lihat Laporan Evaluasi</BaseButtonMode>
  </NuxtLink>
</template>

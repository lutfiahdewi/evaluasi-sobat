/**
 * KOmponen terkait status kegiatan
 * @param {number} status
 * keterangan nomor= 0:blm jalan; 1: berjalan; 2: selesai =selesai
 */
<script setup lang="ts">
defineProps<{
  status: number;
}>();
type Mode = "normal" | "outlined" | "gray";
var mode: Mode = "outlined";
var statusKegiatan = "Belum berjalan";
function getMode(status: number) {
  switch (status) {
    case 1:
      mode = "normal";
      statusKegiatan = "Berjalan";
      break;
    case 2:
      mode = "gray";
      statusKegiatan = "Selesai";
      break;
    // case 3:
    //   mode = "gray";
    //   statusKegiatan = "Selesai";
    //   break;
    default:
      break;
  }
  return mode;
}
</script>

<template>
  <!-- <NuxtLink v-if="status === 2" to="/evaluasi/nilaimitra"> -->
    <!-- <BaseButtonMode  v-if="status === 2" shape="pill" :mode="getMode(status)">
      {{ statusKegiatan }}
    </BaseButtonMode> -->
  <!-- </NuxtLink> -->
  <BaseButtonMode shape="pill" :mode="getMode(status)" >
    {{ statusKegiatan }}
  </BaseButtonMode>
</template>

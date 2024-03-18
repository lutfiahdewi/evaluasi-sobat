<script setup lang="ts">
defineProps<{
  status: number;
}>();
type Mode = "normal" | "outlined" | "gray";
var mode : Mode = "outlined";
var statusKegiatan = "Belum berjalan";
function getMode(status: number) {
  switch (status) {
    case 1:
      mode = "normal";
      statusKegiatan = "Berjalan";
      break;
    case 2:
      mode = "normal";
      statusKegiatan = "Evaluasi";
      break;
    case 3:
      mode = "gray";
      statusKegiatan = "Selesai";
      break;
    default:
      break;
  }
  return mode;
}
</script>

<template>
  <NuxtLink v-if="status === 2" to="/evaluasi/nilaimitra">
    <BaseButtonMode shape="pill" :mode="getMode(status)" :notActive="status !== 2">
      {{ statusKegiatan }}
    </BaseButtonMode>
  </NuxtLink>
  <BaseButtonMode v-else shape="pill" :mode="getMode(status)" :notActive="status !== 2">
    {{ statusKegiatan }}
  </BaseButtonMode>
</template>

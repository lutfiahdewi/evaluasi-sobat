<script setup lang="ts">
defineProps<{
  status?: number;
}>();
type Mode = "normal" | "outlined" | "gray";
var mode: Mode = "outlined";
var statusPenilaian = "Belum berjalan";
function getMode(status?: number) {
  switch (status) {
    case 1:
      mode = "normal";
      statusPenilaian = "Proses penilaian";
      break;
    case 2:
      mode = "normal";
      statusPenilaian = "Perlu konfirmasi";
      break;
    case 3:
      mode = "gray";
      statusPenilaian = "Selesai";
      break;
    default:
      break;
  }
  return mode;
}

</script>

<template>
  <NuxtLink v-if="status !== 0 && !isNil(status)" to="/evaluasi/nilaimitra">
    <BaseButtonMode shape="pill" :mode="getMode(status)">
      {{ statusPenilaian }}
    </BaseButtonMode>
  </NuxtLink>
  <BaseButtonMode v-else shape="pill" :mode="getMode(status)" :not-active="true" @click.prevent="">
    {{ statusPenilaian }}
  </BaseButtonMode>
</template>

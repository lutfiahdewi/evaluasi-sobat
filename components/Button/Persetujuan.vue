<script setup lang="ts">
defineProps<{
  status: number;
}>();
type Mode = "normal" | "outlined" | "gray";
var mode : Mode = "outlined";
var statusPersetujuan = "Belum dikirim";
function getMode(status: number) {
  switch (status) {
    case 1:
      mode = "normal";
      statusPersetujuan = "Proses";
      break;
    case 2:
      mode = "normal";
      statusPersetujuan = "Tidak disetujui";
      break;
    case 3:
      mode = "gray";
      statusPersetujuan = "Telah disetujui";
      break;
    default:
      break;
  }
  return mode;
}
</script>

<template>
  <NuxtLink v-if="status === 1 || status===2" to="/evaluasi/nilaimitra">
    <BaseButtonMode shape="pill" :mode="getMode(status)">
      {{ statusPersetujuan }}
    </BaseButtonMode>
  </NuxtLink>
  <BaseButtonMode v-else shape="pill" :mode="getMode(status)" :notActive="true">
    {{ statusPersetujuan }}
  </BaseButtonMode>
</template>

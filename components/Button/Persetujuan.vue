<script setup lang="ts">
defineProps<{
  konfirmasi: number; // 0:tidak perlu konfirmasi, 1:perlu
  kegiatan: number; // 0:blm jalan; 1: berjalan; 2: selesai=>evaluasi
  status: number; // 0: blm disetujui operator
  query: string;
}>();
type Mode = "normal" | "outlined" | "gray";
var mode: Mode = "outlined";
var statusPersetujuan = "Perlu diisi!";
function getMode(status: number, kegiatan: number, konfirmasi: number) {
  if (kegiatan === 2) {
    if (konfirmasi == 1 && status == 0) {
      mode = "normal";
      statusPersetujuan = "Perlu persetujuan";
    } else if (konfirmasi == 1 && status == 1) {
      mode = "gray";
      statusPersetujuan = "Selesai";
    } else {
      mode = "outlined";
      statusPersetujuan = "Lihat progres";
    }
  }
  return mode;
}
</script>

<template>
  <NuxtLink v-if="status !== 3" :to="'/evaluasi/nilaimitra/' + query">
    <BaseButtonMode shape="pill" :mode="getMode(status, kegiatan, konfirmasi)">
      {{ statusPersetujuan }}
    </BaseButtonMode>
  </NuxtLink>
  <BaseButtonMode v-else shape="pill" :mode="getMode(status, kegiatan, konfirmasi)" :notActive="true">
    {{ statusPersetujuan }}
  </BaseButtonMode>
</template>

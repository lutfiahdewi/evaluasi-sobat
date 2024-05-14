<script setup lang="ts">
import { boolean } from 'mathjs';

defineProps<{
  konfirmasi: boolean; // 0:tidak perlu konfirmasi, 1:perlu
  kegiatan: number; // 0:blm jalan; 1: berjalan; 2: selesai=>evaluasi
  status: boolean; // 0: blm disetujui operator
  query: string;
  notActive?: boolean;
}>();
type Mode = "normal" | "outlined" | "gray";
var mode: Mode = "normal";
var statusPersetujuan = "Perlu diisi!";
function getMode(status: boolean, kegiatan: number, konfirmasi: boolean) {
  if (kegiatan === 2) {
    if (konfirmasi && !status) {
      mode = "outlined";
      statusPersetujuan = "Perlu persetujuan";
    } else if (konfirmasi && status) {
      mode = "gray";
      statusPersetujuan = "Selesai";
    } else {
      mode = "normal";
      statusPersetujuan = "Lihat progres";
    }
  }
  return mode;
}
</script>

<template>
  <NuxtLink v-if="(konfirmasi ? !status : true) && !notActive" :to="'/evaluasi/nilaiMitra/' + query">
    <BaseButtonMode shape="pill" :mode="getMode(status, kegiatan, konfirmasi)">
      {{ statusPersetujuan }}
    </BaseButtonMode>
  </NuxtLink>
  <BaseButtonMode v-else shape="pill" :mode="getMode(status, kegiatan, konfirmasi)" :notActive="true">
    {{ statusPersetujuan }}
  </BaseButtonMode>
</template>

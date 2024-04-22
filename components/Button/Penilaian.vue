<script setup lang="ts">
defineProps<{
  konfirmasi: number;// 0:tidak perlu konfirmasi, 1:perlu
  kegiatan: number; // 0:blm jalan; 1: berjalan; 2: selesai=>evaluasi
  status?: number; // 0: blm disetujui operator
  query: string
}>();
type Mode = "normal" | "outlined" | "gray";
var mode: Mode = "outlined";
var statusPenilaian = "Belum dimulai";
function getMode(status?: number, kegiatan: number, konfirmasi:number) {
  if(kegiatan===2){
    if(konfirmasi==1 && status == 0){
      mode = "normal";
      statusPenilaian = "Perlu persetujuan";
    }else if(konfirmasi == 1 && status == 1){
      mode = "gray";
      statusPenilaian = "Selesai";
    }else{
      mode = "outlined";
      statusPenilaian = "Lihat progres";
    }
  }
  return mode;
}

</script>

<template>
  <NuxtLink v-if="kegiatan === 2" :to="'/rekrutmen/nilai/'+query">
    <BaseButtonMode shape="pill" :mode="getMode(status,kegiatan, konfirmasi)">
      {{ statusPenilaian }}
    </BaseButtonMode>
  </NuxtLink>
  <BaseButtonMode v-else shape="pill" :mode="getMode(status, kegiatan, konfirmasi)" :not-active="true" @click.prevent="">
    {{ statusPenilaian }}
  </BaseButtonMode>
</template>

/**
 * Komponen untuk menampilkan status penilaian pada tabel daftar kegiatan yang dinilai untuk operator
 * @param {boolean} konfirmasi: perlu tidaknya konfirmasi dari operator
 * @param {number} kegiatan: status tahapan kegiatan
 * @param {boolean} status: status persetujuan operator (jika punya hak)
 * @param {string} query: parameter url untuk mengakses halaman daftar penilaian
 */
<script setup lang="ts">
defineProps<{
  konfirmasi: boolean; // 0:tidak perlu konfirmasi, 1:perlu
  kegiatan: number; // 0:blm jalan; 1: berjalan; 2: selesai=>evaluasi
  status: boolean; // 0: blm disetujui operator
  query: string
}>();
type Mode = "normal" | "outlined" | "gray";
var mode: Mode = "outlined";
var statusPenilaian = "Belum dimulai";
function getMode(status?: boolean, kegiatan: number, konfirmasi:boolean) {
  if(kegiatan===2){
    if(konfirmasi && !status){
      mode = "normal";
      statusPenilaian = "Perlu persetujuan";
    }else if(status){
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

/**
 * Komponen untuk menampilkan status persetujuan pada tabel daftar kegiatan yang dinilai untuk petugas (penilai)
 * @param {boolean} konfirmasi: perlu tidaknya konfirmasi dari operator
 * @param {number} kegiatan: status tahapan kegiatan
 * @param {boolean} status: status persetujuan operator (jika punya hak)
 * @param {string} query: parameter url untuk mengakses halaman daftar penilaian
 * @param {boolean} notActive: jika petugas tidak memiliki petugas untuk dinilai (bukan pengawas) = TRUE. Tidak bisa akses halaman penilaian.
 * 
 */
<script setup lang="ts">

defineProps<{
  konfirmasi: boolean; // 0:tidak perlu konfirmasi, 1:perlu
  kegiatan: number; // 0:blm jalan; 1: berjalan; 2: selesai=>evaluasi
  status: boolean; // 0: blm disetujui operator (konfirmasi ? blm diapprove$dibuat rank : blm dibuat rank)
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
    } else if (status) {
      mode = "gray";
      statusPersetujuan = "Selesai";
    } else {
      mode = "normal";
      statusPersetujuan = "Lihat progres";
    }
  }
  return mode;
}
// v-if="(konfirmasi ? !status : true) && ..."
</script>

<template>
  <NuxtLink v-if="!notActive" :to="'/evaluasi/nilaiMitra/' + query">
    <BaseButtonMode shape="pill" :mode="getMode(status, kegiatan, konfirmasi)">
      {{ statusPersetujuan }}
    </BaseButtonMode>
  </NuxtLink>
  <BaseButtonMode v-else shape="pill" :mode="getMode(status, kegiatan, konfirmasi)" :notActive="true">
    {{ statusPersetujuan }}
  </BaseButtonMode>
</template>

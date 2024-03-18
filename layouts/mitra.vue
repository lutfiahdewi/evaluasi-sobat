<script setup lang="ts">
defineProps<{
  activeBar?: string;
}>();
definePageMeta({
  // middleware: 'auth'
})
const menuMitra = [
  { title: "Beranda", url: "/" },
  { title: "Daftar Survei", url: "" },
  {
    title: "Evaluasi",
    url: "/evaluasi/carapenilaian",
    child: [
      { title: "Cara Penilaian", url: "/evaluasi/carapenilaian" },
      { title: "Kegiatan", url: "/evaluasi/kegiatan" },
      // { title: "Nilai Mitra", url: "/evaluasi/nilaimitra" },
      // { title: "Laporan", url: "/evaluasi/carapenilaian" },
    ],
  },
  { title: "Riwayat Daftar", url: "/riwayatdaftar" },
  { title: "Kartu Petugas", url: "" },
];
</script>

<template>
<div class="min-h-screen flex flex-col">
    <AppHeader role="mitra" :authorized="true" active-bar="Beranda" :menus="menuMitra"/>
    <div class="grow pb-6 mx-3 md:mx-12 lg:mx-24">
      <slot />
    </div>
    <AppFooter />
</div>
</template>

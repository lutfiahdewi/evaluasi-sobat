<script setup lang="ts">
defineProps<{
  activeBar?: string;
}>();
const menuMitra = [
  { title: "Beranda", url: "/beranda" },
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

const authorizedRole = useCookie("authorizedRole");
if (authorizedRole.value !== "mitra"){
    navigateTo({ path: "/beranda" });
}
</script>

<template>
<div class="min-h-screen flex flex-col">
    <AppHeader role="mitra" :authorized="true" :menus="menuMitra"/>
    <div class="grow pb-6 mx-3 md:mx-12 lg:mx-24">
      <slot />
    </div>
    <AppFooter />
</div>
</template>

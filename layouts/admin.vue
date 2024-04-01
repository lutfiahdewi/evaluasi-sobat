<script setup lang="ts">
const menuAdmin = [
  { title: "Beranda", url: "/beranda" },
  {
    title: "Kegiatan",
    url: "",
    child: [
      { title: "Kelola Survei", url: "/kegiatan/kelolaSurvei" },
      { title: "Kelola Rekrutmen", url: "" },
      { title: "Kelola Kartu Petugas", url: "" },
    ],
  },
  {
    title: "Rekrutmen",
    url: "",
    child: [
      { title: "Seleksi Petugas", url: "" },
      { title: "Petugas Organik", url: "" },
      { title: "Kelola Akun Petugas", url: "#" },
      { title: "Daftar Peringkat", url: "/rekrutmen/peringkat" },
    ],
  },
  { title: "Penugasan", url: "" },
  { title: "Master", url: "" },
  {
    title: "Pengaturan",
    url: "",
    child: [
      { title: "Kelola Pengguna", url: "" },
      { title: "Kelola Organisasi", url: "" },
      { title: "Kelola Indikator", url: "/Pengaturan/KelolaIndikator" },
    ],
  },
];

const authorizedRole = useCookie("authorizedRole");
if (authorizedRole.value !== "admin"){
    navigateTo({ path: "/beranda" });
}
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader role="admin" :authorized="true" active-bar="Beranda" :menus="menuAdmin" />
    <div class="grow pb-6 mx-3 sm:mx-12 lg:mx-24">
      <slot />
    </div>
    <AppFooter />
  </div>
</template>

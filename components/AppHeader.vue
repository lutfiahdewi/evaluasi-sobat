<script setup lang="ts">
type Role = "default" | "admin" | "mitra";
interface menuItem {
  title: string;
  url: string;
}
interface menuDetail extends menuItem {
  child?: menuItem[];
}
const menusMitra: menuDetail[] = [
  { title: "Beranda", url: "/" },
  { title: "Daftar Survei", url: "" },
  {
    title: "Evaluasi",
    url: "/evaluasi/carapenilaian",
    child: [
      { title: "Cara Penilaian", url: "/evaluasi/carapenilaian" },
      { title: "Kegiatan", url: "/evaluasi/kegiatan" },
      { title: "Nilai Mitra", url: "/evaluasi/nilaimitra" },
      { title: "Laporan", url: "/evaluasi/carapenilaian" },
    ],
  },
  { title: "Riwayat Daftar", url: "/riwayatdaftar" },
  { title: "Kartu Petugas", url: "" },
];
const menusAdmin: menuDetail[] = [
  { title: "Beranda", url: "/" },
  { title: "Kegiatan", url: "" },
  {
    title: "Rekrutmen",
    url: "",
    child: [
      { title: "Seleksi Petugas", url: "/" },
      { title: "Petugas Organik", url: "/" },
      { title: "Kelola Akun Petugas", url: "/" },
      { title: "Daftar Peringkat", url: "/rekrutmen/peringkat" },
    ],
  },
  { title: "Penugasan", url: "" },
  { title: "Master", url: "" },
  {
    title: "Pengaturan",
    url: "/",
    child: [
      { title: "Kelola Pengguna", url: "/" },
      { title: "Kelola Organisasi", url: "/" },
      { title: "Kelola Indikator", url: "/Pengaturan/KelolaIndikator" },
    ],
  },
];

const props = defineProps<{
  activeBar?: string;
  role?: Role;
  authorized?: boolean;
}>();

let menus: menuDetail[] = [
  { title: "Beranda", url: "/" },
  { title: "Galeri", url: "#galeri" },
  { title: "Sekilas SOBAT", url: "/#sekilas" },
];
if (props.role === "mitra") {
  menus = menusMitra;
} else if (props.role === "admin") {
  menus = menusAdmin;
}

let menuProfile: menuItem[] = [
  { title: "Profil", url: "/" },
  { title: "Keluar", url: "/logout" },
];

console.log("chceked");
</script>

<template>
  <div class="navbar flex my-3 lg:my-9 mx-8 lg:mx-24 justify-between">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-10 h-10 sm:hidden">
      <path
        fill-rule="evenodd"
        d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z"
        clip-rule="evenodd"
      />
    </svg>

    <!-- Logo+title and menu section -->
    <div class="logo-menu flex items-center justify-start">
      <div class="flex justify-start items-center">
        <NuxtLink to="/" class="logo flex justify-start items-center">
          <img src="/logo.png" alt="logo sobat BPS" class="h-6 w-6 lg:h-12 lg:w-12" />
          <p class="mx-3 sm:text-3xl"><strong>SOBAT</strong> BPS</p>
        </NuxtLink>
        <span class="font-light hidden sm:inline sm:text-4xl">|</span>
      </div>
      <div class="body1 file:menu sm:flex sm:justify-start hidden sm:show">
        <div class="mx-1" v-for="menu in menus">
          <AppMenuItem :menu="menu" :active="$props.activeBar === menu.title" />
        </div>
      </div>
    </div>
    <!-- Profile Section -->
    <div class="flex justify-end items-center" v-if="authorized">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="{1.5}" stroke="currentColor" class="w-10 h-10">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        />
      </svg>
      <AppDropdown :menu-dropdown="menuProfile">
        <div class="body1 ms-2">Halo, kakakk</div>
      </AppDropdown>
    </div>
    <div class="flex justify-end items-center" v-else>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="{1.5}" stroke="currentColor" class="sm:hidden w-10 h-10">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        />
      </svg>
      <div class="button-full hidden sm:inline">
        <NuxtLink to="/login">
          <button class="px-3 py-2 ms-5 rounded-full">Masuk</button>
        </NuxtLink>
        <NuxtLink to="/">
          <button class="bg-slate-200 px-3 py-2 ms-5 rounded-full">Registrasi</button>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  activeBar?: string;
}>();
const menus: string[] = ["Beranda", "Daftar Survei", "Riwayat Daftar", "Kartu Petugas"];
</script>

<template>
  <div class="navbar flex justify-between my-9 mx-24">
    <div class="logo-menu flex justify-start items-center">
      <div class="logo flex justify-start items-center">
        <img src="/logo.png" alt="logo sobat BPS" class="h-12 w-12" />
        <h4 class="mx-3"><strong>SOBAT</strong> BPS</h4>
        <h4 class="font-light">|</h4>
      </div>
      <div class="menu flex justify-start">
        <div class="mx-3 body1" v-for="menu in menus">
          <strong v-if="activeBar === menu">{{ menu }}</strong>
          <span v-else>{{ menu }}</span>
        </div>
      </div>
    </div>
    <div class="authorized flex justify-end items-center">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="{1.5}" stroke="currentColor" class="w-10 h-10">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        />
      </svg>
      <div class="body1 ms-2">Halo, kakakk</div>
    </div>
  </div>
</template>

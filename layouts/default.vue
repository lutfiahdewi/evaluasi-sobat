<script setup lang="ts">
const menu = [
  { title: "Beranda", url: "/beranda" },
  { title: "Galeri", url: "#galeri" },
  { title: "Sekilas SOBAT", url: "/#sekilas" },
];
</script>
<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader active-bar="" :authorized="false" :menus="menu" />
    <div class=" grow pb-6 mx-3 sm:mx-12 lg:mx-24">
      <slot />
    </div>
    <AppFooter class=""/>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  // title: "Beranda",
});
definePageMeta({
  //layout: false,
});
const authorizedRole = useCookie("authorizedRole");

if (authorizedRole.value !== undefined || authorizedRole.value !== null) {
    reloadNuxtApp({ path: "/beranda" });
  }

useCookie("activeBar").value = "Beranda";
</script>

<template>
  <!-- Hero Section -->
  <div id="hero" class="py-6 sm:py-18 grid grid-cols-2 sm:gap-12">
    <!-- Left Section -->
    <div class="deskripsi flex flex-col justify-between">
      <div class="judul">
        <p class="uppercase font-bold text-emerald-600">A helpful and friendly apps</p>
        <span class="text-2xl sm:text-6xl font-bold">SOBAT<br />BPS</span>
      </div>
      <div class="button-groups mb-6 lg:mb-12">
        <button class="rounded bg-amber-400 px-3 py-2 text-white font-light hover:bg-amber-500 me-5">Find out more</button>
        <!-- <button class="rounded-full bg-red-400 p-2">|></button> -->
      </div>
    </div>
    <!-- Right/Mascot Section -->
    <div class="maskot sm:pe-28">
      <!-- <img src="~/assets/img/Bung itung - fit.png" class="" /> -->
      <NuxtImg src="Bung itung - fit.png" loading="lazy" />
    </div>
  </div>
  <!-- Gallery Section -->
  <article id="galeri" class="my-8 sm:my-16">
    <div class="mb-48">
      <div class="grid place-content-center">
        <h6 class="text-center text-amber-900">Galeri Foto</h6>
        <h3 class="text-center font-bold">Dokumentasi Lapangan</h3>
        <p class="text-center max-w-[720px] body2">Kegiatan pengumpulan data yang dilakukan oleh Badan Pusat Statistik mencakup kegiatan sensus dan survei dengan responden yang beragam, dimulai dengan rumah tangga, perusahaan</p>
      </div>
    </div>
    <div class="py-48 bg-amber-300 bottom-0">Where Are we?</div>
  </article>
  <article id="sekilas">
    <div class="grid place-content-center">
      <h6 class="text-center text-amber-900 font-semibold">Sekilas SOBAT</h6>
      <h3 class="text-center font-bold">SOBAT...</h3>
      <p class="text-center max-w-[720px] body1">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis neque harum cumque illum sed, deserunt, hic, quos quam nulla eum at consequatur id. Voluptatum nisi atque repellat sapiente molestias rem accusantium, dolores
        maxime doloremque?
      </p>
    </div>
  </article>
  <div id="modal"></div>
</template>

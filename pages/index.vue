<script setup lang="ts">
useSeoMeta({
  title: "Beranda",
});
definePageMeta({
  layout: false,
});
const authorizedRole = useCookie("authorizedRole");
// if (authorizedRole.value === undefined || authorizedRole.value === null) {
//   authorizedRole.value = "default";
// }

function getRole(): string {
  if (authorizedRole.value === undefined || authorizedRole.value === null) {
    return "default";
  } else {
    return authorizedRole.value;
  }
}
const activeBar = useCookie("activeBar");
activeBar.value = "Beranda";
</script>

<template>
  <NuxtLayout :name="getRole()">
    <div id="hero" class="py-24 border grid grid-cols-2 gap-12">
      <div class="deskripsi flex flex-col justify-between bg-sky-100">
        <div class="judul">
          <span class="uppercase font-bold text-emerald-600">A helpful and friendly apps</span>
          <h1 class="font-bold">SOBAT<br />BPS</h1>
        </div>
        <div class="button-groups mb-12">
          <button class="rounded bg-amber-400 px-3 py-2 text-white font-light hover:bg-amber-500 me-5">Find out more</button>
          <button class="rounded-full bg-red-400 p-2">|></button>
        </div>
      </div>
      <div class="maskot bg-pink-100 pe-28">
        <img src="~/assets/img/Bung itung - fit.png" class="" />
      </div>
    </div>
    <article id="galeri" class="my-16">
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
          <h6 class="text-center text-amber-900">Sekilas SOBAT</h6>
          <h3 class="text-center font-bold">SOBAT...</h3>
          <p class="text-center max-w-[720px] body2">Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis neque harum cumque illum sed, deserunt, hic, quos quam nulla eum at consequatur id. Voluptatum nisi atque repellat sapiente molestias rem accusantium, dolores maxime doloremque?</p>
        </div>
    </article>
  </NuxtLayout>
</template>

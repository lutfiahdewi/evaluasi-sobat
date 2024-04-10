<script setup lang="ts">
useSeoMeta({
  title: "Beranda",
});
definePageMeta({
  layout: false,
  // middleware: 'auth'
});
/*const authorizedRole = useCookie('authorizedRole');
if (authorizedRole.value === undefined || authorizedRole.value === null){
    // authorizedRole.value = "default";
    navigateTo({ path: "/login" });
}*/

useCookie("activeBar").value = "Beranda";
const token = useCookie("token");
console.log("cookie: ", token.value)
</script>

<template>
  <NuxtLayout :name="useCookie('authorizedRole')">
    <article id="kegiatan">
      <div class="flex justify-center p-3 my-16">
        <!-- <div class="absolute top-36 right-10 w-48 h-20 bg-amber-400 z-0"></div> -->
        <NuxtImg src="sp2023.png" loading="lazy" class="z-10" />
        <!-- <div class="absolute -bottom-52 left-10 w-48 h-20 bg-amber-950 opacity-90 z-20"></div> -->
      </div>
      <div class="grid place-content-center">
        <h6 class="text-center text-amber-900 font-semibold mb-3">Tentang Kegiatan</h6>
        <h3 class="text-center font-bold mb-3">Sensus Pertanian - Pemutakhiran Kerangka Geospasial dan Muatan Wilkerstat ST2023 Tahun 2022.</h3>
        <div class="text-slate-700 body1 py-3">
          <p class="mb-3">
            Kegiatan Pemutakhiran Kerangka Geospasial dan Muatan Wilkerstat ST2023 adalah kegiatan pemetaan wilayah kerja statistik menjelang Sensus Pertanian 2023 (ST2023) yang dilaksanakan Tahun 2022. Output yang dihasilkan dari kegiatan
            ini adalah peta wilkerstat yang mutakhir beserta informasi muatan yang akan digunakan dalam pelaksanaan lapangan ST2023, serta kerangka geospasial tutupan lahan pertanian.
          </p>
          <p class="mb-3">Kegiatan ini dilaksanakan mulai Maret-Desember 2022 yang terdiri dari 2 tahapan yaitu Lapangan dan Pengolahan. Petugas yang diperlukan untuk kegiatan ini adalah pemeta, pengawas, pengolah muatan dan peta.</p>
        </div>
        <div class="flex justify-center my-6">
          <button class="bg-green_txt p-4 rounded-md text-white font-semibold">Tentang Kegiatan</button>
        </div>
      </div>
    </article>
  </NuxtLayout>
</template>

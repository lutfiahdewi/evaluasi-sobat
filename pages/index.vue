<script setup>
useSeoMeta({
  title: "Beranda",
});
const authorizedRole = useCookie("authorizedRole");
if (!authorizedRole.value) {
  authorizedRole = "default";
}
definePageMeta({
  layout: authorizedRole,
});
const activeBar = useCookie("activeBar");
activeBar.value = "Beranda";
</script>

<template>
  <section>
    <h1>Welcome to the homepage</h1>
    Tulis sesuatu disini
    <div class="my-96"></div>
  </section>
  <section id="galeri">
    <h3>Galeri</h3>
  </section>
  <section id="sekilas">
    <h4>Sekilas tentang SOBAT</h4>
  </section>
</template>

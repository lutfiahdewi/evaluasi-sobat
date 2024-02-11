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

function getRole():string{
  if (authorizedRole.value === undefined || authorizedRole.value === null){
    return 'default';
  }else{
    return authorizedRole.value;
  }
}
const activeBar = useCookie("activeBar");
activeBar.value = "Beranda";
</script>

<template>
  <NuxtLayout :name="getRole()">
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
</NuxtLayout>
</template>

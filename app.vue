<script setup lang="ts">
useHead({
  titleTemplate: (titleChild) => {
    return titleChild ? `${titleChild} - Evaluasi SOBAT Mitra` : "Evaluasi SOBAT Mitra";
  },
  meta: [{ name: "description", content: "An unnofficial part of SOBAT BPS for performance assessment." }],
  bodyAttrs: {
    class: "test",
  },
  link: [{ rel: "icon", type: "image/png", href: "/logo.png" }],
  // script: [{ innerHTML: "console.log('Main app rendered!')" }],
});

const authorizedRole = useCookie('authorizedRole');
if (authorizedRole.value === undefined || authorizedRole.value === null){
    authorizedRole.value = "default";
}
// const nuxtApp = useNuxtApp()
// nuxtApp.vueApp.component('QuillEditor', QuillEditor);
</script>

<template>
  <div>
    <!-- <NuxtWelcome /> -->
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

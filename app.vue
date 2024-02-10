<script setup lang="ts">
useHead({
  titleTemplate: (titleChild) => {
    return titleChild
      ? `${titleChild} - Evaluasi SOBAT Mitra`
      : 'Evaluasi SOBAT Mitra'
  },
  meta: [{ name: "description", content: "An unnofficial part of SOBAT BPS for performance assessment." }],
  bodyAttrs: {
    class: "test",
  },
  script: [{ innerHTML: "console.log('Rendered!')" }],
});

const counter : Ref = ref(0);
onUpdated(() => {
  counter.value++;
  console.log("Mounted ke: ");
})

</script>

<template>
  <div>
    <!-- <NuxtWelcome /> -->
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
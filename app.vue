<template>
  <div>
    <!-- <NuxtWelcome /> -->
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const counter : Ref = ref(0);
useHead({
  title: `${route.meta.title} - Evaluasi SOBAT Mitra`,
  meta: [{ name: "description", content: "My amazing site." }],
  bodyAttrs: {
    class: "test",
  },
  script: [{ innerHTML: "console.log('Rendered!')" }],
});

onUpdated(() => {
  counter.value++;
  console.log("Mounted ke: ");
})
</script>

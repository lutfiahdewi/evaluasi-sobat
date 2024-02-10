<script setup lang="ts">
defineProps<{
  activeBar?: string;
}>();
definePageMeta({
  // middleware: 'auth'
})
</script>

<template>

    <AppHeader role="mitra" :authorized="true" active-bar="Beranda"/>
    <div class="mx-24">
      <slot />
    </div>
    <AppFooter />

</template>

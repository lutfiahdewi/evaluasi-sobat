<template>
  <div>
    <AppHeader role="mitra" :authorized="true" :active-bar="activeBar"/>
    <div class="mx-24">
      <slot />
    </div>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  activeBar?: string;
}>();
let activeBar = "Evaluasi";

</script>
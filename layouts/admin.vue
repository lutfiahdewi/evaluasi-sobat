<script setup lang="ts">
</script>

<template>
    <AppHeader role="admin" :authorized="true" active-bar="Beranda"/>
    <div class="mx-24">
      <slot />
    </div>
    <AppFooter />
</template>
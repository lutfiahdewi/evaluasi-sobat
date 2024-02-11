<script setup lang="ts">
definePageMeta({
  layout: false,
});
const authorizedRole = useCookie("authorizedRole");
    authorizedRole.value = 'default';
    reloadNuxtApp({path: '/'});
</script>

<template>
    Logging you out...
</template>

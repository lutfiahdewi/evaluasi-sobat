<script setup lang="ts">
const authorizedRole = useCookie<string>("authorizedRole");
    authorizedRole.value = 'default';
    reloadNuxtApp({path: '/'});
</script>

<template></template>

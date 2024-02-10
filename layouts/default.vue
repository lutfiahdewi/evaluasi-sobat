<template>
  <div>
    <AppHeader active-bar="Beranda" :authorized="false" role="default" />
    <div class="mx-24">
      <slot />
    </div>
    <AppFooter />
  </div>
</template>

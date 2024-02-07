<template>
    <div>
      <AppHeader active-bar="Beranda" :authorized="false" role="default" />
      <slot></slot>
      <AppFooter />
    </div>
  </template>
  
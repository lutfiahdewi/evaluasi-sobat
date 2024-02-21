<!-- Dropdown Wrapper, consist of two component:
    1. The title of its menu (in this component, written in slot)
    2. The Dropdown menus [title, url] => each menu will be rendered as menu just like 
    the main menu using AppMenuItem component
-->
<script setup lang="ts">
import { vOnClickOutside } from '@vueuse/components'

interface menuItem {
  title: string;
  url: string;
}
defineProps<{
  menuDropdown: menuItem[];
}>();
const dropdown = ref(false);
function changeDropdown(){
  dropdown.value = !dropdown.value
}
</script>

<template>
  <div class="dropdown">
    <div class="clickable cursor-pointer" @click.stop="changeDropdown">
      <slot />
    </div>
    <div v-if="dropdown" v-on-click-outside="changeDropdown"
    class="dropdown-content  bg-gray p-3 rounded min-w-36 max-w-56 shadow-md">
      <div class="p-2 rounded-lg hover:bg-white" v-for="listMenu in menuDropdown">
        <NuxtLink :to="listMenu.url">
          {{ listMenu.title }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dropdown-content {
  position: absolute;
  z-index: 1;
}
</style>

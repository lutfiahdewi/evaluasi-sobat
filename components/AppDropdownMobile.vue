<!-- Only Dropdown For Mobile, consist of main and child menu -->
<script setup lang="ts">
import { vOnClickOutside } from "@vueuse/components";

interface menuItem {
  title: string;
  url: string;
}
interface menuDetail extends menuItem {
  child?: menuItem[];
  childActiveBar?: string;
}
const props = defineProps<{
  menu: menuDetail[];
  active: boolean;
}>();
const dropdown = ref(props.active);
function changeDropdown(){
  dropdown.value = !dropdown.value
}
</script>

<template>
  <div class="dropdown">
    <div class="clickable cursor-pointer" @click.stop="changeDropdown">
      <slot />
    </div>
    <div v-if="dropdown" v-on-click-outside="changeDropdown" class="dropdown-content w-full">
      <div class="hs-accordion-group bg-white shadow rounded p-3 w-full">
        <div class="block" v-for="menu in $props.menu" :key="menu.title">
          <BaseAccordion v-if="menu.child" :mainMenu="menu.title" :childMenu="menu.child" />
          <NuxtLink v-else :to="menu.url" class="block p-3 active:bg-slate-100 rounded">{{ menu.title }}</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dropdown-content {
  position: absolute;
  left: -4px;
  z-index: 1;
}
</style>

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
defineProps<{
  menu: menuDetail;
  active: boolean;
}>();

const clicked: Ref = ref(false);
function showDropdown() {
  clicked.value = !clicked.value;
}
</script>

<template>
  <NuxtLink :to="!Array.isArray(menu.child) ? menu.url : ''" :class="menu.child && 'dropdown'">
    <button class="p-2 mx-1 rounded-lg hover:bg-slate-200" @click="showDropdown" :class="{ 'bg-slate-200': clicked && menu.child }">
      <strong v-if="active">{{ menu.title }}</strong>
      <span v-else>{{ menu.title }}</span>
    </button>
  </NuxtLink>
  <div v-if="menu.child"  class="dropdown-content bg-gray p-3 mt-1 rounded min-w-36 max-w-56 shadow-md" :class="{ show: clicked }">
    <NuxtLink :to="childMenu.url" v-for="childMenu in menu.child" :key="childMenu.title.toString">
      <div class="p-2 mb-1 rounded-lg hover:bg-white">
        <strong v-if="childMenu.title === 'Cara'">{{ childMenu.title }}</strong>
        <span v-else>{{ childMenu.title }}</span>
      </div>
    </NuxtLink>
  </div>
</template>

<style scoped>
.dropdown-content {
  display: none;
  position: absolute;
  z-index: 1;
}

.dropdown:hover + .dropdown-content {
  display: block;
}
.dropdown-content:hover {
  display: block;
}
.show {
  display: block;
}
</style>

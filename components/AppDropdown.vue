<!-- Dropdown Wrapper, consist of two component:
1. The title of its menu
2. The Dropdown menus [title, url] => each menu will be rendered as menu just like 
the main menu using AppMenuItem component
 -->
<style scoped>
.dropdown-content {
    display: none;
    position: absolute;
    z-index: 1;
  }
  
  .dropdown:hover .dropdown-content {
    display: block;
  }
</style>

<template>
    <div class="dropdown">
        <slot/>
        <div class="dropdown-content bg-gray p-3 rounded min-w-36 max-w-56 shadow-md">
            <div class="p-2 rounded-lg hover:bg-white" v-for="listMenu in menuDropdown">
                <NuxtLink :to="listMenu.url">
                    {{ listMenu.title }}
                </NuxtLink>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
interface menuItem {
  title: string;
  url: string;
}
    defineProps<{
    menuDropdown?: menuItem[]
}>();
</script>
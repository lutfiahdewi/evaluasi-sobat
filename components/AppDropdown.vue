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
        {{ menuTitle }}
        <div class="dropdown-content bg-gray p-3 mt-2 rounded min-w-36 max-w-56 shadow-md">
            <div class="p-2 rounded-lg hover:bg-white" v-for="listMenu in menuDropdown">{{ listMenu }}</div>
        </div>
    </div>
</template>
<script setup lang="ts">
    defineProps<{
    menuTitle?: string,
    menuDropdown?: string[]
}>();
</script>
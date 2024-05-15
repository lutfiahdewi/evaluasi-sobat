<script setup lang="ts">
interface menuItem {
  title: string;
  url: string;
}
interface menuDetail extends menuItem {
  child?: menuItem[];
}
const props = defineProps<{
  activeBar?: string;
  authorized: boolean;
  menus: menuDetail[];
}>();
const menuProfile: menuItem[] = [
  { title: "Profil", url: "/profile" },
  { title: "Keluar", url: "/logout" },
];
const menuClicked = ref(false);
function changeMenuClicked() {
  menuClicked.value = !menuClicked.value;
}
const authorizedRole = useCookie("authorizedRole");
const userFirstName = useCookie("userFirstName");
// const name = ref(userFirstName.);
//  dataProfile ? ', '+ dataProfile.profile.nama : ''
// const { data: dataProfile } = await useAsyncQuery(useGetProfile());
// name.value = dataProfile.value?.profile.nama
</script>

<template>
  <div class="navbar sticky top-0 z-50 mb-3 sm:mb-6 bg-white flex p-2 sm:py-5 md:px-12 lg:px-24 justify-between items-center shadow">
    <!-- Menu mobile -->

    <AppDropdownMobile :menu="props.menus" class="sm:hidden" :active="menuClicked">
      <IconHamburger class="w-8 h-8 sm:hidden" v-if="!menuClicked" @click="changeMenuClicked" />
      <IconClose class="w-8 h-8 sm:hidden" v-else @click="changeMenuClicked" />
    </AppDropdownMobile>

    <!-- Logo+title and menu section -->
    <div class="flex items-center justify-start">
      <!-- logo and title section -->
      <div class="flex justify-start items-center">
        <NuxtLink to="/" class="logo flex justify-start items-center">
          <img src="/logo.png" alt="logo sobat BPS" class="h-6 w-6 lg:h-12 lg:w-12" />
          <p class="mx-3 sm:text-xl lg:text-3xl">
            <span v-if="authorizedRole === 'admin'">Kelola <strong>SOBAT</strong></span
            ><span v-else><strong>SOBAT</strong> BPS</span>
          </p>
        </NuxtLink>
        <span class="font-light hidden sm:inline sm:text-4xl">|</span>
      </div>
      <!-- Menu section for full view -->
      <div class="body2 lg:text-base file:menu sm:flex sm:justify-start hidden sm:show sm:max-w-[450px] sm:overflow-x-auto lg:max-w-none">
        <div class="mx-1" v-for="menu in props.menus" :key="menu.title.toString()">
          <AppMenuItem :menu="menu" :active="props.activeBar === menu.title" />
        </div>
      </div>
    </div>
    <!-- Profile Section -->
    <!-- Authorized Profile -->
    <div class="flex justify-end items-center" v-if="authorized">
      <AppDropdown :menu-dropdown="menuProfile">
        <IconUser class="w-10 h-10" />
      </AppDropdown>
      <span class="body1 ms-2 hidden lg:inline">Halo{{ userFirstName ? ', '+userFirstName : '' }}</span>
    </div>
    <!-- Unauthorized Profile -->
    <div class="flex justify-end items-center" v-else>
      <NuxtLink to="/login">
        <IconUser class="lg:hidden w-10 h-10" />
      </NuxtLink>
      <div class="button-full hidden lg:inline">
        <NuxtLink to="/login">
          <button class="px-3 py-2 ms-5 rounded-full">Masuk</button>
        </NuxtLink>
        <NuxtLink to="/">
          <button class="bg-slate-200 px-3 py-2 ms-5 rounded-full">Registrasi</button>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: "Masuk",
});
type Role = "default" | "admin" | "mitra";
interface User {
  username: string;
  password: string;
}
let username = ref("");
let password = ref("");

const authorizedRole = useCookie<Role>("authorizedRole");

if (authorizedRole.value !== "default") {
  /*if (typeof window !== "undefined") {
    window.alert("Already logged! \nPlease log out first!");
  }*/
  reloadNuxtApp({ path: "/beranda" });
}

function submitForm() {
  if (!username || !password) {
    window.alert("Please fill the form.");
    return;
  }
  let newUser: User = {
    username: username.value,
    password: password.value,
  };
  const role: Role = validateUser(newUser);
  if (role === "mitra") {
    authorizedRole.value = role;
    return reloadNuxtApp({ path: "/beranda" });
  } else if (role === "admin") {
    authorizedRole.value = role;
    return reloadNuxtApp({ path: "/beranda" });
  }
  password.value = "";
  return;
}

const isFormInvalid = computed(() => {
  return username.value.length < 1 || password.value.length < 8;
});

function validateUser(user: User): Role {
  if (user.username === "admin") {
    return "admin";
  } else if (user.username === "mitra") {
    return "mitra";
  } else {
    return "default";
  }
}
</script>

<template>
  <div class="flex justify-center">
    <div class="w-fit bg-orange_1/25 border border-slate-500 flex rounded-xl">
      <!-- <img src="https://cdn-icons-png.flaticon.com/512/7264/7264636.png" alt="" class="max-w-64" /> -->
      <div class="relative w-72 hidden sm:inline">
        <img src="~/assets/img/Bung itung - fit.png" alt="" class="absolute -left-20 bottom-0 z-10 min-w-96" />
      </div>
      <div class="min-w-96 shadow-inner bg-white rounded-xl p-6">
        <div class="border-b border-slate-500 mx-2 text-center text-xl">Login Pengguna</div>
        <form action="" class="mt-6">
          <label for="input-email" class="block text-sm font-medium mb-2">Username/Email</label>
          <input
            v-model="username"
            type="email"
            id="input-email"
            class="py-3 px-4 mb-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
            placeholder="Masukkan username atau email"
          />
          <label for="input-password" class="block text-sm font-medium mb-2">Password</label>
          <input
            v-model="password"
            type="password"
            id="input-password"
            class="py-3 px-4 mb-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
            placeholder="Masukkan password"
            @keypress.enter="submitForm"
          />
          <button class="w-full py-2 mt-1 bg-slate-300 rounded-lg disabled:bg-slate-200 disabled:text-slate-400" @click.prevent="submitForm" :disabled="isFormInvalid">Login</button>
        </form>
        <div class="my-1 py-3 flex items-center text-sm text-gray-800 before:flex-[1_1_0%] before:border-t before:border-gray-200 before:me-6 after:flex-[1_1_0%] after:border-t after:border-gray-200 after:ms-6">atau</div>
        <button class="w-full py-2 bg-green-500 rounded-lg body1">Login SSO Eksternal BPS</button>
      </div>
    </div>
  </div>
</template>

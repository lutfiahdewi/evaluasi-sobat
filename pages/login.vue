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
  if (typeof window !== "undefined") {
    window.alert("Already logged! \nPlease log out first!");
  }
  navigateTo({ path: "/" });
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
  console.log(role);
  if (role === "mitra") {
    // isAuthorized.value = true;
    authorizedRole.value = role;
    return reloadNuxtApp({ path: "/evaluasi/carapenilaian" });
    // return navigateTo("/");
  } else if (role === "admin") {
    // isAuthorized.value = true;
    authorizedRole.value = role;
    // return useRouter().push({ path: "/" }); //still not reloading too
    return reloadNuxtApp({ path: "/rekrutmen/peringkat" });
  }
  password.value = "";
  return;
}

const isFormInvalid = computed(() => {
  return !username || password.value.length < 8;
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
  <div>
    <div class="flex justify-center">
      <div class="w-fit bg-orange_1/25 border border-slate-500 flex rounded-xl">
        <!-- <img src="https://cdn-icons-png.flaticon.com/512/7264/7264636.png" alt="" class="max-w-64" /> -->
        <img src="~/assets/img/Bung itung.png" alt="" class="max-w-64" />
        <div class="min-w-96 shadow-inner bg-white rounded-xl p-6">
          <div class="border-b border-slate-500 mx-2 text-center">Login Pengguna</div>
          <form action="" class="my-5">
            <label for="input-label" class="block text-sm font-medium mb-2">Username/Email</label>
            <input
              v-model="username"
              type="email"
              id="input-label"
              class="py-3 px-4 mb-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
              placeholder="Masukkan username atau email"
            />
            <label for="input-label" class="block text-sm font-medium mb-2">Password</label>
            <input
              v-model="password"
              type="password"
              id="input-label"
              class="py-3 px-4 mb-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
              placeholder="Masukkan password"
              @keypress.enter="submitForm"
            />
            <button class="w-full py-2 mt-1 bg-slate-400 rounded-lg" @click.prevent="submitForm" :disabled="isFormInvalid">Login</button>
          </form>
          atau
          <button class="w-full py-2 bg-green-500 rounded-lg body1">Login SSO Eksternal BPS</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
img{
  position: relative;
  top: -75x;
  left: -25px;
}
</style>
<script setup lang="ts">
useSeoMeta({
  title: "Masuk",
});
import { storeToRefs } from 'pinia'; // import storeToRefs helper hook from pinia
// import User from '~/components/Icon/User.vue';
import { useAuthStore } from '~/store/auth'; // import the auth store we just created

type Role = "default" | "admin" | "mitra"| "operator";
interface User {
  email: string;
  password: string;
}
const isDataSent = ref(false);
const isDataLoading = ref(false);
const isDataError = ref(false);


const { authenticateUser } = useAuthStore(); // use authenticateUser action from  auth store
const { authenticated } = storeToRefs(useAuthStore()); // make authenticated state reactive with storeToRefs
const user = reactive({email:'',password:''})

const login = async () => {
  await authenticateUser(user); // call authenticateUser and pass the user object
  // redirect to homepage if user is authenticated
  if (authenticated) {
    isDataSent.value = true;
    reloadNuxtApp({ path: "/beranda" });
  }else{
    isDataError.value = true;
  }
};

const authorizedRole = useCookie<Role>("authorizedRole");
/*if (authorizedRole.value !== "default") {
  reloadNuxtApp({ path: "/beranda" });
}*/

function submitForm() {
  if (!user.email || !user.password) {
    // window.alert("Please fill the form.");
    return;
  }
  isDataLoading.value = true;
  const role: Role = validateUser(user);
  if (role !== "default") {
    authorizedRole.value = role;
    // return reloadNuxtApp({ path: "/beranda" });
  }
  login();
  user.password = "";
  isDataLoading.value = false;
  return;
}

const isFormInvalid = computed(() => {
  return user.email.length < 1 || user.password.length < 8;
});

function validateUser(user: User): Role {
  if (user.email === "admin@mail.com") {
    return "admin";
  } else if (user.email === "mitra@mail.com") {
    return "mitra";
  }else if (user.email === "operator@mail.com") {
    return "operator";
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
          <label for="input-email" class="block text-sm font-medium mb-2">Email</label>
          <input
            v-model="user.email"
            type="email"
            id="input-email"
            class="py-3 px-4 mb-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
            placeholder="Masukkan username atau email"
          />
          <label for="input-password" class="block text-sm font-medium mb-2">Password</label>
          <input
            v-model="user.password"
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
  <!-- MOdal-modal lain -->
  <ModalSuccess v-if="isDataSent" @close="isDataSent = !isDataSent" />
  <ModalLoading v-if="isDataLoading" @close="isDataLoading = !isDataLoading" />
  <ModalError v-if="isDataError" @close="isDataError = !isDataError" />
</template>

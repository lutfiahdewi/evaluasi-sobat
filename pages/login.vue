<script setup lang="ts">
useSeoMeta({
  title: "Masuk",
});
import { storeToRefs } from "pinia"; // import storeToRefs helper hook from pinia
import { object, string } from "yup";
import { useAuthStore } from "~/store/auth"; // import the auth store we just created

type Role = "default" | "admin" | "mitra" | "operator";
interface User {
  email: string;
  password: string;
}
const isDataSent = ref(false);
const isDataLoading = ref(false);
const isUserNotFound = ref(false);
const isEmailNotValid = ref(false);

const { authenticateUser } = useAuthStore(); // use authenticateUser action from  auth store
// const { authenticated, getRoleId } = storeToRefs(useAuthStore()); // make authenticated state reactive with storeToRefs
const user:User = reactive({ email: "", password: "" });

const authorizedRole = useCookie<Role>("authorizedRole");
const token = useCookie("token");
if (authorizedRole.value !== "default" && token.value) {
  reloadNuxtApp({ path: "/beranda" });
}

// login procedure
const login = async () => {
  const isAuthenticated = await authenticateUser(user); // call authenticateUser and pass the user object
  // redirect to homepage if user is authenticated
  if (isAuthenticated) {
    isDataSent.value = true;
    // authorizedRole.value = validateRole(getRoleId.value);
    reloadNuxtApp({ path: "/beranda" });
  } else {
    isUserNotFound.value = true;
    user.password = "";
    isDataLoading.value = false;
    // isDataError.value = true;
  }
};
async function submitForm() {
  let parsedUser: any;
  try {
    parsedUser = await userSchema.validate({ email: user.email, password: user.password });
    if (parsedUser.email) {
      isDataLoading.value = true;
      login();
    }
  } catch (e) {
    console.log(e);
    isEmailNotValid.value = true;
    // user.email = '';
    user.password = "";
    return;
  }
  return;
}

// /Validation
let userSchema = object({
  email: string().required().email(),
  password: string().required().min(8),
});
const isFormInvalid = computed(() => {
  return user.email.length < 1 || user.password.length < 8;
});
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
            @keyup.delete="isEmailNotValid = false"
            type="email"
            id="input-email"
            class="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
            placeholder="Masukkan username atau email"
            :class="isEmailNotValid ? 'mb-1' : 'mb-4'"
          />
          <p class="text-sm font-medium mb-4 text-red-500" v-if="isEmailNotValid">Email tidak sesuai format!</p>
          <label for="input-password" class="block text-sm font-medium mb-3">Password</label>
          <input
            v-model="user.password"
            type="password"
            id="input-password"
            class="py-3 px-4 mb-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
            placeholder="Masukkan password"
            @keypress.enter="submitForm"
          />
          <button class="w-full py-2 mt-1 bg-slate-300 rounded-lg disabled:bg-slate-200 disabled:text-slate-400" @click.prevent="submitForm" :disabled="isFormInvalid">Login</button>
          <p class="py-2 text-red-500 text-sm font-medium" v-if="isUserNotFound">Pengguna tidak ditemukan</p>
        </form>
        <div class="my-1 py-3 flex items-center text-sm text-gray-800 before:flex-[1_1_0%] before:border-t before:border-gray-200 before:me-6 after:flex-[1_1_0%] after:border-t after:border-gray-200 after:ms-6">atau</div>
        <button class="w-full py-2 bg-green-500 rounded-lg body1">Login SSO Eksternal BPS</button>
      </div>
    </div>
  </div>
  <!-- MOdal-modal lain -->
  <ModalSuccess v-if="isDataSent" @close="isDataSent = !isDataSent" />
  <ModalLoading v-if="isDataLoading" @close="isDataLoading = !isDataLoading" />
</template>

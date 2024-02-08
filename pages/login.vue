<template>
  <div>
    <div class="flex justify-center">
      <div class="w-fit bg-orange_1/25 border border-slate-500 flex rounded-xl">
        <img src="https://cdn-icons-png.flaticon.com/512/7264/7264636.png" alt="" class="max-w-64" />
        <div class="min-w-96 shadow-inner bg-white rounded-xl p-6">
          <div class="border-b border-slate-500 mx-2 text-center">Login Pengguna</div>
          <form action="" class="my-5">
            <label for="input-label" class="block text-sm font-medium mb-2">Username/Email</label>
            <input
              type="email"
              id="input-label"
              class="py-3 px-4 mb-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
              placeholder="Masukkan username atau email"
            />
            <label for="input-label" class="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              id="input-label"
              class="py-3 px-4 mb-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
              placeholder="Masukkan username atau email"
            />
            <button type="submit" class="w-full py-2 mt-1 bg-slate-400 rounded-lg">Login</button>
          </form>
          atau
          <button class="w-full py-2 bg-green-500 rounded-lg body1">Login SSO Eksternal BPS</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: "Masuk",
});
</script>

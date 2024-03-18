<script setup lang="ts">
import type { StepProgress } from "#build/components";

useSeoMeta({
  title: "Kelola Survei",
});
const dataProgress = {
  steps: ["Survei/Sensus", "Wilayah", "Evaluasi", "Ringkasan"],
  currentStep: 0,
  activeColor: "bg-zinc-300",
  passiveColor: "bg-zinc-100",
  textColor: "text-white",
};
const step = ref<InstanceType<typeof StepProgress> | null>(null);
</script>

<template>
  <h3 class="font-bold mb-3">Kelola Survei</h3>
  <BaseButtonMode mode="normal" shape="square" class="text-lg" data-hs-overlay="#hs-large-modal"><IconAdd class="h-5 w-5 inline" /> Tambahkan Survei Baru</BaseButtonMode>
  <div id="hs-large-modal" class="hs-overlay hidden size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto pointer-events-none">
    <div class="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all lg:max-w-4xl lg:w-full m-3 lg:mx-auto">
      <div class="flex flex-col bg-zinc-600 opacity-95 border shadow-sm rounded-lg pointer-events-auto">
        <div class="flex justify-between items-center py-3 px-4 border-b">
          <h4 class="font-bold text-white">Buat Survei</h4>
          <button
            type="button"
            class="flex justify-center items-center size-7 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
            data-hs-overlay="#hs-large-modal"
          >
            <span class="sr-only">Close</span>
            <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
        <div class="py-5 px-8 overflow-y-auto">
          <StepProgress :dataMain="dataProgress" ref="step" />
          <form>
            <div class="form-1" v-if="step?.data?.currentStep === 0">
              <div class="grid grid-cols-4 gap-4">
                <!-- Kode survei -->
                <label for="kode" class="self-center font-medium text-lg text-white mb-3">Kode survei</label>
                <input type="text" id="kode" class="col-span-3 py-3 px-4 block w-full border-gray-200 rounded-lg mb-3 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none" placeholder="" />
                <!-- Nama survei -->
                <label for="nama" class="self-center font-medium text-lg text-white mb-3">Nama survei</label>
                <input type="text" id="nama" class="col-span-3 py-3 px-4 block w-full border-gray-200 rounded-lg mb-3 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none" placeholder="" />
                <!-- Tipe survei -->
                <label for="tipe" class="self-center font-medium text-lg text-white mb-3">Tipe</label>
                <select id="nama" class="col-span-3 py-3 px-4 block w-full border-gray-200 rounded-lg mb-3 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none">
                  <option selected disabled>Pilih tipe</option>
                  <option>Tipe 1</option>
                  <option>Tipe 2</option>
                  <option>Tipe 3</option>
                </select>
              </div>
            </div>
            <div class="form-1" v-if="step?.data?.currentStep === 1">A</div>
            <div class="form-1" v-if="step?.data?.currentStep === 2">Evaluasi</div>
            <div class="form-1" v-if="step?.data?.currentStep === 3">Ringkasan</div>
          </form>
        </div>
        <div class="flex justify-end items-center gap-x-2 py-3 px-4 border-t">
          <button
            type="button"
            class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
            data-hs-overlay="#hs-large-modal"
          >
            Batal
          </button>
          <!-- <button
            type="button"
            class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
          >
            Save changes
          </button> -->
          <BaseButtonMode mode="gray" shape="square" class="border me-3" @click="step?.previousStep()">Sebelumnya</BaseButtonMode>
          <BaseButtonMode mode="gray" shape="square" class="border" @click="step?.nextStep()">Selanjutnya</BaseButtonMode>
        </div>
      </div>
    </div>
  </div>
  <section>
    <div class="grid grid-cols-4 gap-4">
      <label for="category-label" class="text-xl mb-2">PJ kegiatan</label>
      <input type="text" id="category-label" class="block col-span-3 py-3 px-4 w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none" placeholder="" />
    </div>
  </section>
  <section>#Tabel kegiatan</section>
</template>

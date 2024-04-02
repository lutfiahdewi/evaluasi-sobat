<script setup lang="ts">
// import { HSOverlay } from "preline";

useSeoMeta({
  title: "Kelola Indikator",
});

// const { total, update } = useIndicators();
const currentIndicators = useState<number>("indicators", () => 1);
// const currentIndicators = ref(total)
/*
function openModal(selector: string) {
  const element = document.getElementById(selector);
  if (element != null) {
    const modal = new HSOverlay(element);
    modal.open();
  }else{
    console.log('Modal by selector: ', selector, ', is not exist.')
  }
}

function closeByModal(selector: string) {
  const element = document.getElementById(selector);
  if (element != null) {
    const modal = new HSOverlay(element);
    modal.close();
  }else{
    console.log('Modal by selector: ', selector, ', is not exist.')
  }
}
*/
function closeModal(id: string) {
  const backdrop = document.getElementById(id);
  backdrop ? backdrop.remove() : "";
  document.body.style.overflow = "auto";
}
</script>
<template>
  <!-- Daftar Kategori -->
  <h3 class="font-bold mb-3">Kategori Indikator</h3>
  <section class="mb-3">
    <BaseButtonMode shape="square" mode="normal" data-hs-overlay="#hs-focus-management-modal" class="me-3"> <IconAdd class="h-4 w-4 me-1 inline" /> Tambah Kategori dan Indikator </BaseButtonMode>
    <!-- Modal Section: memilih jumlah indikator -->
    <div id="hs-focus-management-modal" class="hs-overlay hs-overlay-backdrop-open:bg-slate-100/50 hidden size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto pointer-events-none">
      <div class="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto">
        <div class="flex flex-col bg-slate-200 border shadow-sm rounded-xl pointer-events-auto">
          <!-- Header Modal -->
          <div class="flex justify-between items-center py-3 px-4 border-b">
            <h5 class="font-bold text-gray-800">Buat kategori indikator baru</h5>
            <button
              type="button"
              class="flex justify-center items-center size-7 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
              data-hs-overlay="#hs-focus-management-modal"
            >
              <span class="sr-only">Close</span>
              <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
          <!-- Body Modal -->
          <div class="p-4 overflow-y-auto">
            <label for="weight-label" class="block mb-2">Jumlah indikator</label>
            <select v-model="currentIndicators" id="weight-label" class="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none" autofocus>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
              <option>6</option>
              <option>7</option>
              <option>8</option>
              <option>9</option>
            </select>
          </div>
          <!-- Footer Modal -->
          <div class="flex justify-end items-center gap-x-2 py-3 px-4 border-t dark:border-gray-700">
            <button
              type="button"
              class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
              data-hs-overlay="#hs-focus-management-modal"
            >
              Batal
            </button>
            <NuxtLink to="/pengaturan/tambahIndikator/" class="">
              <BaseButtonMode shape="square" mode="normal" data-hs-overlay="#hs-focus-management-modal" @click="closeModal('hs-focus-management-modal-backdrop')"> Buat kategori </BaseButtonMode>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
    <BaseButtonMode shape="square" mode="outlined"> <IconAdd class="h-4 w-4 me-1 inline" /> Tambah Kategori dari indikator tersedia </BaseButtonMode>
    <div class="my-6">
      <TableKategoriIndikator />
    </div>
  </section>

  <!-- Daftar Indikator -->
  <h3 class="font-bold mb-3">Satuan Indikator</h3>
  <section>
    <BaseButtonMode shape="square" mode="normal" data-hs-overlay="#hs-medium-modal" class="me-3"> <IconAdd class="h-4 w-4 me-1 inline" /> Tambah Indikator </BaseButtonMode>
    <!-- MOdal section: tambah indikator -->
    <div id="hs-medium-modal" class="hs-overlay hs-overlay-backdrop-open:bg-slate-100/50 hidden size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto pointer-events-none">
      <div class="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all md:max-w-2xl md:w-full m-3 md:mx-auto">
        <div class="flex flex-col bg-slate-200 border shadow-sm rounded-xl pointer-events-auto">
          <!-- Header MOdal -->
          <div class="flex justify-between items-center py-3 px-4 border-b">
            <h5 class="font-bold">Buat Indikator</h5>
            <button
              type="button"
              class="flex justify-center items-center size-7 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
              data-hs-overlay="#hs-medium-modal"
            >
              <span class="sr-only">Close</span>
              <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
          <!-- Body Modal -->
          <div class="p-4 overflow-y-auto">
            <form>
              <label for="nama" class="block font-medium mb-2">Nama Indikator</label>
              <input type="text" id="nama" class="py-3 px-4 mb-3 block w-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none" placeholder="Nama indikator" />
              <label for="definsi" class="block font-medium mb-2">Definisi Indikator</label>
            </form>
          </div>
          <!-- Footer MOdal -->
          <div class="flex justify-end items-center gap-x-2 py-3 px-4 border-t dark:border-gray-700">
            <button
              type="button"
              class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
              data-hs-overlay="#hs-medium-modal"
              @click="closeModal('hs-medium-modal')"
            >
              Batal
            </button>
            <BaseButtonMode shape="square" mode="normal" data-hs-overlay="#hs-medium-modal" @click="closeModal('hs-medium-modal')"> Buat indikator </BaseButtonMode>
          </div>
        </div>
      </div>
    </div>
    <div class="my-6">
      <TableIndikator />
    </div>
  </section>

  <section>
    <button type="button" data-hs-overlay="#hs-unstyled-modal" class="rounded-xl bg-sky-400 px-4 py-3">Open modal</button>
    <div id="hs-unstyled-modal" class="hs-overlay hidden size-full fixed top-0 start-0 z-[60] overflow-x-hidden overflow-y-auto pointer-events-none">
      <div class="hs-overlay-open:opacity-100 hs-overlay-open:duration-500 opacity-0 transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto">
        <div class="pointer-events-auto">Modal content</div>
      </div>
    </div>
  </section>
</template>

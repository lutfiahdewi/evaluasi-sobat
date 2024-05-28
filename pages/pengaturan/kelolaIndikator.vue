<script setup lang="ts">
import type { ModalBase } from "#build/components";
import { logErrorMessages } from "@vue/apollo-util";

useSeoMeta({
  title: "Kelola Kategori Indikator",
});

const currentIndicators = useState<number>("indicators", () => 1);
const newCatIndModal = ref<InstanceType<typeof ModalBase> | null>(null);
const newCatModal = ref<InstanceType<typeof ModalBase> | null>(null);
const newIndModal = ref<InstanceType<typeof ModalBase> | null>(null);

//Modal
const isDataSent = ref(false);
const isDataLoading = ref(false);
const isDataError = ref(false);

// Indikator baru
const namaIndikator = ref("");
const namaIndikatorValid = ref(true);
const benefitIndikator = ref();
const benefitIndikatorValid = ref(true);
const definisiIndikator = ref("");
function newIndikator() {
  const { mutate: sendIndikator, onDone: resultIndikator, onError: errorIndikator, loading: loadingIndikator } = useMutation(useCreateIndikator());
  namaIndikatorValid.value = true;
  benefitIndikatorValid.value = true;
  if (namaIndikator.value.length < 1) namaIndikatorValid.value = false;
  if (!benefitIndikator.value) benefitIndikatorValid.value = false;
  if (!namaIndikatorValid.value || !benefitIndikatorValid.value) return false;
    isDataLoading.value = true;
    // useMutation
    sendIndikator({
      input: {
        branch_kd: "0123ABC",
        nama: useCapitalize(namaIndikator.value),
        is_benefit: benefitIndikator.value,
        definisi: definisiIndikator.value,
      },
    });
    errorIndikator((error) => {
      logErrorMessages(error);
      isDataLoading.value = false;
      isDataError.value = true;
      return;
    });
    // reload
    resultIndikator(() => {
      reloadNuxtApp();
    });
  }
</script>
<template>
  <!-- Daftar Kategori -->
  <h3 class="font-bold mb-3">Kelola Kategori Indikator</h3>
  <!-- Tata cara -->
  <NuxtLink :to="'tataCara'">
    <BaseButtonMode mode="gray" shape="square" class="border border-slate-600 shadow">Tata Cara Kelola Kategori-Indikator</BaseButtonMode>
  </NuxtLink>
  <section class="mb-3">
    <!-- Modal membuat kategori dan indikator baru -->
    <ModalBase ref="newCatIndModal">
      <template #header>
        <h5 class="font-bold text-gray-800">Buat kategori indikator baru</h5>
      </template>
      <template #body>
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
      </template>
      <template #footer>
        <div class="flex justify-end">
          <NuxtLink to="/pengaturan/tambahKategoriIndikator/" class="">
            <BaseButtonMode shape="square" mode="normal" @click="newCatIndModal?.close()"> Buat Kategori </BaseButtonMode>
          </NuxtLink>
        </div>
      </template>
    </ModalBase>
    <BaseButtonMode shape="square" mode="normal" class="me-3" @click="newCatIndModal?.open()"> <IconAdd class="h-4 w-4 me-1 inline" /> Tambah Kategori dan Indikator </BaseButtonMode>
    <!-- Modal membuat kategori baru -->
    <NuxtLink to="/pengaturan/tambahKategori">
      <BaseButtonMode shape="square" mode="outlined"> <IconAdd class="h-4 w-4 me-1 inline" /> Tambah Kategori dari indikator tersedia </BaseButtonMode>
    </NuxtLink>
    <div class="my-6">
      <TableKategoriIndikator />
    </div>
  </section>

  <!-- Daftar Indikator -->
  <h3 class="font-bold mb-3">Satuan Indikator</h3>
  <section>
    <!-- Modal section: tambah indikator -->
    <ModalBase ref="newIndModal" width="w-[900px] " maxHeight="max-h-96 2xl:max-h-[640px]">
      <template #header>
        <h5 class="font-bold">Buat Indikator</h5>
      </template>
      <template #body>
        <form>
          <label for="nama" class="block font-medium mb-2">Nama Indikator</label>
          <input
            v-model="namaIndikator"
            type="text"
            id="nama"
            class="py-3 px-4 block w-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
            :class="!namaIndikatorValid ? 'mb-1' : 'mb-4'"
            placeholder="Nama indikator"
          />
          <p class="text-red-500 mb-4" v-if="!namaIndikatorValid">Nama indikator harus diisi!</p>
          <label id="tipe-label" class="block font-medium mb-2">Tipe Indikator</label>
          <div class="grid grid-cols-2 content-center">
            <div class="flex ps-2">
              <input v-model="benefitIndikator" type="radio" class="me-2 shrink-0 mt-0.5 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none" id="cost" value="0" />
              <label for="cost">Cost</label>
            </div>
            <div class="flex">
              <input v-model="benefitIndikator" type="radio" class="me-2 shrink-0 mt-0.5 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none" id="benefit" value="1" />
              <label for="benefit">Benefit</label>
            </div>
          </div>
          <p class="text-red-500 mb-2" v-if="!benefitIndikatorValid">Pilih salah satu tipe indikator!</p>
          <label for="definsi" class="block font-medium my-2">Definisi Indikator</label>
          <div class="bg-slate-50">
            <QuillEditor v-model:content="definisiIndikator" theme="snow" contentType="html" />
          </div>
        </form>
      </template>
      <template #footer>
        <div class="flex justify-end items-center gap-x-2">
          <BaseButtonMode shape="square" mode="normal" @click.prevent="newIndikator()"> Buat indikator </BaseButtonMode>
        </div>
      </template>
    </ModalBase>
    <BaseButtonMode shape="square" mode="normal" class="me-3" @click="newIndModal?.open()"> <IconAdd class="h-4 w-4 me-1 inline" /> Tambah Indikator </BaseButtonMode>
    <div class="my-6">
      <TableIndikator />
    </div>
  </section>

  <!-- MOdal-modal lain -->
  <ModalSuccess v-if="isDataSent" @close="isDataSent = !isDataSent" />
  <ModalLoading v-if="isDataLoading" @close="isDataLoading = !isDataLoading" />
  <ModalError v-if="isDataError" @close="isDataError = !isDataError" />
</template>

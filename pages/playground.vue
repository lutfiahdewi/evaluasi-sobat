<script lang="ts" setup>
import type { ModalBase, StepProgress } from "#build/components";

definePageMeta({
  layout: "default",
});
// GraphQL example
const query = gql`
  query {
    allKategori {
      nama
    }
  }
`;
const currentYear = new Date().getFullYear();
const defaultYear :string[] = []
defaultYear.push(currentYear.toString());
const { data, error } = await useAsyncQuery(query);
const dataColumn = [
  { label: "kategori", field: "kategori" },
  // { label: "Director", field: "director" },
];
/*
type film = {
  title: String;
  director: String;
};

const dataFilms2: film[] = [];

if (data.value) {
  let filmTemp: film;
  for (const film of data.value.allFilms.films) {
    filmTemp = { title: film.title, director: film.director };
    dataFilms2.push({ title: film.title, director: film.director });
  }
} else if (loading) {
  console.log(loading);
} else {
  console.log("Can't parse data");
}*/

//dropdown eaxaple
const menuMitra = [
  { title: "Beranda", url: "/" },
  { title: "Daftar Survei", url: "" },
  {
    title: "Evaluasi",
    url: "/evaluasi/carapenilaian",
    child: [
      { title: "Cara Penilaian", url: "/evaluasi/carapenilaian" },
      { title: "Kegiatan", url: "/evaluasi/kegiatan" },
      { title: "Nilai Mitra", url: "/" },
      { title: "Laporan", url: "/evaluasi/carapenilaian" },
    ],
  },
  { title: "Riwayat Daftar", url: "/riwayatdaftar" },
  { title: "Kartu Petugas", url: "" },
];

//progress bar example
const dataProgress = {
  steps: ["Step 1", "Step 2", "Step 3", "Step 4"],
  currentStep: 0,
  activeColor: "bg-green-600",
  passiveColor: "bg-green-400",
};
const step = ref<InstanceType<typeof StepProgress> | null>(null);

//Modal
const modal123 = ref<InstanceType<typeof ModalBase> | null>(null);
const successModal = ref(false);
const loadingModal = ref(false);
const errorModal = ref(false);

// WYSIWYG
const dataProperty = ref("");
</script>

<template>
 
  <TableRankAnnualList/>
  <section class="mb-6">
    {{ currentYear }} 
    <h5>Query gql example</h5>
    <ul v-if="data">
      <li v-for="(item, i) in data?.allKategori" :key="i">{{ item?.nama }}</li>
    </ul>
    <span v-else>Loading...</span>
  </section>
  <section>
    <p>WYSIWYG editor</p>
    <div class="bg-slate-50">
      <QuillEditor v-model:content="dataProperty" theme="snow" contentType="html"/>
    </div>
    <div class="content mt-3">
      {{ dataProperty }}
    </div>
    <div v-html="dataProperty" class="wysiwyg"></div>
  </section>
  <section class="border border-red-500">
    <h5>Multi step progress</h5>
    <StepProgress :dataMain="dataProgress" ref="step" />
    <div>
      <button @click="step?.previousStep()" class="px-3 py-2 bg-slate-300 rounded me-3">Previous Step</button>
      <button @click="step?.nextStep()" class="px-3 py-2 bg-slate-300 rounded me-3">Next Step</button>
    </div>
  </section>
  <section class="flex gap-x-3 justify-start">
    <ModalBase ref="modal123" />
    <BaseButtonMode mode="outlined" shape="square" @click="modal123?.open">Open Modal</BaseButtonMode>
    <ModalSuccess v-if="successModal" />
    <BaseButtonMode mode="normal" shape="square" @click.prevent="successModal = !successModal">Open Successs Modal</BaseButtonMode>
    <ModalLoading v-if="loadingModal" />
    <BaseButtonMode mode="outlined" shape="square" @click.prevent="loadingModal = !loadingModal">Open Loading Modal</BaseButtonMode>
    <ModalError v-if="errorModal" />
    <BaseButtonMode mode="normal" shape="square" @click.prevent="errorModal = !errorModal">Open Error Modal</BaseButtonMode>
  </section>
  <AppDropdownMobile :menu="menuMitra" :active="true" />
</template>

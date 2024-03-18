<script lang="ts" setup>
import type { StepProgress } from '#build/components';

definePageMeta({
  layout: "default",
});
const query = gql`
  query Query {
    allFilms {
      films {
        title
        director
        releaseDate
        speciesConnection {
          species {
            name
            classification
            homeworld {
              name
            }
          }
        }
      }
    }
  }
`;

const { data, loading, error } = await useAsyncQuery(query);
const dataColumn = [
  { label: "Title", field: "title" },
  { label: "Director", field: "director" },
];

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
}
const menuMitra = [
  { title: "Beranda", url: "/" },
  { title: "Daftar Survei", url: "" },
  {
    title: "Evaluasi",
    url: "/evaluasi/carapenilaian",
    child: [
      { title: "Cara Penilaian", url: "/evaluasi/carapenilaian" },
      { title: "Kegiatan", url: "/evaluasi/kegiatan" },
      { title: "Nilai Mitra", url: "/evaluasi/nilaimitra" },
      { title: "Laporan", url: "/evaluasi/carapenilaian" },
    ],
  },
  { title: "Riwayat Daftar", url: "/riwayatdaftar" },
  { title: "Kartu Petugas", url: "" },
];

const dataProgress = {
  steps: ["Step 1", "Step 2", "Step 3", "Step 4"],
  currentStep: 0,
  activeColor: "bg-green-600",
  passiveColor: "bg-green-400",
};
const step=ref<InstanceType<typeof StepProgress> | null>(null);
</script>

<template>
  <section class="mb-6">
    <h5>Query gql example</h5>
    <p>There are {{ data?.allFilms?.films?.length || 0 }} film.</p>
    <p>The type of the data is: {{ typeof data?.allFilms?.films }}</p>
    <vue-good-table :columns="dataColumn" :rows="dataFilms2" class="my-9" v-if="dataFilms2" />
    <span v-else>Loading...</span>
  </section>

  <section class="border border-red-500">
    <h5>Multi step progress</h5>
    <StepProgress :dataMain="dataProgress" ref="step" />
    <div>
      <button @click="step?.previousStep()" class="px-3 py-2 bg-slate-300 rounded me-3">Previous Step</button>
      <button @click="step?.nextStep()" class="px-3 py-2 bg-slate-300 rounded me-3">Next Step</button>
    </div>
  </section>
  <AppDropdownMobile :menu="menuMitra" :active="true" />
</template>

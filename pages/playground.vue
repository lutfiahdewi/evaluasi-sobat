<script lang="ts" setup>
definePageMeta({
  layout: 'default',
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
</script>

<template>
  <div class="px-6 sm:px-24 py-3 sm:py-12">
    <section class="px-3 sm:px-12 mb-6">
      <p>There are {{ data?.allFilms?.films?.length || 0 }} film.</p>
      <p>The type of the data is: {{ typeof data?.allFilms?.films }}</p>
      <vue-good-table :columns="dataColumn" :rows="dataFilms2" class="my-9" v-if="dataFilms2" />
      <span v-else>Loading...</span>
    </section>
    <AppDropdownMobile :menu="menuMitra" :active="true"/>
  </div>
</template>

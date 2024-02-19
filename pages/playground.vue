<script lang="ts" setup>
definePageMeta({
  layout: false,
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
</script>

<template>
  <AppNavbar/>
  <div class="px-24 py-12">
  <section class="px-12">
    <p>There are {{ data?.allFilms?.films?.length || 0 }} film.</p>
    <p>The type of the data is: {{ typeof data?.allFilms?.films }}</p>

    <vue-good-table :columns="dataColumn" :rows="dataFilms2" class="my-9" v-if="dataFilms2" />
    <span v-else>Loading...</span>
  </section>
</div>
</template>

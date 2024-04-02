<script setup lang="ts">
type indicatorQuery = {
  indikator_id: Number;
  nama: String;
  KategoriIndikator: {
    kategori : {
      kategori_id: String;
      nama: String;
    }
  }[];
}
type indikator = {
  id: Number;
  nama: String;
  kategori: String;
}
const columns = [
  {
    label: "Nama Indikator",
    field: "nama",
  },
  {
    label: "Kategori terkait",
    field: "kategori",
  },
  // {
  //   label: "Tanggal Modifikasi",
  //   field: "tanggal",
  //   type: "date",
  //   dateInputFormat: "yyyy-MM-dd",
  //   dateOutputFormat: "dd MMM yyyy",
  // },
  {
    label: "Aksi",
    field: "id",
  },
];

// Query data
let dataTable : indikator[] = []
try{
const { data, error, pending} = await useAsyncQuery(useTableIndicators());
const result = await computed(() => data.value?.allIndikatorNested);
(result.value).forEach((item: indicatorQuery) => {
    let temp = "";
    item.KategoriIndikator.forEach((ind) => {
      temp += ind.kategori.nama;
      if(useLast(item.KategoriIndikator) != ind){
        temp += ", ";
      }
    });
    dataTable.push({
      id: item.indikator_id,
      nama: item.nama,
      kategori: temp,
    });
  });
}catch(error){
  console.log(error)
}
</script>
<template>
  <vue-good-table
    :columns="columns"
    :rows="dataTable"
    :search-options="{
      enabled: true,
    }"
  >
    <template #table-row="props">
      <span v-if="props.column.field == 'id'" class="flex justify-evenly">
        <ButtonUpdate baseLink="/pengaturan/tambahIndikator/" :id="props.row.id" />
        <ButtonDelete baseLink="/pengaturan/tambahIndikator/" :id="props.row.id" />
      </span>
      <span v-else>
        {{ props.formattedRow[props.column.field] }}
      </span>
    </template>
  </vue-good-table>
</template>

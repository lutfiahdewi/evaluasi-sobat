<script setup lang="ts">
import { useTableCategories } from "#imports";
interface Kategori {
  id: Number;
  nama: String;
  indikator: String;
  definisi?: String;
}
interface indikator {
  indikator_id?: Number;
  nama: String;
}
interface KategoriIndikator {
  indikator_id: Number;
  no_urut: Number;
  indikator: indikator;
}
interface Item {
  kategori_id: Number;
  nama: String;
  KategoriIndikator: KategoriIndikator[];
}
// Kolom-kolom tabel
const columns = [
  {
    label: "Nama Kategori",
    field: "nama",
  },
  {
    label: "Daftar Indikator",
    field: "indikator",
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
// query data

let dataTable: Kategori[] = [];
try{
  const { data: result, loading, error, pending} = await useAsyncQuery(useTableCategories());
  const data = await computed(() => result.value?.allKategoriNested);
  (data.value).forEach((item: Item) => {
    let temp = "";
    item.KategoriIndikator.forEach((ind) => {
      temp += ind.indikator.nama;
      if(useLast(item.KategoriIndikator) != ind){
        temp += ", ";
      }
    });
    dataTable.push({
      id: item.kategori_id,
      nama: item.nama,
      indikator: temp,
    });
  });

/*
if (await result.value?.allKategoriNested) {
  /*for (let i = 0; i < data.value.length; i++) {
    let temp = "";
    data.value[i].KategoriIndikator.forEach((ind) => {
      temp += ind.indikator.nama + ", ";
    });
    console.log(data.value[i].nama);
    console.log(temp);
    dataTable.push({
      id: data.value[i].kategori_id,
      nama: data.value[i].nama,
      indikator: temp,
    });
  }
  const data2 : [] = data.value
  data2.forEach((item: Item) => {
    let temp = "";
    item.KategoriIndikator.forEach((ind) => {
      temp += ind.indikator.nama + ", ";
    });
    dataTable.push({
      id: item.kategori_id,
      nama: item.nama,
      indikator: temp,
    });
  });
}*/
}catch(error){
  console.log(error)
}

const rows = [
  { id: 112728, nama: "kategori 1", indikator: "indikator1, indikator2, indikator3", tanggal: "2020-01-12" },
  { id: 138934, nama: "kategori 2", indikator: "indikator1, indikator2, indikator3", tanggal: "2020-01-12" },
  { id: 298749, nama: "kategori 4", indikator: "indikator1, indikator2, indikator3...", tanggal: "2022-01-12" },
];

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
  <!-- {{ result }}
  <br />
  <br />
  <br />
  {{ data}}<br />
  <br />
  <br />
  {{ dataTable }}
  <button class="rounded-lg bg-red-200 p-3" @click="cek()">CEk</button>
  <br>
  <div v-if="!pending">{{ data[0]?.nama }}</div>
  <div v-if="loading">Still Loading...</div> -->
</template>

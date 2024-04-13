<script setup lang="ts">
import { useTableCategories, useDeleteKategori } from "~/composables/useQueries";
import { logErrorMessages } from "@vue/apollo-util";
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
const { data: result, error, pending } = await useAsyncQuery(useTableCategories());
try {
  const data = await computed(() => result.value?.allKategori);
  data.value.forEach((item: Item) => {
    let temp = "";
    item.KategoriIndikator.forEach((ind) => {
      temp += ind.indikator.nama;
      if (useLast(item.KategoriIndikator) != ind) {
        temp += ", ";
      }
    });
    dataTable.push({
      id: item.kategori_id,
      nama: item.nama,
      indikator: temp,
    });
  });
} catch (error) {
  console.log(error);
}

const rows = [{ id: 112728, nama: "kategori 1", indikator: "indikator1, indikator2, indikator3", tanggal: "2020-01-12" }];

// Update data

// delete data
const confirmationModal = ref(false);
const deleteKategoriNama = ref("");
let resolvePromise: (value: PromiseLike<boolean> | boolean) => void;
const { mutate: deleteKategori, onDone: resultDeleteKategori, onError: errorDeleteKategori } = useMutation(useDeleteKategori());
async function deleteData(id: string, nama: string): Promise<void> {
  deleteKategoriNama.value = nama;
  //modal konfirmasi
  confirmationModal.value = true;
  const confirmed = await isConfirmed();
  if (confirmed) {
    isDataLoading.value = true;
    confirmationModal.value = false;
    deleteKategori({ id: parseInt(id) });
    errorDeleteKategori((error) => {
      isDataLoading.value = false;
      logErrorMessages(error);
      isDataError.value = true;
      return;
    })
    resultDeleteKategori((result) => {
      isDataLoading.value = false;
      isDataSent.value = true;
      // reloadNuxtApp();
      refetch();
    });
  }
}

function isConfirmed() {
  return new Promise((resolve) => {
    resolvePromise = resolve;
  });
}

function handleUserInput(value: boolean) {
  if (!resolvePromise) return;
  resolvePromise(value);
  confirmationModal.value = false;
}

//MOdal
const isDataSent = ref(false);
const isDataLoading = ref(false);
const isDataError = ref(false);
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
        <ButtonUpdate baseLink="/pengaturan/ubahIndikator/" :id="props.row.id" />
        <ButtonDelete @click.prevent="deleteData(props.row.id, props.row.nama)" />
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
  <!-- Modal konfirmasi-->
  <ModalBase2 v-if="confirmationModal" @close="confirmationModal = !confirmationModal">
    <template #header><h5 class="font-bold text-gray-800">Hapus kategori penilaian?</h5></template>
    <template #body>
      <div class="grid place-content-center">
        <IconWarning class="justify-self-center h-24 w-24 text-slate-800" />
        <div class="text-center">Anda yakin akan menghapus kategori penilaian: {{ deleteKategoriNama }} ?</div>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-around">
        <BaseButtonMode shape="square" mode="outlined" @click="handleUserInput(false)" class="px-8">Batal</BaseButtonMode>
        <BaseButtonMode shape="square" mode="normal" @click="handleUserInput(true)" class="px-8">Hapus</BaseButtonMode>
      </div>
    </template>
  </ModalBase2>
  <!-- MOdal lain2 -->
  <ModalSuccess v-if="isDataSent" @close="isDataSent = !isDataSent" />
  <ModalLoading v-if="isDataLoading" @close="isDataLoading = !isDataLoading"/>
  <ModalError v-if="isDataError" @close="isDataError = !isDataError" />
</template>

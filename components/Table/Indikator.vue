<script setup lang="ts">
/**
 * Tabel daftar indikator, untuk mengupdate serta menghapus indikator
 * ROle: admin
 * Pages: kelolaIndikator
 */
import type { ModalBase } from "#build/components";
import { logErrorMessages } from "@vue/apollo-util";
type indicatorQuery = {
  branch_kd: string;
  indikator_id: number;
  nama: string;
  is_benefit: number;
  definisi: string;
  KategoriIndikator: {
    kategori: {
      kategori_id: string;
      nama: string;
    };
  }[];
};
type indikator = {
  id: number;
  branch_kd: string;
  nama: string;
  is_benefit: number;
  definisi: string;
  kategori: string;
};
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
let dataTable: indikator[] = [];
try {
  const { data, error, pending } = await useAsyncQuery(useTableIndicators());
  const result = await computed(() => data.value?.allIndikatorNested);
  result.value.forEach((item: indicatorQuery) => {
    let temp = "";
    item.KategoriIndikator.forEach((ind) => {
      temp += ind.kategori.nama;
      if (useLast(item.KategoriIndikator) != ind) {
        temp += ", ";
      }
    });
    dataTable.push({
      id: item.indikator_id,
      nama: item.nama,
      branch_kd: item.branch_kd,
      is_benefit: item.is_benefit,
      definisi: item.definisi,
      kategori: temp,
    });
  });
} catch (error) {
  console.log(error);
}

// Delete indikator
const deleteIndModal = ref<InstanceType<typeof ModalBase> | null>(null);
let resolvePromise: (value: PromiseLike<boolean> | boolean) => void;
async function deleteIndikator(id: number): Promise<void> {
  const confirmed = await isConfirmed();
  const { mutate: sendDeleteIndicator, onDone: resultDeleteIndicator, onError: errorDeleteIndicator } = useMutation(useDeleteIndicator());
  if (confirmed) {
    sendDeleteIndicator({ id });
    errorDeleteIndicator((error) => {
      logErrorMessages(error);
      isDataError.value = true;
      return;
    });
    resultDeleteIndicator(() => {
      reloadNuxtApp();
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
}

// update indikator
const updateIndModal = ref<InstanceType<typeof ModalBase> | null>(null);
const namaIndikatorValid = ref(true);
const benefitIndikatorValid = ref(true);
const currentIndikator:indikator = reactive({
  id: -1,
  branch_kd: '',
  nama: '',
  is_benefit: -1,
  definisi: '',
  kategori: '',
});
function openUpdateIndikator(matchObj: indikator) {
  // console.log(matchObj);
  currentIndikator.id = matchObj.id;
  currentIndikator.branch_kd = matchObj.branch_kd;
  currentIndikator.nama = matchObj.nama;
  currentIndikator.is_benefit = matchObj.is_benefit;
  currentIndikator.definisi = matchObj.definisi;
  currentIndikator.kategori = matchObj.kategori;
  // console.log(currentIndikator);
}
function updateIndikator(id: number) {
  // validation
  namaIndikatorValid.value = true;
  benefitIndikatorValid.value = true;
  if (currentIndikator.nama.length < 1) namaIndikatorValid.value = false;
  if (!currentIndikator.is_benefit) benefitIndikatorValid.value = false;
  if (!namaIndikatorValid.value || !benefitIndikatorValid.value) return false;
  // update to db
  const { mutate: sendUpdateIndicator, onDone: resultUpdateIndicator, onError: errorUpdateIndicator } = useMutation(useUpdateIndicator());
  sendUpdateIndicator({
    input: {
      branch_kd: currentIndikator.branch_kd,
      nama: currentIndikator.nama,
      is_benefit: currentIndikator.is_benefit.toString(),
      definisi: currentIndikator.definisi,
    },
    id: parseInt(id.toString()),
  });
  errorUpdateIndicator((error) => {
      logErrorMessages(error);
      isDataError.value = true;
      return;
    });
  resultUpdateIndicator(() => {
    reloadNuxtApp();
  });
}
// MODAL ERROR KETIKA GAGAL
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
        <ButtonUpdate
          @click.prevent="
            {
              updateIndModal?.open();
              openUpdateIndikator(props.row);
            }
          "
        />
        <ButtonDelete
          @click.prevent="
            {
              deleteIndModal?.open();
              deleteIndikator(parseInt(props.row.id));
            }
          "
        />
      </span>
      <span v-else>
        {{ props.formattedRow[props.column.field] }}
      </span>
    </template>
  </vue-good-table>
  <!-- Modal: hapus indikatopr -->
  <ModalBase ref="deleteIndModal">
    <template #header><h5 class="font-bold text-gray-800">Konfirmasi hapus indikator?</h5></template>
    <template #body>
      <div class="grid place-content-center">
        <IconWarning class="justify-self-center h-24 w-24 text-slate-800" />
        <div class="text-center">Anda yakin akan menghapus indikator ini beserta kategori terkait ?</div>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-around">
        <BaseButtonMode
          shape="square"
          mode="outlined"
          @click="
            {
              handleUserInput(false);
              deleteIndModal?.close();
            }
          "
          class="px-8"
          >Batal</BaseButtonMode
        >
        <BaseButtonMode
          shape="square"
          mode="normal"
          @click="
            {
              handleUserInput(true);
              deleteIndModal?.close();
            }
          "
          class="px-8"
          >Hapus</BaseButtonMode
        >
      </div>
    </template>
  </ModalBase>
  <!-- Modal: update indikator -->
  <ModalBase ref="updateIndModal" width="w-[900px] " maxHeight="max-h-96 2xl:max-h-[640px]">
    <template #header>
      <h5 class="font-bold">Modifikasi Indikator</h5>
    </template>
    <template #body>
      <form>
        <label for="nama" class="block font-medium mb-2">Nama Indikator</label>
        <input
          v-model="currentIndikator.nama"
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
            <input v-model="currentIndikator.is_benefit" type="radio" class="me-2 shrink-0 mt-0.5 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none" id="cost" value="0" />
            <label for="cost">Cost</label>
          </div>
          <div class="flex">
            <input v-model="currentIndikator.is_benefit" type="radio" class="me-2 shrink-0 mt-0.5 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none" id="benefit" value="1" />
            <label for="benefit">Benefit</label>
          </div>
        </div>
        <p class="text-red-500 mb-2" v-if="!benefitIndikatorValid">Pilih salah satu tipe indikator!</p>
        <label for="definsi" class="block font-medium my-2">Definisi Indikator</label>
        <div class="bg-slate-50">
          <QuillEditor v-model:content="currentIndikator.definisi" theme="snow" contentType="html" />
        </div>
      </form>
    </template>
    <template #footer>
      <div class="flex justify-end items-center gap-x-2">
        <BaseButtonMode shape="square" mode="outlined" @click.prevent="updateIndModal?.close()"> Batal </BaseButtonMode>
        <BaseButtonMode shape="square" mode="normal" @click.prevent="updateIndikator(currentIndikator.id)"> Ubah indikator </BaseButtonMode>
      </div>
    </template>
  </ModalBase>
  <!-- Error modal -->
  <ModalError v-if="isDataError" @close="isDataError = !isDataError" />
</template>

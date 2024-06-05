<script setup lang="ts">
import { logErrorMessages } from "@vue/apollo-util";
import { useCreateKategori, useCreateKategoriIndikator } from "~/composables/useQueries";
import { evaluate, round } from "mathjs";
import type { ModalBase } from "#build/components";
import { remove } from "lodash";
useSeoMeta({
  title: "Ubah Kategori",
});
interface indikator {
  kategoriIndikator_id?: number;
  indikator_id: number;
  nama: string;
  definisi?: string;
  is_benefit: number;
  perbandingan: string;
  no_urut: number;
  bobot: number;
}
// getting params from route
const route = useRoute();
//Modal
const createCatModal = ref<InstanceType<typeof ModalBase> | null>(null);
const isDataSent = ref(false);
const isDataLoading = ref(false);
const isDataError = ref(false);

// data form
// data kategori
const kategoriId = route.params.id;
const kategoriNama = ref("");
const kategoriDefinisi = ref("");
const { data: resKategori } = await useAsyncQuery(useGetKategori(), { id: !isArray(kategoriId) ? parseInt(kategoriId) : 0 });
const dataKategori = resKategori.value?.Kategori;

// indikator pada kategori terkait
const chosenIndicator: indikator[] = reactive([]);
try {
  kategoriNama.value = dataKategori.nama;
  kategoriDefinisi.value = dataKategori.definisi;
  const tempArr: indikator[] = [];
  dataKategori.KategoriIndikator.forEach((element: { kategoriIndikator_id: number | undefined; indikator_id: any; indikator: { is_benefit: any; nama: any; definisi: any }; perbandingan: any; no_urut: any; bobot: any }) => {
    const tempObj: indikator = {
      kategoriIndikator_id: element.kategoriIndikator_id,
      indikator_id: element.indikator_id,
      nama: element.indikator.nama,
      definisi: element.indikator.definisi,
      is_benefit: element.indikator.is_benefit,
      perbandingan: element.perbandingan,
      no_urut: element.no_urut,
      bobot: element.bobot,
    };
    tempArr.push(tempObj);
  });
  chosenIndicator.push(...useSortBy(tempArr, ["no_urut"]));
} catch (e) {
  console.log(e);
  // throw new Error("Gagal mendapatkan informasi kategori terkait.");
}

// query semua indikator
const { data, error, pending } = await useAsyncQuery(useGetIndicators());
const dataIndikator: any[] = data.value ? data.value.indikator : undefined;
const options: any[] = reactive([]);
try {
  options.push(...dataIndikator.map((ind: { nama: any; indikator_id: any }) => ({ label: ind.nama, indikator_id: ind.indikator_id })));
} catch (e) {
  console.log(e);
}
usePullAllBy(options, chosenIndicator, "indikator_id");

// tambah indikator
const selected = ref([]);
function addIndicator() {
  usePullAllBy(options, selected.value, "indikator_id");
  let temp: indikator[] = useIntersectionBy(dataIndikator, selected.value, "indikator_id");
  try {
    temp.forEach((item, idx) => {
      const tempObj = Object.assign({}, item);
      Object.assign(tempObj, { no_urut: chosenIndicator.length + 1, perbandingan: "", bobot: undefined });
      chosenIndicator.push(tempObj);
    });
  } catch (e) {
    console.log(e);
  }
  selected.value = [];
  makeMatrices();
}
function removeIndicator(obj: indikator) {
  const matchIdx = useFindIndex(chosenIndicator, { indikator_id: obj.indikator_id });
  usePullAllBy(chosenIndicator, [obj], "indikator_id");
  for (let i = matchIdx; i < chosenIndicator.length; i++) {
    chosenIndicator[i].no_urut--;
  }
  options.push({ label: obj.nama, indikator_id: obj.indikator_id });
  makeMatrices(matchIdx);
}

// tabel indikator
const columns = [
  {
    label: "No",
    field: "no_urut",
  },
  {
    label: "Nama Indikator",
    field: "nama",
  },
  {
    label: "Tipe Benefit",
    field: "is_benefit",
  },
  {
    label: "Definisi",
    field: "definisi",
  },
  {
    label: "Aksi",
    field: "aksi",
  },
];

// generate matriks perbandingan
const mat_weight: string[][] = reactive([]);
function makeMatrices(removedIdx?: number) {
  const n = chosenIndicator.length; //byk indikator
  const p = mat_weight.length; // ordo mat
  // (n-p) >= 1 : proses penambahan indikator bisa >1, (p-n) = 1 hapus hny bisa 1 per1
  if (p === 0) {
    mat_weight.push(...Array.from(Array(n), () => new Array(n).fill("")));
    for (let i = 0; i < n; i++) {
      const tempPerbandingan = useSplit(chosenIndicator[i].perbandingan, ";");
      for (let j = 0; j < n; j++) {
        mat_weight[i][j] = tempPerbandingan[j];
      }
    }
  } else if (n > p) {
    const diff = n - p;
    mat_weight.forEach((row) => {
      row.push(...new Array(diff).fill(""));
    });
    mat_weight.push(...Array.from(Array(diff), () => new Array(n).fill("")));
  } else if (n < p && !isUndefined(removedIdx)) {
    mat_weight.splice(removedIdx, 1);
    mat_weight.forEach((row) => {
      row.splice(removedIdx, 1);
    });
  }
  ahp.CR = -1; //resetting ahp
}

function generate() {
  let tempValid: boolean = true;
  for (let i = 0; i < mat_weight.length; i++) {
    for (let j = 0; j <= i; j++) {
      if (i === j) {
        mat_weight[j][i] = "1";
        break;
      }

      if (mat_weight[j][i] == null || mat_weight[j][i] == undefined || mat_weight[j][i] == "") {
        tempValid = false;
        continue;
      }
      const temp: number = round(evaluate(mat_weight[j][i]), 3);
      const temp2: number = round(1 / evaluate(mat_weight[j][i]), 3);
      mat_weight[i][j] = temp2.toString();
      mat_weight[j][i] = temp.toString();
      if (temp < 0 || temp > 9.01 || temp2 < 0 || temp2 > 9.01) {
        tempValid = false;
      } else if (temp >= 0.0 && temp <= 1.0 && (temp2 < 1.0 || temp2 > 9.01)) {
        tempValid = false;
      } else if (temp2 >= 0 && temp2 <= 1 && (temp < 1 || temp > 9.01)) {
        tempValid = false;
      }
    }
  }
  if (tempValid) {
    isMatricesValid.value = true;
    addPerbandingan();
    runAhp();
  } else {
    isMatricesValid.value = false;
  }
}
function addPerbandingan() {
  for (let i = 0; i < mat_weight.length; i++) {
    chosenIndicator[i].perbandingan = "";
    for (let j = 0; j < mat_weight[i].length; j++) {
      chosenIndicator[i].perbandingan += mat_weight[i][j] + ";";
    }
  }
}
function runAhp() {
  if (chosenIndicator.length > 2) {
    const { isConsistent, CR, weight } = useAhp(mat_weight);
    ahp.isConsistent = isConsistent;
    ahp.CR = CR;
    ahp.weight = weight;
  } else {
    const { weight } = useAhp(mat_weight);
    ahp.isConsistent = true;
    ahp.CR = 0;
    ahp.weight = weight;
  }
}
// validasi
const isValid = ref(false);
const isMatricesValid = ref(true);
const ahp: {
  isConsistent: boolean;
  CR: number;
  weight: number[];
} = reactive({
  isConsistent: true,
  CR: -1,
  weight: [],
});
function checkForm(): boolean {
  if (!kategoriNama.value || !kategoriDefinisi.value) {
    isValid.value = false;
    return false;
  } else if (kategoriDefinisi.value.length > 0) {
    const temp = removeTags(kategoriDefinisi.value);
    if (temp.length < 1) {
      isValid.value = false;
      return false;
    }
  } else if (mat_weight.length > 0) {
    mat_weight.forEach((row) => {
      row.forEach((item) => {
        if (item.length < 1) {
          isValid.value = false;
          return false;
        }
      });
    });
  }
  isValid.value = true;
  return true;
}
function removeTags(str: string) {
  return str.replace(/(<([^>]+)>)/gi, "");
}

const runChecking = computed(() => {
  return checkForm();
});

// Update data: update kategori (+indikatorKategori terkait
/**
 * 1. Jumlah indikator tetap
 * 2. Jumlah indikator bertambah
 * 3. Jumlah indikator berkurang
 */
const branch_kd = "0123ABC";
//update kategori
const {
  mutate: sendKategori,
  onDone: resultKategori,
  onError: errorKategori,
} = useMutation(useUpdateKategori(), () => ({
  variables: {
    input: {
      nama: useCapitalize(kategoriNama.value),
      definisi: kategoriDefinisi.value,
    },
    id: !isArray(kategoriId) ? parseInt(kategoriId) : 0,
  },
}));
// FOR CREATE NEW indikator (indikator.length (new) > indikator.length (old))
const { mutate: sendKategoriIndikator, onDone: resultKategoriIndikator, onError: errorKategoriIndikator } = useMutation(useCreateKategoriIndikator());
// UPDATE indikator
const { mutate: sendUpdateKategoriIndikator, onDone: resultUpdateKategoriIndikator, onError: errorUpdateKategoriIndikator } = useMutation(useUpdateKategoriIndikator());
// DELETE indikator
const { mutate: sendDeleteKategoriIndikator, onDone: resultDeleteKategoriIndikator, onError: errorDeleteKategoriIndikator } = useMutation(useDeleteKategoriIndikator());
async function sendData() {
  // update kategori
  isDataLoading.value = true;
  const kategoriResult = await sendKategori();
  errorKategori((error) => {
    logErrorMessages(error);
    isDataLoading.value = false;
    isDataError.value = true;
    return;
  });
  const n = chosenIndicator.length; //byk indikator
  const oldN = dataKategori.KategoriIndikator.length;
  const diff = oldN - n;
  if (kategoriResult) {
    // proses update/create
    chosenIndicator.forEach((item, idx) => {
      if (idx < oldN) {
        sendUpdateKategoriIndikator({
          input: {
            branch_kd,
            indikator_id: item.indikator_id.toString(),
            kategori_id: kategoriId,
            bobot: ahp.weight[idx],
            no_urut: item.no_urut,
            perbandingan: item.perbandingan,
          },
          id: parseInt(dataKategori.KategoriIndikator[idx].kategoriIndikator_id),
        });
        errorUpdateKategoriIndikator((error) => {
          logErrorMessages(error);
          isDataLoading.value = false;
          isDataError.value = true;
          return;
        });
        resultUpdateKategoriIndikator(() => {
          if (idx == n - 1 && diff == 0) {
            isDataLoading.value = false;
            isDataSent.value = true;
            reloadNuxtApp();
          }
        });
      } else {
        sendKategoriIndikator({
          input: {
            branch_kd,
            indikator_id: item.indikator_id.toString(),
            kategori_id: kategoriId,
            bobot: ahp.weight[idx],
            no_urut: item.no_urut,
            perbandingan: item.perbandingan,
          },
        });
        errorKategoriIndikator((error) => {
          logErrorMessages(error);
          isDataLoading.value = false;
          isDataError.value = true;
          return;
        });
        resultKategoriIndikator(() => {
          if (idx === n - 1 && diff < 0) {
            isDataLoading.value = false;
            isDataSent.value = true;
            reloadNuxtApp();
          }
        });
      }
    });
    // proses delete
    if (diff > 0) {
      for (let i = 0; i < diff; i++) {
        const idx = oldN - i - 1;
        sendDeleteKategoriIndikator({ id: parseInt(dataKategori.KategoriIndikator[idx].kategoriIndikator_id) });
        errorDeleteKategoriIndikator((error) => {
          logErrorMessages(error);
          isDataLoading.value = false;
          isDataError.value = true;
          return;
        });
        resultDeleteKategoriIndikator(() => {
          if (i === diff - 1) {
            isDataLoading.value = false;
            isDataSent.value = true;
            reloadNuxtApp();
          }
        });
      }
    }
  } else {
    throw new Error("Gagal mengubah kategori!");
  }
}

// called func
makeMatrices();
</script>

<template>
  <h3 class="font-bold mb-3">Ubah Kategori Penilaian</h3>
  <!-- Kategori Form -->
  <section>
    <div class="grid grid-cols-2 gap-8">
      <div class="col-span-2">
        <label for="category-label" class="block font-medium mb-2">Nama Kategori</label>
        <input
          type="text"
          v-model="kategoriNama"
          id="category-label"
          class="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
          placeholder="Isikan nama kategori indikator"
        />
      </div>
      <div class="col-span-2">
        <label for="textarea-label" class="block font-medium mb-2">Konsep dan Definisi</label>
        <div class="bg-slate-50 border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none" id="textarea-label">
          <QuillEditor placeholder="Penjelasan mengenai kategori indikator" v-model:content="kategoriDefinisi" theme="snow" contentType="html" />
        </div>
      </div>
    </div>
  </section>
  <!-- Daftar Indikator -->
  <section>
    <h5 class="mb-3">Daftar Indikator</h5>
    <div class="grid grid-cols-2 gap-x-8">
      <div class="bg-slate-50 rounded">
        <v-select id="opsi" multiple v-model="selected" :options="options" placeholder="Pilih Indikator"></v-select>
      </div>
      <div>
        <BaseButtonMode shape="square" mode="normal" :not-active="selected.length < 1" @click="addIndicator()"> <IconAdd class="h-4 w-4 me-1 inline" /> Tambah Indikator </BaseButtonMode>
      </div>
      <div class="col-span-2">
        <div class="indicators-table mt-6">
          <vue-good-table
            :columns="columns"
            :rows="chosenIndicator"
            :sort-options="{
              enabled: true,
              initialSortBy: { field: 'no_urut', type: 'asc' },
            }"
          >
            <template #table-row="props">
              <span v-if="props.column.field == 'is_benefit'">
                {{ props.row.is_benefit ? "Ya" : "Tidak" }}
              </span>
              <span v-else-if="props.column.field == 'definisi'">
                <div v-html="props.row.definisi" class="wysiwyg line-clamp-3" :title="props.row.definisi"></div>
              </span>
              <span v-else-if="props.column.field == 'aksi'">
                <div class="flex justify-center">
                  <BaseButtonMode shape="square" mode="gray" class="" @click="removeIndicator(props.row)">Hapus</BaseButtonMode>
                </div>
              </span>
              <span v-else>
                {{ props.formattedRow[props.column.field] }}
              </span>
            </template>
          </vue-good-table>
        </div>
      </div>
    </div>
  </section>
  <!-- Matriks Perbandingan-->
  <section>
    <h5 class="mb-3">Matriks Perbandingan</h5>
    <div v-if="mat_weight.length > 0" v-for="(item, i) in mat_weight" :key="i">
      <div v-if="i == 0" class="grid grid-flow-col auto-cols-max gap-4 mb-4">
        <div class="w-24"></div>
        <div v-for="(item, j) in mat_weight[i]" :key="j" class="w-24 truncate">{{ j < chosenIndicator.length ? chosenIndicator[j].nama : "" }}</div>
      </div>
      <div class="grid grid-flow-col auto-cols-max gap-4 mb-4">
        <div class="w-24 truncate">{{ i < chosenIndicator.length ? chosenIndicator[i].nama : "" }}</div>
        <input
          v-for="(item, j) in mat_weight[i]"
          v-model="mat_weight[i][j]"
          :key="j"
          :disabled="j <= i"
          @keyup.enter="generate()"
          type="text"
          class="w-24 border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
        />
      </div>
    </div>
    <BaseButtonMode v-if="mat_weight.length > 0" shape="square" mode="outlined" class="me-3 font-semibold" @click.prevent="generate()">Cek Konsistensi</BaseButtonMode>
    <div class="my-3 p-3 flex item-center text-red-600 border rounded-lg" v-if="!isMatricesValid"><IconWarning class="w-6 h-6 me-2" />Pastikan skala yang dimasukkan antara 1-9</div>
    <div class="my-3 p-3 flex item-center text-red-600 border rounded-lg" v-if="!ahp.isConsistent && isMatricesValid">
      <IconWarning class="w-6 h-6 me-2" />Rasio konsistensi = {{ round(ahp.CR, 3) }}, pastikan perbandingan yang dimasukkan konsisten
    </div>
    <div class="my-3 p-3 flex item-center border rounded-lg" v-if="ahp.isConsistent && ahp.CR != -1">Rasio konsistensi = {{ round(ahp.CR, 3) }} menunjukkan perbandingan konsisten</div>
  </section>
  <!-- Validasi -->
  <div class="my-3 p-3 flex item-center text-red-600 border rounded-lg" v-if="!isValid || !ahp.isConsistent || !isMatricesValid || chosenIndicator.length < 1 || ahp.CR == -1">
    <IconWarning class="w-6 h-6 me-2" />Pastikan form telah terisi semua dan perbandingan konsisten!
  </div>
  <div class="flex justify-end">
    <ModalBase ref="createCatModal">
      <template #header><h6 class="font-bold text-gray-800">Ubah kategori penilaian</h6></template>
      <template #body>
        <div class="mt-1 text-gray-800">
          <h6>Kategori : {{ kategoriNama }}</h6>
          <p>Daftar indikator dan bobotnya</p>
          <table>
            <tr v-for="(item, idx) in chosenIndicator">
              <td>{{ idx + 1 }}.</td>
              <td>{{ item.nama }}</td>
              <td>: {{ round(ahp.weight[idx], 3) }}</td>
            </tr>
          </table>
        </div>
        <div class="my-3 flex item-center text-red-600" v-if="!isValid"><IconWarning class="w-6 h-6 me-2" />Pastikan form telah terisi semua!</div>
        <div class="my-3 flex item-center text-red-600" v-if="!isMatricesValid"><IconWarning class="w-6 h-6 me-2" />Pastikan skala yang dimasukkan antara 1-9 pada matriks perbandingan</div>
      </template>
      <template #footer-button>
        <BaseButtonMode shape="square" mode="normal" @click.prevent="sendData()" :not-active="!isValid || !isMatricesValid">Konfirmasi</BaseButtonMode>
      </template>
    </ModalBase>
    <NuxtLink to="/pengaturan/kelolaIndikator">
      <BaseButtonMode shape="square" mode="outlined" class="me-3 font-semibold" :data-valid="runChecking">Batal</BaseButtonMode>
    </NuxtLink>
    <BaseButtonMode
      shape="square"
      mode="normal"
      @click.prevent="
        {
          createCatModal?.open();
          generate();
        }
      "
      :not-active="!isValid || !isMatricesValid || !ahp.isConsistent || chosenIndicator.length < 1 || ahp.CR == -1"
      >Ubah Kategori</BaseButtonMode
    >
  </div>

  <ModalSuccess v-if="isDataSent" @close="isDataSent = !isDataSent" />
  <ModalLoading v-if="isDataLoading" @close="isDataLoading = !isDataLoading" />
  <ModalError v-if="isDataError" @close="isDataError = !isDataError" />
</template>

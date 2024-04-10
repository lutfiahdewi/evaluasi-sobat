<script setup lang="ts">
import { logErrorMessages } from "@vue/apollo-util";
import { useCreateKategori, useCreateIndikatorNested } from "~/composables/useQueries";
import { evaluate, round } from "mathjs";
import type { ModalBase } from "#build/components";
useSeoMeta({
  title: "Tambah Indikator",
});
interface indicator {
  id?: number;
  nama: string;
  definisi: string | number | readonly string[] | null | undefined;
  isBenefit?: number;
  perbandingan: string;
  no_urut: number;
  bobot?: number;
}

// initialization
const count = useState<string>("indicators");
if (count.value == undefined) {
  count.value = "4";
}
const arr_indicators: indicator[] = reactive(new Array(parseInt(count.value)));
const mat_weight: string[][] = reactive(Array.from(Array(parseInt(count.value)), () => new Array(parseInt(count.value)).fill("")));
console.log("n matriks: " + mat_weight.length + ", indicators (count): " + count.value);
//Modal
const createCatModal = ref<InstanceType<typeof ModalBase> | null>(null);
const isDataSent = ref(false);
const isDataLoading = ref(false);
const isDataError = ref(false);

// data form
const kategoriId: Ref<number | undefined> = ref();
const kategoriNama = ref("umum");
const kategoriDefinisi = ref("definsi");
for (let i = 0; i < parseInt(count.value); i++) {
  arr_indicators[i] = {
    nama: "indikator " + i,
    definisi: "definisi" + i,
    perbandingan: "",
    isBenefit: undefined,
    no_urut: i,
    bobot: undefined,
  };
  for (let j = 0; j < parseInt(count.value); j++) {
    if (j == i) {
      mat_weight[i][j] = "1";
    }
  }
}

// generate matriks perbandingan
function generate() {
  let tempValid: boolean = true;
  for (let i = 0; i < mat_weight.length; i++) {
    for (let j = 0; j < i; j++) {
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
    arr_indicators[i].perbandingan = "";
    for (let j = 0; j < mat_weight[i].length; j++) {
      arr_indicators[i].perbandingan += mat_weight[i][j] + ";";
    }
  }
}
function runAhp() {
  if (parseInt(count.value) > 2) {
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
  for (const item of arr_indicators) {
    if (!item.nama || !item.definisi || !item.perbandingan || !item.isBenefit) {
      isValid.value = false;
      return false;
    }
  }
  if (!kategoriNama.value || !kategoriDefinisi.value) {
    isValid.value = false;
    return false;
  } else {
    isValid.value = true;
    return true;
  }
}
const runChecking = computed(() => {
  return checkForm();
});

// send data
const {
  mutate: sendKategori,
  onDone: resultKategori,
  onError: errorKategori,
} = useMutation(useCreateKategori(), () => ({
  variables: {
    input: {
      nama: useCapitalize(kategoriNama.value),
      definisi: kategoriDefinisi.value,
    },
  },
}));
const { mutate: sendIndikatorNested, onDone: resultIndikatorNested, onError: errorIndikatorNested, loading: loadingIndikatorNested } = useMutation(useCreateIndikatorNested());
const branch_kd = "000abc";
function sendData() {
  //Show loading modal
  isDataLoading.value = true;
  sendKategori();
  errorKategori((error) => {
    logErrorMessages(error);
    isDataLoading.value = false;
    isDataError.value = true;
    return;
  });
  resultKategori(async (result) => {
    console.log("kategori sent!");
    kategoriId.value = await result.data?.createKategori?.kategori_id;
    arr_indicators.forEach((ind) => {
      sendIndikatorNested({
        input: {
          branch_kd,
          kategori_id: kategoriId.value?.toString(),
          nama: useCapitalize(ind.nama),
          is_benefit: ind.isBenefit,
          definisi: ind.definisi,
          perbandingan: ind.perbandingan,
          bobot: ahp.weight[ind.no_urut],
          no_urut: ind.no_urut,
        },
      });
      // loading.value === false;
      resultIndikatorNested((result) => {
        console.log("indikator sent!");
        const res = result.data;
        console.log(res);
        ind.id = res?.createIndikatorNested?.indikator_id;
      });
      errorIndikatorNested((error) => {
        logErrorMessages(error);
        isDataLoading.value = false;
        isDataError.value = true;
        return;
      });
    });
    isDataSent.value = true;
    isDataLoading.value = false;
    const temp = await resolveAfter3s();
    console.log(temp);
    await reloadNuxtApp({ path: "/pengaturan/kelolaIndikator" });
    isDataSent.value = false;

    /*let tempValid;
    await arr_indicators.forEach((ind) => {
      console.log(ind.id);
      if (ind.id == null || ind.id == undefined || ind.id === 0) {
        tempValid = false;
      }
    });
    if (tempValid==null || tempValid == undefined) {
      //close loading modal
      console.log("temp valid: ", tempValid);
      isDataSent.value = true;
      reloadNuxtApp({ path: "/pengaturan/kelolaIndikator" });
    }*/
  });
}

function resolveAfter3s() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("resolved");
    }, 3000);
  });
}
</script>

<template>
  <h3 class="font-bold mb-3">Buat Indikator Penilaian</h3>
  <form>
    <!-- Kategori Form -->
    <section>
      <div class="grid grid-cols-2 gap-8">
        <div>
          <label for="category-label" class="block font-medium mb-2">Nama Kategori</label>
          <input
            type="text"
            v-model="kategoriNama"
            id="category-label"
            class="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
            placeholder="Isikan nama kategori indikator"
          />
        </div>
        <div>
          <label for="weight-label" class="block font-medium mb-2">Jumlah Indikator</label>
          <select v-model="count" id="weight-label" class="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none" disabled>
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
        </div>
        <div class="col-span-2">
          <label for="textarea-label" class="block font-medium mb-2">Konsep dan Definisi</label>
          <textarea
            v-model="kategoriDefinisi"
            id="textarea-label"
            class="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
            rows="4"
            placeholder="Penjelasan mengenai kategori indikator"
          ></textarea>
        </div>
      </div>
    </section>
    <!-- Indikator Form -->
    <section v-for="(item, i) in arr_indicators" :key="i">
      <div class="grid grid-cols-2 gap-8">
        <div>
          <label :for="'name-label' + i" class="block font-medium mb-2">Nama Indikator {{ i + 1 }}</label>
          <input
            type="text"
            v-model="arr_indicators[i].nama"
            :id="'name-label' + i"
            class="mb-3 py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
            :placeholder="'Nama indikator ' + (i + 1)"
          />
        </div>
        <div>
          <label :id="'tipe-label' + 1" class="block font-medium mb-2">Tipe Indikator</label>
          <div class="grid grid-cols-2 content-center">
            <div class="flex pt-2">
              <input
                v-model="arr_indicators[i].isBenefit"
                type="radio"
                class="me-2 shrink-0 mt-0.5 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                :id="'cost' + i"
                value="0"
              />
              <label :for="'cost' + i">Cost</label>
            </div>
            <div class="flex pt-2">
              <input
                v-model="arr_indicators[i].isBenefit"
                type="radio"
                class="me-2 shrink-0 mt-0.5 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                :id="'benefit' + i"
                value="1"
              />
              <label :for="'benefit' + i">Benefit</label>
            </div>
          </div>
        </div>
        <div class="col-span-2">
          <label :for="'textarea-label' + i" class="block font-medium mb-2">Konsep dan Definisi</label>
          <textarea
            v-model="arr_indicators[i].definisi"
            :id="'textarea-label' + i"
            class="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
            rows="3"
            :placeholder="'Penjelasan mengenai indikator ' + (i + 1)"
          ></textarea>
        </div>
      </div>
    </section>
    <!-- Matriks -->
    <section>
      <h5 class="mb-3">Matriks Perbandingan</h5>
      <div v-for="(item, i) in mat_weight" :key="i">
        <div v-if="i == 0" class="grid grid-flow-col auto-cols-max gap-4 mb-4">
          <div class="min-w-24"></div>
          <div v-for="(item, j) in mat_weight[i]" :key="j" class="min-w-24">Indikator {{ j + 1 }}</div>
        </div>
        <div class="grid grid-flow-col auto-cols-max gap-4 mb-4">
          <div class="min-w-24">Indikator {{ i + 1 }}</div>
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
      <BaseButtonMode shape="square" mode="outlined" class="me-3 font-semibold" @click.prevent="generate()">Cek Konsistensi</BaseButtonMode>
      <div class="my-3 p-3 flex item-center text-red-600 border rounded-lg" v-if="!isMatricesValid"><IconWarning class="w-6 h-6 me-2" />Pastikan skala yang dimasukkan antara 1-9</div>
      <div class="my-3 p-3 flex item-center text-red-600 border rounded-lg" v-if="!ahp.isConsistent && isMatricesValid"><IconWarning class="w-6 h-6 me-2" />CR = {{ ahp.CR }}, pastikan perbandingan yang dimasukkan konsisten</div>
      <div class="my-3 p-3 flex item-center border rounded-lg" v-if="ahp.isConsistent && ahp.CR != -1">CR = {{ ahp.CR }} menunjukkan perbandingan konsisten</div>
    </section>
    <!-- Validasi -->
    <div class="my-3 p-3 flex item-center text-red-600 border rounded-lg" v-if="!isValid"><IconWarning class="w-6 h-6 me-2" />Pastikan form telah terisi semua!</div>
    <div class="flex justify-end">
      <ModalBase ref="createCatModal">
        <template #header><h6 class="font-bold text-gray-800">Buat kategori penilaian</h6></template>
        <template #body>
          <div class="mt-1 text-gray-800">
            <h6>Kategori : {{ kategoriNama }}</h6>
            <p>Daftar indikator</p>
            <ol class="list-decimal ps-5">
              <li v-for="(item, i) in arr_indicators">{{ arr_indicators[i].nama }}</li>
            </ol>
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
      <BaseButtonMode shape="square" mode="normal" @click.prevent="createCatModal?.open()" :not-active="!isValid || !isMatricesValid || !ahp.isConsistent">Buat Indikator</BaseButtonMode>
      <BaseButtonMode shape="square" mode="normal" @click.prevent="isDataSent = !isDataSent">Toggle</BaseButtonMode>
    </div>
  </form>

  <ModalSuccess v-if="isDataSent" @close="isDataSent = !isDataSent" />
  <ModalLoading v-if="isDataLoading" @close="isDataLoading = !isDataLoading" />
  <ModalError v-if="isDataError" @close="isDataError = !isDataError" />
</template>

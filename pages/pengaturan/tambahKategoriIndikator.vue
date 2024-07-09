<script setup lang="ts">
import { logErrorMessages } from "@vue/apollo-util";
import { useCreateKategori, useCreateIndikatorNested } from "~/composables/useQueries";
import { evaluate, round } from "mathjs";
import type { ModalBase } from "#build/components";
useSeoMeta({
  title: "Tambah Kategori Indikator",
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
const count = useState<string>("indicators"); //jumlah indikator yang telah dipilih
if(isNil(count.value)){
  reloadNuxtApp({path: "/pengaturan/kelolaIndikator"})
}
console.log(count.value);
const arr_indicators: indicator[] = reactive([]);
const mat_weight: string[][] = reactive([]);
try{
  arr_indicators.push(...new Array(parseInt(count.value)));
  mat_weight.push(...Array.from(Array(parseInt(count.value)), () => new Array(parseInt(count.value)).fill("")))
}catch(e){
  console.log(e)
}
// console.log("n matriks: " + mat_weight.length + ", indicators (count): " + count.value);
//Modal
const createCatModal = ref<InstanceType<typeof ModalBase> | null>(null);
const isDataSent = ref(false);
const isDataLoading = ref(false);
const isDataError = ref(false);

// data form
const kategoriId: Ref<number | undefined> = ref();
const kategoriNama = ref("");
const kategoriDefinisi = ref("");
for (let i = 0; i < parseInt(count.value); i++) {
  arr_indicators[i] = {
    nama: '',
    definisi: '',
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
const branch_kd = "0123ABC";
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
      errorIndikatorNested((error) => {
        logErrorMessages(error);
        isDataLoading.value = false;
        isDataError.value = true;
        return;
      });
      // loading.value === false;
      resultIndikatorNested(async (result) => {
        console.log("indikator sent!");
        const res = result.data;
        console.log(res);
        ind.id = res?.createIndikatorNested?.indikator_id;
        isDataSent.value = true;
        isDataLoading.value = false;
        const temp = await useWaitS(2);
        if (temp) {
          isDataSent.value = false;
          reloadNuxtApp({ path: "/pengaturan/kelolaIndikator" });
        }
      });
    });
  });
}
</script>

<template>
  <h3 class="font-bold mb-3">Buat Kategori-Indikator Penilaian</h3>
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
          <label for="count-label" class="block font-medium mb-2">Jumlah Indikator</label>
          <input v-model="count" id="count-label" class="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none" disabled>
          </input>
        </div>
        <div class="col-span-2">
          <label for="textarea-label" class="block font-medium mb-2">Konsep dan Definisi</label>
          <div class="bg-slate-50 border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none" id="textarea-label">
            <QuillEditor placeholder="Penjelasan mengenai kategori indikator"  v-model:content="kategoriDefinisi" theme="snow" contentType="html" />
        </div>
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
          <label :id="'tipe-label' + i" class="block font-medium mb-2">Tipe Indikator</label>
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
          <div class="bg-slate-50 border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none" id="textarea-label">
          <QuillEditor :placeholder="'Penjelasan mengenai indikator ' + (i + 1)" v-model:content="arr_indicators[i].definisi" theme="snow" contentType="html" />
        </div>
        </div>
      </div>
    </section>
    <!-- Matriks Perbandingan-->
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
      <!-- <table v-if="mat_weight.length > 0">
      <tr >
        <td></td>
        <td v-for="(item, j) in chosenIndicator" :key="j" class="w-28 pb-3 align-bottom">{{ item.nama }}</td>
      </tr>
      <tr v-for="(item, i) in mat_weight" :key="i">
        <td class="w-min-24 w-max-32 pb-3 pe-3">{{ i < chosenIndicator.length ? chosenIndicator[i].nama : "" }}</td>
        <td v-for="(item, j) in mat_weight[i]" class="pb-3">
          <input
          v-model="mat_weight[i][j]"
          :key="j"
          :disabled="j <= i"
          @keyup.enter="generate()"
          type="text"
          class="w-24 border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
        />
        </td>
      </tr>
    </table> -->
      <BaseButtonMode shape="square" mode="outlined" class="me-3 font-semibold" @click.prevent="generate()">Cek Konsistensi</BaseButtonMode>
      <div class="my-3 p-3 flex item-center text-red-600 border rounded-lg" v-if="!isMatricesValid"><IconWarning class="w-6 h-6 me-2" />Pastikan skala yang dimasukkan antara 1-9 atau kebalikan dari 1-9</div>
      <div class="my-3 p-3 flex item-center text-red-600 border rounded-lg" v-if="!ahp.isConsistent && isMatricesValid">
        <IconWarning class="w-6 h-6 me-2" />Rasio konsistensi = {{ round(ahp.CR, 3) }}, pastikan perbandingan yang dimasukkan konsisten
      </div>
      <div class="my-3 p-3 flex item-center border rounded-lg" v-if="ahp.isConsistent && ahp.CR != -1">Rasio konsistensi = {{ round(ahp.CR, 3) }} menunjukkan perbandingan konsisten</div>
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
            <table>
              <tr v-for="(item, idx) in arr_indicators">
                <td>{{ idx + 1 }}.</td>
                <td>{{ item.nama }}</td>
                <td>: {{ round(ahp.weight[idx], 3) }}</td>
              </tr>
            </table>
          </div>
          <div class="my-3 flex item-center text-red-600" v-if="!isValid"><IconWarning class="w-6 h-6 me-2" />Pastikan form telah terisi semua!</div>
          <div class="my-3 flex item-center text-red-600" v-if="!isMatricesValid"><IconWarning class="w-6 h-6 me-2" />Pastikan skala yang dimasukkan antara 1-9 atau kebalikan dari 1-9 pada matriks perbandingan</div>
        </template>
        <template #footer-button>
          <BaseButtonMode shape="square" mode="normal" @click.prevent="sendData()" :not-active="!isValid || !isMatricesValid">Konfirmasi</BaseButtonMode>
        </template>
      </ModalBase>
      <NuxtLink to="/pengaturan/kelolaIndikator">
        <BaseButtonMode shape="square" mode="outlined" class="me-3 font-semibold" :data-valid="runChecking">Batal</BaseButtonMode>
      </NuxtLink>
      <BaseButtonMode shape="square" mode="normal" @click.prevent="createCatModal?.open()" :not-active="!isValid || !isMatricesValid || !ahp.isConsistent">Buat Indikator</BaseButtonMode>
    </div>
  </form>

  <ModalSuccess v-if="isDataSent" @close="isDataSent = !isDataSent" />
  <ModalLoading v-if="isDataLoading" @close="isDataLoading = !isDataLoading" />
  <ModalError v-if="isDataError" @close="isDataError = !isDataError" />
</template>

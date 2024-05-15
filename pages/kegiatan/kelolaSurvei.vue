<script setup lang="ts">
import { logErrorMessages } from "@vue/apollo-util";
import type { StepProgress } from "#build/components";
import { Form, Field, ErrorMessage } from "vee-validate";
import { object, string, number, boolean } from "yup";
import { useCreateManyPenugasanStruktur, useCreateManyPetugasSurvei, useGetKegiatan } from "~/composables/useQueries";
useSeoMeta({
  title: "Kelola Survei",
});
// const authorizedRole = useCookie("authorizedRole");
const operator = useCookie("operator");
type kategori = {
  kategori_id: string;
  nama: string;
};
type survei = {
  kodeSurvei: string;
  namaSurvei: string;
  tipeSurvei: string;
  tahunSurvei?: number;
  wilayahSurvei: string;
  kegiatanSurvei: string;
  posisiSurvei: string;
  jumlahPetugasSurvei: string;
  evaluasiSurvei: string;
  konfirmasiEvaluasiSurvei?: boolean;
};

const dataForm: survei = reactive({
  kodeSurvei: "",
  namaSurvei: "",
  tipeSurvei: "",
  tahunSurvei: undefined,
  wilayahSurvei: "",
  kegiatanSurvei: "",
  posisiSurvei: "",
  jumlahPetugasSurvei: "",
  evaluasiSurvei: "",
  konfirmasiEvaluasiSurvei: undefined,
});
//Modal
const isOpen = ref(false);
const isDataSent = ref(false);
const isDataLoading = ref(false);
const isDataError = ref(false);
function toggleModal() {
  isOpen.value = !isOpen.value;
}
// progress
const currentStep = ref(0);
const dataProgress = {
  steps: ["Survei/Sensus", "Wilayah", "Kegiatan", "Posisi", "Jumlah Petugas", "Evaluasi", "Ringkasan"],
  currentStep: 0,
  activeColor: "bg-zinc-300",
  passiveColor: "bg-zinc-100",
  textColor: "text-white",
};
const step = ref<InstanceType<typeof StepProgress> | null>(null);

// data opsi
const { data: resultKategori } = await useAsyncQuery(useGetAllKategori());
const dataKategori: kategori[] = resultKategori.value?.allKategori;
const { data: resultKegiatan } = await useAsyncQuery(useGetKegiatan());
const dataKegiatan: any[] = resultKegiatan.value?.Kegiatan;
const { data: resultPosisi } = await useAsyncQuery(useGetPosisi());
const dataPosisi: any[] = resultPosisi.value?.Posisi;

// Validation
const schemas = [
  object({
    kodeSurvei: string().required(),
    namaSurvei: string().required(),
    tipeSurvei: string().required(),
    tahunSurvei: number().required(),
  }),
  object({
    wilayahSurvei: string().required(),
  }),
  object({
    kegiatanSurvei: string().required(),
  }),
  object({
    posisiSurvei: string().required(),
  }),
  object({
    jumlahPetugasSurvei: number().required().positive().integer(),
  }),
  object({
    evaluasiSurvei: string().required(),
    konfirmasiEvaluasiSurvei: boolean().required(),
    // opsiEvaluasiSurvei: string().required(),
  }),
];
const currentSchema = computed(() => {
  return schemas[currentStep.value];
});

// send form
function sendData() {
  const data: survei = useClone(dataForm);
  isDataLoading.value = true;
  //create kegSurvei
  const { mutate: sendKegSurvei, onDone: resultKegSurvei, onError: errorKegSurvei } = useMutation(useCreateKegSurvei());
  sendKegSurvei({
    input: {
      survei_kd: data.kodeSurvei,
      keg_kd: data.kegiatanSurvei,
      status: 2, // 0:blm jalan; 1: berjalan; 2: evaluasi
      is_rekrutmen: 1,
      is_multi: 0,
      is_confirm: data.konfirmasiEvaluasiSurvei,
      is_add_indicator: false,
    },
    survei: {
      kode: data.kodeSurvei,
      nama: data.namaSurvei,
      tahun: data.tahunSurvei,
      tipe: parseInt(data.tipeSurvei),
    },
  });

  errorKegSurvei((error) => {
    logErrorMessages(error);
    isDataLoading.value = false;
    isDataError.value = true;
    return;
  });
  resultKegSurvei(() => {
    sendData2(data);
  });
}

async function sendData2(data: survei) {
  //create posKegSurvei
  const { mutate: sendPosKegSurvei, onDone: resultPosKegSurvei, onError: errorPosKegSurvei } = useMutation(useCreatePosKegSurvei());
  const res1 = await sendPosKegSurvei({
    input: {
      survei_kd: data.kodeSurvei,
      keg_kd: data.kegiatanSurvei,
      posisi_kd: data.posisiSurvei,
    },
  });
  errorPosKegSurvei((error) => {
    logErrorMessages(error);
    isDataLoading.value = false;
    isDataError.value = true;
    return;
  });

  //create jumPosisiPetugasKegSurvei
  const branch_kd = "0123ABC";
  const { mutate: sendJumPosisiPetugasKegSurvei, onDone: resultJumPosisiPetugasKegSurvei, onError: errorJumPosisiPetugasKegSurvei } = useMutation(useCreateJumPosisiPetugasKegSurvei());
  const is_confirmed = false;
  const res2 = await sendJumPosisiPetugasKegSurvei({
    input: {
      survei_kd: data.kodeSurvei,
      keg_kd: data.kegiatanSurvei,
      posisi_kd: data.posisiSurvei,
      branch_kd,
      kategori_id: data.evaluasiSurvei,
      is_confirmed,
      jumlah: parseInt(data.jumlahPetugasSurvei),
    },
  });
  errorJumPosisiPetugasKegSurvei((error) => {
    logErrorMessages(error);
    isDataLoading.value = false;
    isDataError.value = true;
    return;
  });

  //create dummy on petugasSurvei (hanya yang dinilai, tidak termasuk penilai)
  const { mutate: sendPetugasSurvei, onDone: resultPetugasSurvei, onError: errorPetugasSurvei } = useMutation(useCreateManyPetugasSurvei());
  const res3 = await sendPetugasSurvei({
    input: {
      survei_kd: data.kodeSurvei,
      keg_kd: data.kegiatanSurvei,
      posisi_kd: data.posisiSurvei,
      branch_kd,
      username: "", //tidak digunakan
      status: 1,
    },
    usernames: ["mitra_2", "mitra_3", "mitra_4", "mitra_5", "mitra_7", "mitra_8", "mitra_9", "mitra_10"],
  });
  errorPetugasSurvei((error) => {
    logErrorMessages(error);
    isDataLoading.value = false;
    isDataError.value = true;
    return;
  });

  //create dummy on penugasanStruktur
  const { mutate: sendPenugasanStruktur, onDone: resultPenugasanStruktur, onError: errorPenugasanStruktur } = useMutation(useCreateManyPenugasanStruktur());
  const res4 = await sendPenugasanStruktur({
    input: {
      survei_kd: data.kodeSurvei,
      keg_kd: data.kegiatanSurvei,
      branch_kd,
      posisi_kd: data.posisiSurvei,
      username: "",
      parent: "mitra_1",
      status: 1,
    },
    usernames: ["mitra_2", "mitra_3", "mitra_4", "mitra_5"],
  });
  const res5 = await sendPenugasanStruktur({
    input: {
      survei_kd: data.kodeSurvei,
      keg_kd: data.kegiatanSurvei,
      branch_kd,
      posisi_kd: data.posisiSurvei,
      username: "",
      parent: "mitra_6",
      status: 1,
    },
    usernames: ["mitra_7", "mitra_8", "mitra_9", "mitra_10"],
  });
  errorPenugasanStruktur((error) => {
    logErrorMessages(error);
    isDataLoading.value = false;
    isDataError.value = true;
    return;
  });
  if (res1 && res2 && res3 && res4 && res5) {
    isDataLoading.value = false;
    isDataSent.value = true;
    const temp = await useWaitS(1.5);
    if (temp) {
      isDataSent.value = false;
      reloadNuxtApp();
    }
    return;
  }
}
</script>

<template>
  <h3 class="font-bold mb-3">Kelola Survei</h3>
  <BaseButtonMode v-if="!operator" mode="normal" shape="square" class="text-lg" @click="toggleModal()"><IconAdd class="h-5 w-5 inline" /> Tambahkan Survei Baru</BaseButtonMode>
  <!-- Modal form survei -->
  <ModalBase2 v-if="isOpen" width="max-w-fit" maxHeight="h-[400px] 2xl:h-fit 2xl:min-h-[450px] " color="bg-slate-500" @close="toggleModal()">
    <template #header>
      <h4 class="font-bold text-white">Buat Survei</h4>
    </template>
    <template #body>
      <div class="py-2 px-4 min-w-[950px]">
        <StepProgress :dataMain="dataProgress" ref="step" />
      </div>
      <Form :validation-schema="currentSchema" keep-values v-slot="{ handleSubmit, meta }" as="div">
        <form
          id="survei"
          @submit="
            handleSubmit($event, () => {
              currentStep++;
              step?.nextStep();
            })
          "
        >
          <div class="form-1" v-if="step?.data?.currentStep === 0">
            <div class="grid grid-cols-4 gap-4">
              <!-- Kode survei -->
              <label for="kodeSurvei" class="self-center font-medium text-lg text-white mb-3">Kode survei</label>
              <div class="col-span-3 mb-3">
                <Field
                  type="text"
                  id="kodeSurvei"
                  v-model="dataForm.kodeSurvei"
                  name="kodeSurvei"
                  class="py-3 px-4 block w-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                  placeholder=""
                />
                <ErrorMessage name="kodeSurvei" />
              </div>
              <!-- Nama survei -->
              <label for="namaSurvei" class="self-center font-medium text-lg text-white mb-3">Nama survei</label>
              <div class="col-span-3 mb-3">
                <Field
                  type="text"
                  id="namaSurvei"
                  v-model="dataForm.namaSurvei"
                  name="namaSurvei"
                  class="py-3 px-4 block w-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                  placeholder=""
                />
                <ErrorMessage name="namaSurvei" />
              </div>
              <!-- Tipe survei -->
              <label for="tipeSurvei" class="self-center font-medium text-lg text-white mb-3">Tipe</label>
              <div class="col-span-3 mb-3 text-black">
                <Field
                  as="select"
                  v-model="dataForm.tipeSurvei"
                  id="tipeSurvei"
                  name="tipeSurvei"
                  class="py-3 px-4 block w-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                >
                  <option selected disabled>Pilih tipe</option>
                  <option value="1">Tipe 1</option>
                  <option value="2">Tipe 2</option>
                  <option value="3">Tipe 3</option>
                  <option value="4">Tipe 4</option>
                </Field>
                <ErrorMessage name="tipeSurvei" />
              </div>
              <!-- Tahun survei -->
              <label for="tahunSurvei" class="self-center font-medium text-lg text-white mb-3">Tahun survei</label>
              <div class="col-span-3 mb-3">
                <Field
                  type="text"
                  v-model="dataForm.tahunSurvei"
                  id="tahunSurvei"
                  name="tahunSurvei"
                  class="py-3 px-4 block w-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                  placeholder=""
                />
                <ErrorMessage name="tahunSurvei" />
              </div>
            </div>
          </div>
          <div class="form-1" v-if="step?.data?.currentStep === 1">
            <div class="grid grid-cols-4 gap-4">
              <!-- Nama survei -->
              <label for="nama" class="self-center font-medium text-lg text-white mb-3">Nama survei</label>
              <div class="col-span-3 mb-3">
                <span class="py-3 text-white">{{ dataForm.namaSurvei }}</span>
              </div>
              <!-- Wilayah survei -->
              <label for="wilayahSurvei" class="self-center font-medium text-lg text-white mb-3">Wilayah</label>
              <div class="col-span-3 mb-3">
                <Field
                  type="text"
                  v-model="dataForm.wilayahSurvei"
                  id="wilayahSurvei"
                  name="wilayahSurvei"
                  class="py-3 px-4 block w-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                  placeholder=""
                />
                <ErrorMessage name="wilayahSurvei" />
              </div>
            </div>
          </div>
          <div class="form-1" v-if="step?.data?.currentStep === 2">
            <div class="grid grid-cols-4 gap-4">
              <!-- Nama survei -->
              <label for="nama" class="self-center font-medium text-lg text-white mb-3">Nama survei</label>
              <div class="col-span-3 mb-3">
                <span class="py-3 text-white">{{ dataForm.namaSurvei }}</span>
              </div>
              <!-- kegiatan survei -->
              <label for="kegiatanSurvei" class="self-center font-medium text-lg text-white mb-3">Kegiatan</label>
              <div class="col-span-3 mb-3">
                <Field
                  as="select"
                  v-model="dataForm.kegiatanSurvei"
                  id="kegiatanSurvei"
                  name="kegiatanSurvei"
                  class="py-3 px-4 block w-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                >
                  <option selected disabled>Pilih kegiatan</option>
                  <option v-for="item in dataKegiatan" :value="item?.kode">{{ item?.nama }}</option>
                </Field>
                <ErrorMessage name="kegiatanSurvei" />
              </div>
            </div>
          </div>
          <div class="form-1" v-if="step?.data?.currentStep === 3">
            <div class="grid grid-cols-4 gap-4">
              <!-- Nama survei -->
              <label for="nama" class="self-center font-medium text-lg text-white mb-3">Nama survei</label>
              <div class="col-span-3 mb-3">
                <span class="py-3 text-white">{{ dataForm.namaSurvei }}</span>
              </div>
              <!-- Kegiatan survei -->
              <label for="kegiatan" class="self-center font-medium text-lg text-white mb-3">Kegiatan</label>
              <div class="col-span-3 mb-3">
                <span class="py-3 text-white">{{ dataForm.kegiatanSurvei }}</span>
              </div>
              <!-- Posisi Survei -->
              <label for="posisiSurvei" class="self-center font-medium text-lg text-white mb-3">Posisi</label>
              <div class="col-span-3 mb-3">
                <Field
                  as="select"
                  v-model="dataForm.posisiSurvei"
                  id="posisiSurvei"
                  name="posisiSurvei"
                  class="py-3 px-4 block w-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                >
                  <option selected disabled>Pilih posisi</option>
                  <option v-for="item in dataPosisi" :value="item.kode">{{ item.nama }}</option>
                </Field>
                <ErrorMessage name="posisiSurvei" />
              </div>
            </div>
          </div>
          <div class="form-1" v-if="step?.data?.currentStep === 4">
            <div class="grid grid-cols-4 gap-4">
              <!-- Nama survei -->
              <label for="nama" class="self-center font-medium text-lg text-white mb-3">Nama survei</label>
              <div class="col-span-3 mb-3">
                <span class="py-3 text-white">{{ dataForm.namaSurvei }}</span>
              </div>
              <!-- Kegiatan survei -->
              <label for="kegiatan" class="self-center font-medium text-lg text-white mb-3">Kegiatan</label>
              <div class="col-span-3 mb-3">
                <span class="py-3 text-white">{{ dataForm.kegiatanSurvei }}</span>
              </div>
              <!-- Posisi survei -->
              <!-- <label for="posisi" class="self-center font-medium text-lg text-white mb-3">Posisi</label>
                  <div class="col-span-3 mb-3">
                    <span class="py-3 px-4  text-white">{{ values.posisiSurvei }}</span>
                  </div> -->
              <!-- jumlah petugas survei -->
              <label for="jumlahPetugasSurvei" class="self-center font-medium text-lg text-white mb-3">Jumlah petugas</label>
              <div class="col-span-3 mb-3">
                <Field
                  type="text"
                  v-model="dataForm.jumlahPetugasSurvei"
                  id="jumlahPetugasSurvei"
                  name="jumlahPetugasSurvei"
                  class="py-3 px-4 block w-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                  placeholder=""
                />
                <ErrorMessage name="jumlahPetugasSurvei" />
              </div>
            </div>
          </div>
          <div class="form-1" v-if="step?.data?.currentStep === 5">
            <div class="grid grid-cols-4 gap-4">
              <!-- Nama survei -->
              <label for="nama" class="self-center font-medium text-lg text-white mb-3">Nama survei</label>
              <div class="col-span-3 mb-3">
                <span class="py-3 text-white">{{ dataForm.namaSurvei }}</span>
              </div>
              <!-- Kegiatan survei -->
              <label for="kegiatan" class="self-center font-medium text-lg text-white mb-3">Kegiatan</label>
              <div class="col-span-3 mb-3">
                <span class="py-3 text-white">{{ dataForm.kegiatanSurvei }}</span>
              </div>
              <!-- Kategori penilaian survei -->
              <label for="evaluasiSurvei" class="self-center font-medium text-lg text-white mb-3">Kategori</label>
              <div class="col-span-3 mb-3">
                <Field
                  as="select"
                  v-model="dataForm.evaluasiSurvei"
                  id="evaluasiSurvei"
                  name="evaluasiSurvei"
                  class="col-span-3 py-3 px-4 block w-full border-gray-200 rounded-lg mb-3 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                >
                  <option selected disabled>Pilih kategori</option>
                  <option v-for="item in dataKategori" :value="item.kategori_id" :disabled="item.kategori_id == '1'">{{ item.nama }}</option>
                </Field>
                <ErrorMessage name="evaluasiSurvei" />
              </div>
              <!-- Opsi konfirmasi -->
              <div class="label text-white mb-3">Opsi Konfirmasi</div>
              <label class="text-white mb-3"><Field type="radio" v-model="dataForm.konfirmasiEvaluasiSurvei" name="konfirmasiEvaluasiSurvei" :value="true" class="me-3" />Ya</label>
              <div class="col-span-2 text-white mb-3">
                <label><Field type="radio" v-model="dataForm.konfirmasiEvaluasiSurvei" name="konfirmasiEvaluasiSurvei" :value="false" class="me-3" />Tidak</label>
              </div>
              <ErrorMessage name="konfirmasiEvaluasiSurvei" />
              <!-- Opsi indikator opsional -->
              <!-- <div class="label text-white mb-3">Opsi Konfirmasi</div>
                  <label class="text-white mb-3"><Field type="radio" name="opsiEvaluasiSurvei" value="1" class="me-3" />Ya</label>
                  <div class="col-span-2 text-white mb-3">
                    <label><Field type="radio" name="opsiEvaluasiSurvei" value="0" class="me-3" />Tidak</label>
                  </div>
                  <ErrorMessage name="opsiEvaluasiSurvei" /> -->
            </div>
          </div>
          <div class="form-1 text-white grid place-content-center" v-if="step?.data?.currentStep === 6">
            <h6 class="pb-3 text-center">Ringkasan Survei</h6>
            <table class="bg-slate-200 rounded-lg text-slate-800 max-w-full">
              <tbody class="divide-y divide-slate-400">
                <tr>
                  <td>Kode</td>
                  <td>{{ dataForm.kodeSurvei }}</td>
                </tr>
                <tr>
                  <td>Nama</td>
                  <td>{{ dataForm.namaSurvei }}</td>
                </tr>
                <tr>
                  <td>Tipe</td>
                  <td>{{ dataForm.tipeSurvei }}</td>
                </tr>
                <tr>
                  <td>Tahun</td>
                  <td>{{ dataForm.tahunSurvei }}</td>
                </tr>
                <tr>
                  <td>Wilayah</td>
                  <td>{{ dataForm.wilayahSurvei }}</td>
                </tr>
                <tr>
                  <td>Kegiatan</td>
                  <td>{{ useFind(dataKegiatan, {kode: dataForm.kegiatanSurvei})?.nama }}</td>
                </tr>
                <tr>
                  <td>Posisi</td>
                  <td>{{ useFind(dataPosisi, {kode:  dataForm.posisiSurvei})?.nama }}</td>
                </tr>
                <tr>
                  <td>Jumlah Petugas</td>
                  <td>{{ dataForm.jumlahPetugasSurvei }}</td>
                </tr>
                <tr>
                  <td>Kategori Evaluasi</td>
                  <td>{{ useFind(dataKategori, {kategori_id: dataForm.evaluasiSurvei})?.nama }}</td>
                </tr>
                <tr>
                  <td>Konfirmasi Evaluasi</td>
                  <td>{{ dataForm.konfirmasiEvaluasiSurvei ? "Ya" : "Tidak" }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </form>
      </Form>
    </template>
    <template #footer>
      <div class="flex justify-end items-center gap-x-2">
        <BaseButtonMode mode="gray" shape="square" class="border me-3" @click="step?.previousStep() ? currentStep-- : ''" v-if="step?.data?.currentStep > 0">Sebelumnya</BaseButtonMode>
        <BaseButtonMode type="submit" form="survei" mode="gray" shape="square" class="border" v-if="step?.data?.currentStep < dataProgress.steps.length - 1">Selanjutnya</BaseButtonMode>
        <BaseButtonMode mode="outlined" shape="square" class="border" v-if="step?.data?.currentStep == dataProgress.steps.length - 1" @click="sendData()">Buat Survei</BaseButtonMode>
      </div>
    </template>
  </ModalBase2>
  <section id="filter_pj">
    <div class="grid grid-cols-4 gap-4">
      <label for="category-label" class="text-xl mb-2">PJ kegiatan</label>
      <input type="text" id="category-label" class="block col-span-3 py-3 px-4 w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none" placeholder="" />
    </div>
  </section>
  <section id="tabel_survei">
    <TableSurvei />
  </section>
  <!-- MOdal-modal lain -->
  <ModalSuccess v-if="isDataSent" @close="isDataSent = !isDataSent" />
  <ModalLoading v-if="isDataLoading" @close="isDataLoading = !isDataLoading" />
  <ModalError v-if="isDataError" @close="isDataError = !isDataError" />

</template>

<style scoped>
tr:hover {
  background-color: #cbd5e1;
}
td {
  padding: 12px 18px;
  overflow-x: auto;
}
td:nth-child(2) {
  min-width: 320px;
}
</style>

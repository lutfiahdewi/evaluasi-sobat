<script setup lang="ts">
import type { StepProgress } from "#build/components";
import { Form, Field, ErrorMessage } from "vee-validate";
import { object, string, number } from "yup";

useSeoMeta({
  title: "Kelola Survei",
});
type kategori={
  kategori_id: string
  nama: string
}
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
const { result } = await useAsyncQuery(useGetAllKategori());
const dataKategori : kategori[] = result?.data?.allKategori
// Validation
const schemas = [
  object({
    kodeSurvei: string().required(),
    namaSurvei: string().required(),
    tipeSurvei: string().required(),
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
    konfirmasiEvaluasiSurvei: string().required(),
    // opsiEvaluasiSurvei: string().required(),
  }),
];
const currentSchema = computed(() => {
  return schemas[currentStep.value];
});

function cek() {
  console.log(currentStep.value);
  console.log(schemas[currentStep.value]);
  console.log(schemas[currentStep.value].isValid);
}
</script>

<template>
  <h3 class="font-bold mb-3">Kelola Survei</h3>
  <BaseButtonMode mode="normal" shape="square" class="text-lg" data-hs-overlay="#hs-large-modal"><IconAdd class="h-5 w-5 inline" /> Tambahkan Survei Baru</BaseButtonMode>
  <!-- Modal form survei -->
  <div id="hs-large-modal" class="hs-overlay hs-overlay-backdrop-open:bg-slate-100/50 hidden size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto pointer-events-none">
    <div class="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all lg:max-w-4xl lg:w-full m-3 lg:mx-auto">
      <div class="flex flex-col bg-slate-500 border shadow-sm rounded-lg pointer-events-auto">
        <!-- Header Modal -->
        <div class="flex justify-between items-center py-3 px-4 border-b">
          <h4 class="font-bold text-white">Buat Survei</h4>
          <button
            type="button"
            class="flex justify-center items-center size-7 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
            data-hs-overlay="#hs-large-modal"
          >
            <span class="sr-only">Close</span>
            <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
        <!-- Form Buat Survei -->
        <div class="py-5 px-8 overflow-y-auto">
          <StepProgress :dataMain="dataProgress" ref="step" />
          <Form :validation-schema="currentSchema" keep-values v-slot="{ handleSubmit, values, meta }" as="div">
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
                    <Field type="text" id="kodeSurvei" name="kodeSurvei" class="py-3 px-4 block w-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none" placeholder="" />
                    <ErrorMessage name="kodeSurvei" />
                  </div>
                  <!-- Nama survei -->
                  <label for="namaSurvei" class="self-center font-medium text-lg text-white mb-3">Nama survei</label>
                  <div class="col-span-3 mb-3">
                    <Field type="text" id="namaSurvei" name="namaSurvei" class="py-3 px-4 block w-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none" placeholder="" />
                    <ErrorMessage name="namaSurvei" />
                  </div>
                  <!-- Tipe survei -->
                  <label for="tipeSurvei" class="self-center font-medium text-lg text-white mb-3">Tipe</label>
                  <div class="col-span-3 mb-3 text-black">
                    <Field as="select" id="tipeSurvei" name="tipeSurvei" class="py-3 px-4 block w-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none">
                      <option selected disabled>Pilih tipe</option>
                      <option value="Tipe 1">Tipe 1</option>
                      <option value="Tipe 2">Tipe 2</option>
                      <option value="Tipe 3">Tipe 3</option>
                    </Field>
                    <ErrorMessage name="tipeSurvei" />
                  </div>
                </div>
              </div>
              <div class="form-1" v-if="step?.data?.currentStep === 1">
                <div class="grid grid-cols-4 gap-4">
                  <!-- Nama survei -->
                  <label for="nama" class="self-center font-medium text-lg text-white mb-3">Nama survei</label>
                  <div class="col-span-3 mb-3">
                    <span class="py-3 text-white">{{ values.namaSurvei }}</span>
                  </div>
                  <!-- Wilayah survei -->
                  <label for="wilayahSurvei" class="self-center font-medium text-lg text-white mb-3">Wilayah</label>
                  <div class="col-span-3 mb-3">
                    <Field
                      type="text"
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
                    <span class="py-3 text-white">{{ values.namaSurvei }}</span>
                  </div>
                  <!-- kegiatan survei -->
                  <label for="kegiatanSurvei" class="self-center font-medium text-lg text-white mb-3">Kegiatan</label>
                  <div class="col-span-3 mb-3">
                    <Field as="select" id="kegiatanSurvei" name="kegiatanSurvei" class="py-3 px-4 block w-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none">
                      <option selected disabled>Pilih kegiatan</option>
                      <option value="kegiatan 1">Kegiatan 1</option>
                      <option value="kegiatan 2">Kegiatan 2</option>
                      <option value="kegiatan 3">Kegiatan 3</option>
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
                    <span class="py-3 text-white">{{ values.namaSurvei }}</span>
                  </div>
                  <!-- Kegiatan survei -->
                  <label for="kegiatan" class="self-center font-medium text-lg text-white mb-3">Kegiatan</label>
                  <div class="col-span-3 mb-3">
                    <span class="py-3 text-white">{{ values.kegiatanSurvei }}</span>
                  </div>
                  <!-- Posisi Survei -->
                  <label for="posisiSurvei" class="self-center font-medium text-lg text-white mb-3">Posisi</label>
                  <div class="col-span-3 mb-3">
                    <Field as="select" id="posisiSurvei" name="posisiSurvei" class="py-3 px-4 block w-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none">
                      <option selected disabled>Pilih posisi</option>
                      <option value="posisi 1">Posisi 1</option>
                      <option value="posisi 2">Posisi 2</option>
                      <option value="posisi 3">Posisi 3</option>
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
                    <span class="py-3 text-white">{{ values.namaSurvei }}</span>
                  </div>
                  <!-- Kegiatan survei -->
                  <label for="kegiatan" class="self-center font-medium text-lg text-white mb-3">Kegiatan</label>
                  <div class="col-span-3 mb-3">
                    <span class="py-3 text-white">{{ values.kegiatanSurvei }}</span>
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
                    <span class="py-3 text-white">{{ values.namaSurvei }}</span>
                  </div>
                  <!-- Kegiatan survei -->
                  <label for="kegiatan" class="self-center font-medium text-lg text-white mb-3">Kegiatan</label>
                  <div class="col-span-3 mb-3">
                    <span class="py-3 text-white">{{ values.kegiatanSurvei }}</span>
                  </div>
                  <!-- Kategori penilaian survei -->
                  <label for="evaluasiSurvei" class="self-center font-medium text-lg text-white mb-3">Kategori</label>
                  <div class="col-span-3 mb-3">
                    <Field
                      as="select"
                      id="evaluasiSurvei"
                      name="evaluasiSurvei"
                      class="col-span-3 py-3 px-4 block w-full border-gray-200 rounded-lg mb-3 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                    >
                      <option selected disabled>Pilih kategori</option>
                      <option v-for="item in dataKategori" :value="item.nama" >{{ item.nama }}</option>
                      <option value="Kategori 3">Kategori 3</option>
                    </Field>
                    <ErrorMessage name="evaluasiSurvei" />
                  </div>
                  <!-- Opsi konfirmasi -->
                  <div class="label text-white mb-3">Opsi Konfirmasi</div>
                  <label class="text-white mb-3"><Field type="radio" name="konfirmasiEvaluasiSurvei" value="1" class="me-3" />Ya</label>
                  <div class="col-span-2 text-white mb-3">
                    <label><Field type="radio" name="konfirmasiEvaluasiSurvei" value="0" class="me-3" />Tidak</label>
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
                    <tr >
                      <td>Kode</td>
                      <td>{{values.kodeSurvei}}</td>
                    </tr>
                    <tr>
                      <td>Nama</td>
                      <td>{{values.namaSurvei}}</td>
                    </tr>
                    <tr>
                      <td>Tipe</td>
                      <td>{{values.tipeSurvei}}</td>
                    </tr>
                    <tr>
                      <td>Wilayah</td>
                      <td>{{values.wilayahSurvei}}</td>
                    </tr>
                    <tr>
                      <td>Kegiatan</td>
                      <td>{{values.kegiatanSurvei}}</td>
                    </tr>
                    <tr>
                      <td>Posisi</td>
                      <td>{{values.posisiSurvei}}</td>
                    </tr>
                    <tr>
                      <td>Jumlah Petugas</td>
                      <td>{{values.jumlahPetugasSurvei}}</td>
                    </tr>
                    <tr>
                      <td>Evaluasi</td>
                      <td>{{values.evaluasiSurvei}}</td>
                    </tr>
                    <tr>
                      <td>konfirmasi Evaluasi</td>
                      <td>{{values.konfirmasiEvaluasiSurvei==0 ? 'Tidak':'Ya'}}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </form>
          </Form>
        </div>
        <!-- BUttons -->
        <div class="flex justify-end items-center gap-x-2 py-3 px-4 border-t">
          <BaseButtonMode mode="gray" shape="square" class="border me-3" @click="step?.previousStep() ? currentStep-- : ''" v-if="step?.data?.currentStep > 0">Sebelumnya</BaseButtonMode>
          <BaseButtonMode type="submit" form="survei" mode="gray" shape="square" class="border" v-if="step?.data?.currentStep < dataProgress.steps.length - 1">Selanjutnya</BaseButtonMode>
          <BaseButtonMode mode="outlined" shape="square" class="border" v-if="step?.data?.currentStep == dataProgress.steps.length - 1">Buat Survei</BaseButtonMode>
          <!-- <button class="mx-3 rounded bg-sky-300 p-3" @click="cek()">cek</button> -->
        </div>
      </div>
    </div>
  </div>
  <section id="filter_pj">
    <div class="grid grid-cols-4 gap-4">
      <label for="category-label" class="text-xl mb-2">PJ kegiatan</label>
      <input type="text" id="category-label" class="block col-span-3 py-3 px-4 w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none" placeholder="" />
    </div>
  </section>
  <section id="tabel_survei">
    <TableSurvei />
  </section>
</template>

<style scoped>
tr:hover{
  background-color: #cbd5e1;
}
td{
  padding: 12px 18px;
  overflow-x: auto;
}
td:nth-child(2){
  min-width: 320px;
}
</style>
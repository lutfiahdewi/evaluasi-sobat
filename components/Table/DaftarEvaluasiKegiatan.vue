<script setup lang="ts">
/**
 * Tabel digunakan pada halaman /rekrutmen/evaluasi
 * Role : operator
 * Berbeda dengan mitra/petugas
 */
import { useGetJumPosisiPetugasKegSurvei, useGetPetugasSurvei } from "~/composables/useQueries";
import { logErrorMessages } from "@vue/apollo-util";
import type { AlertError, AlertLoading, AlertSuccess } from "#build/components";
type dataRow = {
  namaSurvei: string;
  namaSurvei_kd?: string;
  kegiatanSurvei: string;
  kegiatanSurvei_kd?: string;
  tahunSurvei: string;
  statusSurvei: string;
  posisiSurvei: string;
  posisiSurvei_kd?: string;
  branch_kd: string;
  statusEvaluasiSurvei: boolean;
  konfirmasiEvaluasiSurvei: boolean;
};
const columns = [
  {
    label: "Kode Survei",
    field: "namaSurvei_kd",
  },
  {
    label: "Nama Survei",
    field: "namaSurvei",
  },
  {
    label: "Tahun Survei",
    field: "tahunSurvei",
    type: "number",
  },
  {
    label: "Kegiatan",
    field: "kegiatanSurvei",
  },
  {
    label: "Status Kegiatan",
    field: "statusSurvei",
  },
  {
    label: "Posisi",
    field: "posisiSurvei",
  },
  // {
  //   label: "Penilaian",
  //   field: "evaluasiSurvei",
  // },
  {
    label: "Status Penilaian",
    field: "statusEvaluasiSurvei",
  },
];

// query KegSurvei
const { data: resultKegSurvei, refresh: refreshKegSurvei, status: statusKegSurvei } = await useAsyncQuery(useGetKegSurvei());
const dataKegSurvei: any[] = [];

// query JumPosisiPetugasKegSurvei
const { data: resultJumPosisiPetugasKegSurvei, refresh: refreshJumPosisiPetugasKegSurvei, error, pending: pendingJumPosisiPetugasKegSurvei, status: statusJumPosisiPetugasKegSurvei } = await useAsyncQuery(useGetJumPosisiPetugasKegSurvei());
const dataJumPosisiPetugasKegSurvei: any[] = [];

// query petugas survei (sedang mengerjakan apa dan di posisi apa)
const { data: resultPetugasSurvei, refresh: refreshPetugasSurvei, status: statusPetugasSurvei } = await useAsyncQuery(useGetPetugasSurvei());
const dataPetugasSurvei: any[] = [];

// query penugasan struktur (membawahi pada poskegsurvei apa(brp))

let dataTable: dataRow[] = reactive([]);
function structData(restruct?: boolean) {
  if (restruct) {
    dataKegSurvei.length = 0;
    dataJumPosisiPetugasKegSurvei.length = 0;
    dataPetugasSurvei.length = 0;
    dataTable.length = 0;
  }
  dataKegSurvei.push(...resultKegSurvei.value?.KegSurvei);
  dataJumPosisiPetugasKegSurvei.push(...resultJumPosisiPetugasKegSurvei.value?.JumPosisiPetugasKegSurvei);
  dataPetugasSurvei.push(...resultPetugasSurvei.value?.PetugasSurvei);
  try {
    dataKegSurvei.forEach((item) => {
      const i = useFindIndex(dataJumPosisiPetugasKegSurvei, { survei_kd: item.Survei?.kode, keg_kd: item.Kegiatan?.kode });
      const j = useFindIndex(dataPetugasSurvei, { survei_kd: item.Survei?.kode, keg_kd: item.Kegiatan?.kode });
      if (i >= 0 && j >= 0) {
        const temp: dataRow = {
          namaSurvei: item.Survei?.nama,
          namaSurvei_kd: item.Survei?.kode,
          kegiatanSurvei: item.Kegiatan?.nama,
          kegiatanSurvei_kd: item.Kegiatan?.kode,
          statusSurvei: item.status,
          posisiSurvei: dataPetugasSurvei[j].Posisi?.nama,
          posisiSurvei_kd: dataPetugasSurvei[j].posisi_kd,
          branch_kd: dataPetugasSurvei[j].branch_kd,
          statusEvaluasiSurvei: dataJumPosisiPetugasKegSurvei[i].is_confirmed,
          tahunSurvei: item.Survei?.tahun,
          konfirmasiEvaluasiSurvei: item.is_confirm,
        };
        dataTable.push(temp);
      }
    });
  } catch (error) {
    console.log(error);
  }
}
structData();
async function refresh() {
  showAlertLoading();
  refreshJumPosisiPetugasKegSurvei();
  refreshKegSurvei();
  refreshPetugasSurvei();
  await busyWait(() => statusJumPosisiPetugasKegSurvei.value === "success" && statusKegSurvei.value === "success" && statusPetugasSurvei.value === "success", 7.5);
  const isSuccess = statusJumPosisiPetugasKegSurvei.value === "success" && statusKegSurvei.value === "success" && statusPetugasSurvei.value === "success";
  if (isSuccess) {
    //alert succes
    showAlertSuccess(10);
    structData(true);
  } else {
    showAlertError(10);
  }
  closeAlertLoading();
}
async function busyWait(fun: () => any, timeout?: number) {
  if (!timeout) timeout = 15;
  while (!fun()) await useWaitS(timeout);
}
// alert
const alertSuccess = ref<InstanceType<typeof AlertSuccess> | null>(null);
const alertError = ref<InstanceType<typeof AlertError> | null>(null);
const alertLoading = ref<InstanceType<typeof AlertLoading> | null>(null);
const showAlertSuccess = (sec?: number) => {
  alertSuccess.value?.call(sec);
};
const showAlertError = (sec?: number) => {
  alertError.value?.call(sec);
};
const showAlertLoading = (sec?: number) => {
  alertLoading.value?.call(sec);
};
const closeAlertLoading = (sec?: number) => {
  alertLoading.value?.close();
};
</script>

<template>
  <div>
    <BaseButtonMode mode="normal" shape="square" @click="refresh()" class="mb-3"><IconRefresh class="h-6 w-6 inline me-1" />Refresh</BaseButtonMode>
    <AlertLoading ref="alertLoading" />
    <AlertSuccess ref="alertSuccess">
      <template #content>
        <p class="font-medium">Data berhasil diperbarui!</p>
      </template>
    </AlertSuccess>
    <AlertError ref="alertError">
      <template #content>
        <p class="font-medium">Data gagal diperbarui!</p>
      </template>
    </AlertError>
    <vue-good-table :columns="columns" :rows="dataTable"
    :search-options="{
      enabled: true,
    }"
    >
      <template #table-row="props">
        <span v-if="props.column.field == 'statusSurvei'">
          <div class="flex justify-center">
            <ButtonKegiatan :status="parseInt(props.row.statusSurvei)" />
          </div>
        </span>
        <span v-else-if="props.column.field == 'statusEvaluasiSurvei'">
          <div class="flex justify-center">
            <ButtonPenilaian
              :kegiatan="parseInt(props.row.statusSurvei)"
              :konfirmasi="props.row.konfirmasiEvaluasiSurvei"
              :status="props.row.statusEvaluasiSurvei"
              :query="'kegiatan?survei_kd=' + props.row.namaSurvei_kd + '&keg_kd=' + props.row.kegiatanSurvei_kd + '&branch_kd=' + props.row.branch_kd + '&posisi_kd=' + props.row.posisiSurvei_kd + '&tahun=' + props.row.tahunSurvei"
            />
          </div>
        </span>
        <span v-else>
          {{ props.formattedRow[props.column.field] }}
        </span>
      </template>
    </vue-good-table>
  </div>
</template>

<script setup lang="ts">
import { useGetJumPosisiPetugasKegSurvei, useGetPetugasSurvei } from "~/composables/useQueries";
import { logErrorMessages } from "@vue/apollo-util";
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
    label: "Nama Survei",
    field: "namaSurvei",
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
const { data: resultKegSurvei } = await useAsyncQuery(useGetKegSurvei());
const dataKegSurvei: any[] = resultKegSurvei.value?.KegSurvei;

// query JumPosisiPetugasKegSurvei
const { data: resultJumPosisiPetugasKegSurvei, refresh, error } = await useAsyncQuery(useGetJumPosisiPetugasKegSurvei());
const dataJumPosisiPetugasKegSurvei: any[] = resultJumPosisiPetugasKegSurvei.value?.JumPosisiPetugasKegSurvei;

// query petugas survei (sedang mengerjakan apa dan di posisi apa)
const { data: resultPetugasSurvei } = await useAsyncQuery(useGetPetugasSurvei());
const dataPetugasSurvei: any[] = resultPetugasSurvei.value?.PetugasSurvei;

// query penugasan struktur (membawahi pada poskegsurvei apa(brp))

let dataTable: dataRow[] = reactive([]);

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
</script>

<template>
  <div>
    <BaseButtonMode mode="normal" shape="square" @click="refresh" class="mb-3"><IconRefresh class="h-6 w-6 inline me-1" />Refresh</BaseButtonMode>
    <vue-good-table :columns="columns" :rows="dataTable">
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
            :query="'kegiatan?survei_kd='+props.row.namaSurvei_kd+'&keg_kd='+props.row.kegiatanSurvei_kd+'&branch_kd='+props.row.branch_kd+'&posisi_kd='+props.row.posisiSurvei_kd+'&tahun='+props.row.tahunSurvei" />
          </div>
        </span>
        <!-- <span v-else-if="props.column.field == 'aksi'" class="flex justify-evenly">
          <ButtonUpdate :id="props.row.id" baseLink="#" />
          <ButtonDelete/>
        </span> -->
        <span v-else>
          {{ props.formattedRow[props.column.field] }}
        </span>
      </template>
    </vue-good-table>
  </div>
</template>
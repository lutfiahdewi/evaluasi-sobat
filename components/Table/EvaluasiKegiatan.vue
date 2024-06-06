<script setup lang="ts">
import { useCountSearchPenugasanStruktur, useGetJumPosisiPetugasKegSurvei, useGetPetugasSurvei } from "~/composables/useQueries";
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
  countPenugasanStruktur: number;
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
  {
    label: "Status Penilaian",
    field: "statusEvaluasiSurvei",
  },
  {
    label: "Indikator Penilaian",
    field: "aksi",
  },
];

// query KegSurvei
const { data: resultKegSurvei } = await useAsyncQuery(useGetKegSurvei());
const dataKegSurvei: any[] = resultKegSurvei.value?.KegSurvei;

// query JumPosisiPetugasKegSurvei
const { data: resultJumPosisiPetugasKegSurvei, refresh: refreshtJumPosisiPetugasKegSurvei, error, pending: pendingJumPosisiPetugasKegSurvei } = await useAsyncQuery(useGetJumPosisiPetugasKegSurvei());
const dataJumPosisiPetugasKegSurvei: any[] = [];

// query petugas survei (sedang mengerjakan apa dan di posisi apa)
/*const { data: resultPetugasSurvei } = await useAsyncQuery(useGetPetugasSurvei());
const dataPetugasSurvei: any[] = resultPetugasSurvei.value?.PetugasSurvei;*/

let dataTable: dataRow[] = reactive([]);
function structData(restruct?: boolean) {
  if (restruct) dataJumPosisiPetugasKegSurvei.length = 0;
  dataJumPosisiPetugasKegSurvei.push(...resultJumPosisiPetugasKegSurvei.value?.JumPosisiPetugasKegSurvei);
  try {
    dataKegSurvei.forEach(async (item, idx) => {
      const i = useFindIndex(dataJumPosisiPetugasKegSurvei, { survei_kd: item.Survei?.kode, keg_kd: item.Kegiatan?.kode });
      // const j = useFindIndex(dataPetugasSurvei, { survei_kd: item.Survei?.kode, keg_kd: item.Kegiatan?.kode });

      if (i > -1) {
        // query penugasan struktur (membawahi pada poskegsurvei apa(brp))
        const { data: countPenugasanStruktur } = await useAsyncQuery(useCountSearchPenugasanStruktur(), {
          survei_kd: item.Survei?.kode,
          keg_kd: item.Kegiatan?.kode,
          branch_kd: dataJumPosisiPetugasKegSurvei[i].branch_kd,
          posisi_kd: dataJumPosisiPetugasKegSurvei[i].posisi_kd,
        });
        // if(idx = dataKegSurvei.length-1) console.log(countPenugasanStruktur.value)
        if (countPenugasanStruktur.value) {
          const temp: dataRow = {
            namaSurvei: item.Survei?.nama,
            namaSurvei_kd: item.Survei?.kode,
            kegiatanSurvei: item.Kegiatan?.nama,
            kegiatanSurvei_kd: item.Kegiatan?.kode,
            statusSurvei: item.status,
            posisiSurvei: dataJumPosisiPetugasKegSurvei[i].Posisi?.nama,
            posisiSurvei_kd: dataJumPosisiPetugasKegSurvei[i].posisi_kd,
            branch_kd: dataJumPosisiPetugasKegSurvei[i].branch_kd,
            statusEvaluasiSurvei: dataJumPosisiPetugasKegSurvei[i].is_confirmed,
            tahunSurvei: item.Survei?.tahun,
            konfirmasiEvaluasiSurvei: item.is_confirm,
            countPenugasanStruktur: countPenugasanStruktur.value?.countSearchPenugasanStruktur,
          };
          dataTable.push(temp);
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
}
structData();
async function refresh() {
  refreshtJumPosisiPetugasKegSurvei();
  await useBusyWait(() => pendingJumPosisiPetugasKegSurvei.value === false, 30);
  structData(true);
}
</script>

<template>
  <div>
    <BaseButtonMode mode="normal" shape="square" @click="refresh()" class="mb-3"><IconRefresh class="h-6 w-6 inline me-1" />Refresh</BaseButtonMode>
    <vue-good-table :columns="columns" :rows="dataTable"
    :search-options="{
      enabled: true,
    }"
    >
      <template #table-row="props">
        <span v-if="props.column.field == 'statusSurvei'">
          <div class="flex justify-center"><ButtonKegiatan :status="parseInt(props.row.statusSurvei)" class="" /></div>
        </span>
        <span v-else-if="props.column.field == 'statusEvaluasiSurvei'">
          <div class="flex justify-center">
            <ButtonPersetujuan
              :not-active="props.row.countPenugasanStruktur < 1"
              :kegiatan="parseInt(props.row.statusSurvei)"
              :konfirmasi="props.row.konfirmasiEvaluasiSurvei"
              :status="props.row.statusEvaluasiSurvei"
              :query="'kegiatan?survei_kd=' + props.row.namaSurvei_kd + '&keg_kd=' + props.row.kegiatanSurvei_kd + '&branch_kd=' + props.row.branch_kd + '&posisi_kd=' + props.row.posisiSurvei_kd + '&tahun=' + props.row.tahunSurvei"
            />
          </div>
        </span>
        <span v-else-if="props.column.field == 'aksi'">
          <div class="flex justify-center">
            <ButtonLinkIndikator
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

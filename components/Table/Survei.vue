<script setup lang="ts">
import { useGetJumPosisiPetugasKegSurvei } from "~/composables/useQueries";
import { logErrorMessages } from "@vue/apollo-util";
type dataRow = {
  kodeSurvei: string;
  namaSurvei: string;
  tipeSurvei: string;
  statusSurvei: string;
  kegiatanSurvei: string;
  jumlahPetugasSurvei: string;
  evaluasiSurvei: string;
  statusEvaluasiSurvei?: boolean;
};
const columns = [
  {
    label: "Kode Survei",
    field: "kodeSurvei",
  },
  {
    label: "Nama Survei",
    field: "namaSurvei",
  },
  {
    label: "Tipe",
    field: "tipeSurvei",
  },
  // {
  //   label: "Tahapan",
  //   field: "tahapan",
  // },
  {
    label: "Status Kegiatan",
    field: "statusSurvei",
  },
  {
    label: "Kegiatan",
    field: "kegiatanSurvei",
  },
  {
    label: "Jumlah petugas",
    field: "jumlahPetugasSurvei",
  },
  {
    label: "Penilaian",
    field: "evaluasiSurvei",
  },
  {
    label: "Status Penilaian",
    field: "statusEvaluasiSurvei",
  },
  {
    label: "Aksi",
    field: "aksi",
  },
];

// query KegSurvei
const { data: resultKegSurvei } = await useAsyncQuery(useGetKegSurvei());
const dataKegSurvei: any[] = resultKegSurvei.value?.KegSurvei;

// query JumPosisiPetugasKegSurvei
const { data: resultJumPosisiPetugasKegSurvei, refresh, error } = await useAsyncQuery(useGetJumPosisiPetugasKegSurvei());
const dataJumPosisiPetugasKegSurvei: any[] = resultJumPosisiPetugasKegSurvei.value?.JumPosisiPetugasKegSurvei;

let dataTable: dataRow[] = reactive([]);

onMounted(() => {
  try {
    dataKegSurvei.forEach((item) => {
      let temp: dataRow = {
        kodeSurvei: item.Survei?.kode,
        namaSurvei: item.Survei?.nama,
        tipeSurvei: item.Survei?.tipe,
        statusSurvei: item.status,
        kegiatanSurvei: item.Kegiatan?.nama,
        jumlahPetugasSurvei: "0",
        evaluasiSurvei: "0",
      };
      const matchIndex = useFindIndex(dataJumPosisiPetugasKegSurvei, { survei_kd: item.Survei?.kode, keg_kd: item.Kegiatan?.kode });
      if (matchIndex >= 0) {
        temp.statusEvaluasiSurvei = dataJumPosisiPetugasKegSurvei[matchIndex].is_confirmed;
        temp.jumlahPetugasSurvei = dataJumPosisiPetugasKegSurvei[matchIndex].jumlah.toString();
        temp.evaluasiSurvei = dataJumPosisiPetugasKegSurvei[matchIndex].kategori?.nama;
      }
      dataTable.push(temp);
    });
  } catch (error) {
    console.log(error);
  }
});
</script>

<template>
  <div>
    <BaseButtonMode mode="normal" shape="square" @click="refresh" class="mb-3"><IconRefresh class="h-6 w-6 inline me-1" />Refresh</BaseButtonMode>
    <vue-good-table :columns="columns" :rows="dataTable">
      <template #table-row="props">
        <span v-if="props.column.field == 'statusSurvei'">
          <div class="flex justify-center">
            <ButtonKegiatan :status="props.row.statusSurvei" />
          </div>
        </span>
        <span v-else-if="props.column.field == 'statusEvaluasiSurvei'">
          <div class="flex justify-center">
            <ButtonPenilaian :status="props.row.statusEvaluasiSurvei" />
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
  {{ dataJumPosisiPetugasKegSurvei[1].kategori?.nama }}
</template>

<script setup lang="ts">
/**
 * Tabel daftar survei
 * ROle: admin
 * Pages: kelolaSurvei
 */
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
  konfirmasivaluasiSurvei: boolean;
  statusEvaluasiSurvei?: boolean;
  survei_id: string;
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
    type: "number",
  },
  {
    label: "Penilaian",
    field: "evaluasiSurvei",
  },
  {
    label: "Aksi",
    field: "aksi",
  },
];

// query KegSurvei
const { data: resultKegSurvei, refresh: refreshKegSurvei } = await useAsyncQuery(useGetKegSurvei());
const dataKegSurvei: any[] = resultKegSurvei.value?.KegSurvei;

// query JumPosisiPetugasKegSurvei
const { data: resultJumPosisiPetugasKegSurvei, refresh: refreshJumPosisiPetugasKegSurvei, error } = await useAsyncQuery(useGetJumPosisiPetugasKegSurvei());
const dataJumPosisiPetugasKegSurvei: any[] = resultJumPosisiPetugasKegSurvei.value?.JumPosisiPetugasKegSurvei;
let dataTable: dataRow[] = reactive([]);
//refresh data
function refreshData() {
  refreshKegSurvei();
  refreshJumPosisiPetugasKegSurvei();
  dataTable = reactive([]);
  addData();
}

function addData() {
  try {
    dataKegSurvei.forEach((item) => {
      let temp: dataRow = {
        kodeSurvei: item.Survei?.kode,
        namaSurvei: item.Survei?.nama,
        tipeSurvei: item.Survei?.tipe,
        survei_id: item.Survei?.survei_id,
        statusSurvei: item.status,
        kegiatanSurvei: item.Kegiatan?.nama,
        jumlahPetugasSurvei: "0",
        evaluasiSurvei: "0",
        konfirmasivaluasiSurvei: item.is_confirm,
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
}
addData();

function deleteData(kode: string) {
  console.log("Delete: " + kode);
  const { mutate: sendDeleteSurvei, onDone: resultDeleteSurvei, onError: errorDeleteSurvei, loading: loadingDeleteSurvei } = useMutation(useDeleteSurvei());
  sendDeleteSurvei({
    kode
  });
  errorDeleteSurvei((error) => {
    logErrorMessages(error);
  });
  resultDeleteSurvei(() =>{
    reloadNuxtApp();
  })
}
</script>

<template>
  <div>
    <!-- <BaseButtonMode mode="normal" shape="square" @click="refreshData()" class="mb-3"><IconRefresh class="h-6 w-6 inline me-1" />Refresh</BaseButtonMode> -->
    <vue-good-table :columns="columns" :rows="dataTable">
      <template #table-row="props">
        <span v-if="props.column.field == 'statusSurvei'">
          <div class="flex justify-center">
            <ButtonKegiatan :status="parseInt(props.row.statusSurvei)" />
          </div>
        </span>
        <span v-else-if="props.column.field == 'aksi'" class="flex justify-evenly">
          <ButtonDelete @click.prevent="deleteData(props.row.kodeSurvei)" />
        </span>
        <span v-else>
          {{ props.formattedRow[props.column.field] }}
        </span>
      </template>
    </vue-good-table>
  </div>
</template>

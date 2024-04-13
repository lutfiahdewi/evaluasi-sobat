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
    label: "Aksi",
    field: "aksi",
  },
];
const rows = [
  { id: 1, survei: "Sensus Penduduk 2020", tahapan: "Lapangan", tipe: "sensus", status: 3, persetujuan: 3 },
  { id: 1, survei: "Sensus Penduduk 2020", tahapan: "Lapangan", tipe: "lainnya", status: 2, persetujuan: 2 },
  { id: 4, survei: "SAKERNAS 2021", tahapan: "Lapangan", tipe: "survei", status: 1, persetujuan: 1 },
  { id: 5, survei: "Survei 2022", tahapan: "Lapangan", tipe: "sensus", status: 1, persetujuan: 0 },
  { id: 3, survei: "SUSENAS 2022", tahapan: "Lapangan", tipe: "surevi", status: 1, persetujuan: 2 },
  { id: 2, survei: "Sensus Pertanian 2023", tahapan: "Lapangan", tipe: "lainnya", status: 0, persetujuan: 0 },
];

// query KegSurvei
const { data: resultKegSurvei } = await useAsyncQuery(useGetKegSurvei());
const dataKegSurvei: any[] = resultKegSurvei.value?.KegSurvei;

// query JumPosisiPetugasKegSurvei
const { data: resultJumPosisiPetugasKegSurvei } = await useAsyncQuery(useGetJumPosisiPetugasKegSurvei());
const dataJumPosisiPetugasKegSurvei: any[] = resultJumPosisiPetugasKegSurvei.value?.JumPosisiPetugasKegSurvei;

let dataTable: dataRow[] = reactive([]);

onMounted(() => {
  try {
    dataKegSurvei.forEach((item) => {
      let temp = {
        kodeSurvei: item.Survei?.kode,
        namaSurvei: item.Survei?.nama,
        tipeSurvei: item.Survei?.tipe,
        statusSurvei: item.status,
        kegiatanSurvei: item.Kegiatan?.nama,
        jumlahPetugasSurvei: "0",
        evaluasiSurvei: "0",
      };
      const matchIndex = useFindIndex(dataJumPosisiPetugasKegSurvei, { "survei_kd": item.Survei?.kode, "keg_kd": item.Kegiatan?.kode });
      if (matchIndex>=0) {
        console.log("match: ", matchIndex)
        temp.jumlahPetugasSurvei = (dataJumPosisiPetugasKegSurvei[matchIndex].jumlah).toString();
        console.log("jumlah: ", (dataJumPosisiPetugasKegSurvei[matchIndex].jumlah).toString())
        temp.evaluasiSurvei = dataJumPosisiPetugasKegSurvei[matchIndex].kategori?.nama;
      }
      // console.log(dataKegSurvei.find(item))
      console.log(temp);
      dataTable.push(temp);
    });
  } catch (error) {
    console.log(error);
  }
});
</script>

<template>
  <div>
    <vue-good-table :columns="columns" :rows="dataTable">
      <template #table-row="props">
        <span v-if="props.column.field == 'statusSurvei'">
          <div class="flex justify-center">
            <ButtonKegiatan :status="props.row.statusSurvei" />
          </div>
          <!-- <BaseButtonMode v-if="props.row.statusSurvei===0" mode="outlined" shape="pill" :not-active="true">Belum Berjalan</BaseButtonMode>
          <BaseButtonMode v-if="props.row.statusSurvei===1" mode="normal" shape="pill" :not-active="true">Sedang Berjalan</BaseButtonMode>
          <BaseButtonMode v-if="props.row.statusSurvei===2" mode="normal" shape="pill" >Evaluasi</BaseButtonMode>
          <BaseButtonMode v-if="props.row.statusSurvei===3" mode="gray" shape="pill" :not-active="true">Selesai</BaseButtonMode> -->
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

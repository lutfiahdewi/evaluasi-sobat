<script setup lang="ts">
useSeoMeta({
  title: "Indikator Penilaian",
});
type indicator = {
  urutan: number;
  nama: string;
  definisi: string;
  kategoriIndikator_id: number;
};

// query
const route = useRoute();
const { survei_kd, keg_kd, branch_kd, posisi_kd, tahun } = route.query;

// Getting data
// 1. poskegsurvei bersesuaian
const { data: resultKegSurvei } = await useAsyncQuery(useGetKegSurvei(), { survei_kd, keg_kd });
const dataKegSurvei = resultKegSurvei.value?.KegSurvei[0];
const isOperatorEditable = ref();

// 3. kategori nested, get indikator name. Mencari kategori penilaian sesuai kegiatan survei beserta kategori umum(wajib)
const { data: resultJumPosisiPetugasKegSurvei } = await useAsyncQuery(useSearchJumPosisiPetugasKegSurvei(), { survei_kd, keg_kd, branch_kd, posisi_kd });
const dataJumPosisiPetugasKegSurvei: any[] = resultJumPosisiPetugasKegSurvei.value?.searchJumPosisiPetugasKegSurvei;
const isOperatorConfirmed = ref();

const { data: resultKategoriUmum } = await useAsyncQuery(useGetKategori(), { id: 1 });
const dataKategoriUmum: any[] = resultKategoriUmum.value?.Kategori.KategoriIndikator;

// 4. Initialize data
// data query: indicators;
let Indicators: indicator[] = [];

try {
  if (!useIncludes(useToLower(resultKategoriUmum.value?.Kategori.nama), "umum")) {
    console.log(resultKategoriUmum.value);
    throw new Error("Gagal mendapatkan kategori umum!");
  }
  isOperatorEditable.value = dataKegSurvei.is_confirm;
  isOperatorConfirmed.value = dataJumPosisiPetugasKegSurvei[0].is_confirmed;
  for (const item of dataKategoriUmum) {
    const temp: indicator = {
      urutan: item.no_urut,
      nama: item.indikator.nama,
      definisi: item.indikator.definisi,
      kategoriIndikator_id: parseInt(item.kategoriIndikator_id),
    };
    Indicators.push(temp);
  }
  const n = dataKategoriUmum.length;
  for (const item of dataJumPosisiPetugasKegSurvei[0].kategori.KategoriIndikator) {
    const temp: indicator = {
      urutan: item.no_urut + n,
      nama: item.indikator.nama,
      definisi: item.indikator.definisi,
      kategoriIndikator_id: parseInt(item.kategoriIndikator_id),
    };
    Indicators.push(temp);
  }
} catch (e) {
  console.log(e);
}
Indicators = useSortBy(Indicators, ["urutan"]);
</script>

<template>
  <h3 class="font-bold">Indikator Penilaian untuk Evaluasi Kinerja Mitra</h3>

  <section>
    <div class="kegiatan mb-6">
      <h6 class="mb-3">Tentang Kegiatan</h6>
      <table class="my-3">
        <tr class="">
          <td class="mb-2 pe-3">Survei</td>
          <td class="mb-2">: {{ dataKegSurvei?.Survei?.nama }}</td>
        </tr>
        <tr>
          <td class="mb-2 pe-3">Kegiatan</td>
          <td class="mb-2">: {{ dataKegSurvei?.Kegiatan?.nama }}</td>
        </tr>
        <tr>
          <td class="mb-2 pe-3">Posisi</td>
          <td class="mb-2">: {{ dataJumPosisiPetugasKegSurvei ? dataJumPosisiPetugasKegSurvei[0].Posisi.nama : "" }}</td>
        </tr>
        <tr>
          <td class="mb-2 pe-3">Opsi Persetujuan</td>
          <td class="mb-2">: {{ isOperatorEditable ? "Perlu Persetujuan" : "Tanpa Persetujuan" }}</td>
        </tr>
        <tr v-if="isOperatorEditable">
          <td class="mb-2 pe-3">Status Persetujuan</td>
          <td class="mb-2">: {{ isOperatorConfirmed ? "Telah Disetujui" : "Belum Disetujui" }}</td>
        </tr>
      </table>
    </div>
    <div class="indikator">
        <h6 class="mb-3">Penjelasan Indikator Penilaian</h6>
      <ul>
        <li v-for="ind in Indicators" :key="ind.urutan" class="mb-2">
          {{ ind.nama }} :
          <div v-html="ind.definisi" class="wysiwyg ps-4"></div>
        </li>
      </ul>
    </div>
  </section>
</template>

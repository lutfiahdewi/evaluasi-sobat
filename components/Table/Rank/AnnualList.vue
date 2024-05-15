<script setup lang="ts">
//data filter
// 1. Survei
const { data: resultSurvei } = await useAsyncQuery(useGetSurvei());
const dataSurvei: { survei_id: number; nama: string; kode: string; tahun: string; tipe: number; unit_kd: string }[] = resultSurvei.value?.Survei;

// 4. Tahun
const dataTahun = useUniqBy(dataSurvei, "tahun");
</script>

<template>
  <section>
    <h6 class="font-semibold mb-3">Pilih Tahun:</h6>
    <ol>
      <li v-for="data in dataTahun" class="hover:bg-slate-100 hover:text-blue-700 rounded p-1 mb-3 inline pointer-events-auto me-6">
        <NuxtLink :to="'nilai/tahunan/' + data.tahun">
          {{ data.tahun }}
        </NuxtLink>
      </li>
    </ol>
  </section>
</template>

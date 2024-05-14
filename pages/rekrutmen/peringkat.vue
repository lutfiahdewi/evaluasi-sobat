<script setup lang="ts">
import All from "~/components/Table/Rank/All.vue";
import Yearly from "~/components/Table/Rank/Yearly.vue";
import Position from "~/components/Table/Rank/Position.vue";
useSeoMeta({
  title: "Peringkat Mitra",
});

// rank option
const activeComponent = shallowRef(All);
const semuaPetugasOpt = ref(true);
const tahunanOpt = ref(false);
const posisiOpt = ref(false);
function semuaPetugasOn() {
  activeComponent.value = All;
  semuaPetugasOpt.value = true;
  tahunanOpt.value = false;
  posisiOpt.value = false;
}
function tahunanOn() {
  activeComponent.value = Yearly;
  semuaPetugasOpt.value = false;
  tahunanOpt.value = true;
  posisiOpt.value = false;
}
function posisiOn() {
  activeComponent.value = Position;
  semuaPetugasOpt.value = false;
  tahunanOpt.value = false;
  posisiOpt.value = true;
}

//data filter
// 1. Survei
const selectedSurvei = ref([]);
const { data: resultSurvei } = await useAsyncQuery(useGetSurvei());
const dataSurvei: { survei_id: number; nama: string; kode: string; tahun: string; tipe: number; unit_kd: string }[] = resultSurvei.value?.Survei;
// console.log(dataSurvei);

// 2. Kegiatan
const selectedKegiatan = ref([]);
const { data: resultKegiatan } = await useAsyncQuery(useGetKegiatan());
const dataKegiatan: any[] = resultKegiatan.value?.Kegiatan;
// 3. Posisi
const selectedPosisi = ref([]);
const { data: resultPosisi } = await useAsyncQuery(useGetPosisi());
const dataPosisi: { nama: string; kode: string; posisi_id: number }[] = resultPosisi.value?.Posisi;
// 4. Tahun
const selectedTahun = ref([]);
const dataTahun = useUniqBy(dataSurvei, 'tahun')
</script>

<template>
  <h3 class="font-bold mb-3">Peringkat Mitra</h3>
  <section>
    <h6 class="font-semibold mb-3">Tampilkan peringkat:</h6>
    <div class="rank-option flex justify-start mb-6">
      <BaseButtonMode shape="square" :mode="semuaPetugasOpt ? 'normal' : 'outlined'" class="py-2 px-4 me-3 text-xl" @click="semuaPetugasOn()">Semua Mitra</BaseButtonMode>
      <BaseButtonMode shape="square" :mode="tahunanOpt ? 'normal' : 'outlined'" class="py-2 px-4 me-3" @click="tahunanOn()">Tahunan</BaseButtonMode>
      <BaseButtonMode shape="square" :mode="posisiOpt ? 'normal' : 'outlined'" class="py-2 px-4 me-3" @click="posisiOn()">Posisi tertentu</BaseButtonMode>
    </div>
    <h6 class="font-semibold mb-3">Filter peringkat:</h6>
    <div class="grid grid-cols-6 mb-3">
      <label for="survei" class="text-xl self-center">Survei:</label>
      <div class="col-span-5 mb-3 block w-full bg-slate-50 border-slate-400 rounded-lg text-slate-600">
        <v-select id="opsi" multiple v-model="selectedSurvei" :options="dataSurvei" :reduce="(dataSurvei) => dataSurvei.survei_id" label="nama" placeholder="Pilih satu atau lebih survei"></v-select>
      </div>
      <label for="kegiatan" class="text-xl self-center">Kegiatan:</label>
      <div class="col-span-5 mb-3 block w-full bg-slate-50 border-slate-400 rounded-lg text-slate-600">
        <v-select id="opsi" multiple v-model="selectedKegiatan" :options="dataKegiatan" :reduce="(dataKegiatan) => dataKegiatan.kegiatan_id" label="nama" placeholder="Pilih satu atau lebih kegiatan"></v-select>
      </div>
      <label class="text-xl self-center" for="posisi">Posisi:</label>
      <div class="col-span-2 block w-full bg-slate-50 border-slate-400 rounded-lg text-slate-600">
        <v-select id="opsi" v-model="selectedPosisi" :options="dataPosisi" :reduce="(dataPosisi) => dataPosisi.posisi_id" label="nama" placeholder="Pilih posisi"></v-select>
      </div>
      <label for="tahun" class="text-xl justify-self-center self-center">Tahun:</label>
      <div class="col-span-2 block w-full bg-slate-50 border-slate-400 rounded-lg text-slate-600">
        <v-select id="opsi" multiple v-model="selectedTahun" :options="dataTahun" :reduce="(dataTahun) => dataSurvei.tahun" label="tahun" placeholder="Pilih satu atau lebih tahun"></v-select>
      </div>
    </div>
  </section>
  <Transition name="fade" mode="out-in">
    <KeepAlive>
      <component :is="activeComponent" filter="abc123" :survei_id="selectedSurvei"></component>
    </KeepAlive>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>: { survei_id: any; }: { survei_id: any; }: { survei_id: any; }: { kegiatan_id: any; }: { kegiatan_id: any; }: { kegiatan_id: any; }

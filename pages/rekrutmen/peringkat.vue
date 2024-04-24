<script setup lang="ts">
import All from '~/components/Table/Rank/All.vue';
import Yearly from '~/components/Table/Rank/Yearly.vue';
import Position from '~/components/Table/Rank/Position.vue';
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
const columns = [
  {
    label: "ID",
    field: "sobat_id",
  },
  {
    label: "Nama Mitra",
    field: "nama",
  },
  {
    label: "Survei",
    field: "survei",
  },
  {
    label: "Kegiatan",
    field: "kegiatan",
  },
  {
    label: "Posisi",
    field: "posisi",
  },
  {
    label: "Tahun",
    field: "tanggal",
    type: "date",
    dateInputFormat: "yyyy-MM-dd",
    dateOutputFormat: "yyyy",
  },
  {
    label: "Nilai",
    field: "nilai",
  },
];
const rows = [
  { sobat_id: 112728, nama: "mitra 1", nilai: 87, survei: "Sensus Penduduk 2020", kegiatan: "Lapangan", tanggal: "2020-01-12", status: 3, persetujuan: 2 },
  { sobat_id: 138934, nama: "mitra 2", nilai: 88, survei: "Sensus Penduduk 2020", kegiatan: "Lapangan", tanggal: "2020-01-12", status: 2, persetujuan: 2 },
  { sobat_id: 412125, nama: "mitra 3", nilai: 78, survei: "SAKERNAS 2021", kegiatan: "Lapangan", tanggal: "2021-01-12", status: 1, persetujuan: 1 },
  { sobat_id: 598748, nama: "mitra 4", nilai: 89, survei: "Survei 2022", kegiatan: "Lapangan", tanggal: "2022-02-12", status: 1, persetujuan: 0 },
  { sobat_id: 321325, nama: "mitra 5", nilai: 81, survei: "SUSENAS 2022", kegiatan: "Lapangan", tanggal: "2022-08-17", status: 1, persetujuan: 2 },
  { sobat_id: 298749, nama: "mitra 6", nilai: 93, survei: "Sensus Pertanian 2023", kegiatan: "Lapangan", tanggal: "2022-01-12", status: 0, persetujuan: 0 },
];
</script>

<template>
  <h3 class="font-bold mb-3">Peringkat Mitra</h3>
  <section>
    <h6 class="font-semibold mb-3">Tampilkan peringkat:</h6>
    <div class="rank-option flex justify-start">
      <BaseButtonMode shape="square" :mode="semuaPetugasOpt ? 'normal' : 'outlined'" class="py-2 px-4 me-3 text-xl" @click="semuaPetugasOn()">Semua Mitra</BaseButtonMode>
      <BaseButtonMode shape="square" :mode="tahunanOpt ? 'normal' : 'outlined'" class="py-2 px-4 me-3" @click="tahunanOn()">Tahunan</BaseButtonMode>
      <BaseButtonMode shape="square" :mode="posisiOpt ? 'normal' : 'outlined'" class="py-2 px-4 me-3" @click="posisiOn()">Posisi tertentu</BaseButtonMode>
    </div>
  </section>
  <section>
    <h6 class="font-semibold mb-3">Filter peringkat:</h6>
    <div class="grid grid-cols-6">
      <h6 class="mb-3">Survei:</h6>
      <input type="text" class="col-span-5 mb-3 py-2 px-3 block w-full border-slate-400 rounded-lg body2 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none" placeholder="Filter survei" />
      <h6 class="mb-3">Kegiatan:</h6>
      <input type="text" class="col-span-5 mb-3 py-2 px-3 block w-full border-slate-400 rounded-lg body2 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none" placeholder="Filter kegiatan" />
      <h6 class="mb-3">Posisi:</h6>
      <select class="col-span-2 py-2 px-3 pe-9 block w-full bg-gray-100 border-slate-400 rounded-lg body2 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none">
        <option selected disabled class="text-slate-300">Pilih Posisi</option>
        <option>1</option>
        <option>2</option>
        <option>3</option>
      </select>
      <h6 class="justify-self-center mb-3">Tahun:</h6>
      <select class="col-span-2 py-2 px-3 pe-9 block w-full bg-gray-100 border-slate-400 rounded-lg body2 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none">
        <option selected disabled class="text-slate-300">Pilih Tahun</option>
        <option>2020</option>
        <option>2021</option>
        <option>2022</option>
      </select>
    </div>
  </section>
  <Transition name="fade" mode="out-in">
    <component :is="activeComponent"></component>
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
</style>

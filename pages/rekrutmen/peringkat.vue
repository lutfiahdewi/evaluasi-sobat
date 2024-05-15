<script setup lang="ts">
import All from "~/components/Table/Rank/All.vue";
import AnnualList from "~/components/Table/Rank/AnnualList.vue";
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
  activeComponent.value = AnnualList;
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
    
  </section>
  <Transition name="fade" mode="out-in">
    <KeepAlive>
      <component :is="activeComponent" :tahun="selectedTahun"></component>
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
</style>

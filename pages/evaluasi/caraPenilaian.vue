<template>
  <h3 class="font-bold">Cara Penilaian</h3>
  <section>
    <h4>Prosedur Penilaian</h4>
    <ol  class="list-decimal ms-5">
      <li>Masuk ke halaman Nilai Mitra dari menu Evaluasi</li>
      <li>
        Terdapat dua cara penilaian yaitu:
        <ul class="list-disc ms-5">
          <li>Langsung dari website</li>
          <li>Dengan fitur import</li>
        </ul>
      </li>
      <li>Cek status penilaian pada halaman...</li>
      <li>Riwayat penilaian dapat dilihat pada</li>
    </ol>
  </section>
  <section>
    <h4>Konsep dan Definisi Indikator</h4>
    <h6>Filter</h6>
    Tabel...
  </section>
  <div class="m-6">
    <AppDropdown :menu-dropdown="menuDropdown" menu-title="Coba2"/>
  </div>
</template>

<script setup lang="ts">
const menuDropdown : string[] = [
"menu 1",
"menu 2",
"menu 3",
]
definePageMeta({
  title: "Cara Penilaian",
});
</script>

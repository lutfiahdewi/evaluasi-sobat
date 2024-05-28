<script setup lang="ts">
definePageMeta({
  layout: "mitra",
});
useSeoMeta({
  title: "Profil",
});
type profileUser = {
  username: string;
  nama: string;
  email: string;
  is_pegawai: boolean;
  MitraTahunKerja: {
    tahun: string;
  }[];
};
/**
 * Query data dari tabel user dan rankmitra
 */

// Profile
const { data: dataProfile } = await useAsyncQuery(useGetProfile());
const profile: profileUser = dataProfile.value?.profile;

// data RankMitra
const branch_kd = "0123ABC";
const { data: resultRank } = await useAsyncQuery(useGetRankMitra(), { branch_kd, username: profile.username });
const dataRank: any[] = resultRank.value?.RankMitra;
const statusKinerja = ref("");
if (dataRank.length == 1) {
  const temp: number = dataRank[0].nilai_rerata;
  if (temp >= 0 && temp <= 5) {
    if (temp <= 2) {
      statusKinerja.value = "Pemula";
    } else if (temp <= 3) {
      statusKinerja.value = "Pejuang";
    } else if (temp <= 4) {
      statusKinerja.value = "Kompeten";
    } else {
      statusKinerja.value = "Profesional";
    }
  } else {
    statusKinerja.value = "-";
  }
} else {
  statusKinerja.value = "-";
}
</script>

<template>
  <h3 class="font-bold mb-3">Profil</h3>
  <div class="lg:grid lg:grid-cols-3 lg: gap-12 text-slate-900">
    <div class="card-user border border-slate-300 rounded shadow-md">
      <div class="photo-container  grid place-content-center py-6  ">
        <NuxtImg src="/user_stock.jpg" loading="lazy" class="max-w-60"/>
      </div>
      <div class="detail-user my-3 grid place-content-center">
        <div class="name-user font-bold text-lg">{{ profile.nama }}</div>
      </div>
    </div>
    <div class="col-span-2 bg-slate-100 rounded-md">
      <div class="w-full py-2 px-6 bg-slate-300 rounded-t-md">Data Diri</div>
      <div class="py-4 px-6 table-container">
        <table class="">
          <tr>
            <td class="pe-2">Nama</td>
            <td>: {{ profile.nama }}</td>
          </tr>
          <tr>
            <td class="pe-2">Email</td>
            <td>: {{ profile.email }}</td>
          </tr>
          <tr>
            <td class="pe-2">Username</td>
            <td>: {{ profile.username }}</td>
          </tr>
          <!-- <tr>
            <td class="pe-2">Status</td>
            <td>: {{ profile.is_pegawai ? "Pegawai" : "Mitra" }}</td>
          </tr> -->
          <tr>
            <td class="pe-2">Status Kinerja</td>
            <td>: {{ statusKinerja }}</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

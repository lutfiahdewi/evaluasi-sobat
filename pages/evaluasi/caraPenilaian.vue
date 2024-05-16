<script setup lang="ts">
useSeoMeta({
  title: "Cara Penilaian",
});
</script>

<template>
  <h3 class="font-bold">Cara Penilaian</h3>
  <section id="content-list">
    <h6 class="font-semibold mb-2">Daftar konten:</h6>
    <ol>
      <li>
        <NuxtLink class="underline hover:text-blue-600" to="#kegiatan">Memilih kegiatan yang akan dinilai</NuxtLink>
        <ul>
          <li><NuxtLink class="underline hover:text-blue-600" to="#status-penilaian">Penjelasan status penilaian</NuxtLink></li>
        </ul>
      </li>
      <li><NuxtLink class="underline hover:text-blue-600" to="#langsung">Penilaian langsung dari website</NuxtLink></li>
      <li>
        <NuxtLink class="underline hover:text-blue-600" to="#excel">Penilaian menggunakan excel</NuxtLink>
        <ul>
          <li><NuxtLink class="underline hover:text-blue-600" to="#excel-problem">Beberapa permasalahan yang mungkin terjadi</NuxtLink></li>
        </ul>
      </li>
      <li><NuxtLink class="underline hover:text-blue-600" to="#status">Mengecek status persetujuan dan melihat riwayat penilaian</NuxtLink></li>
      <!-- <li><NuxtLink class="underline hover:text-blue-600" to="#kegiatan"> </NuxtLink></li> -->
    </ol>
  </section>
  <section>
    <div id="kegiatan" class="mb-6">
      <h6 class="font-semibold mb-2">Memilih kegiatan yang akan dinilai</h6>
      <ol>
        <li>Buka halaman Kegiatan dari menu Evaluasi(atau klik <NuxtLink class="underline hover:text-blue-600" to="kegiatan">disini</NuxtLink>).</li>
        <li>Pilih kegiatan yang akan dinilai dengan mengklik tombol pada kolom status penilaian.</li>
        <li id="status-penilaian">
          Jika tombol status penilaian tidak bisa diklik, maka artinya anda <span class="underline">tidak memiliki tugas untuk menilai</span> siapapun pada kegiatan tersebut. Berikut penjelasan
          <span class="font-semibold">status penilaian</span>:
          <ul>
            <li>Belum dimulai : masa evaluasi belum dimulai.</li>
            <li>Lihat progres : proses evaluasi sedang berjalan.</li>
            <li>Perlu persetujuan : penilaian perlu persetujuan dari operator survei.</li>
            <li>Selesai : masa evaluasi telah berakhir dan penilaian.</li>
          </ul>
        </li>
        <li>Setelah mengklik tombol anda status penilaian,</li>
        <li>Terdapat dua cara penilaian yaitu langsung melalui website atau menggunakan excel.</li>
      </ol>
    </div>
    <div id="langsung" class="mb-3">
      <h6 class="font-semibold mb-2">Penilaian langsung dari website</h6>
      <ol>
        <li>Isikan nilai dari setiap petugas dengan <span class="font-semibold">skala penilaian 1-5 tanpa koma</span>.</li>
        <li>Nilai dapat disimpan terlebih dahulu sebelum difinalisasi jika penilaian masih mungkin berubah dalam masa evaluasi.</li>
        <li>Pastikan nilai yang dimasukkan sudah sesuai karena setelah difinalisasi, <span class="underline">nilai sudah tidak bisa diubah</span>.</li>
        <li>Jika sudah yakin dengan isian nilai, klik finalisasi untuk mengirim nilai.</li>
      </ol>
    </div>
    <div id="excel" class="mb-6">
      <h6 class="font-semibold mb-2">Penilaian menggunakan excel</h6>
      <ol>
        <li>Pastikan anda sudah berada pada halaman Nilai Mitra.</li>
        <li>Klik tombol unduh template untuk mengunduh template penilaian dengan format XLSX.</li>
        <li>
          Jika sudah terunduh, buka file menggunakan aplikasi seperti Microsoft Excel, WPS Office, LibreOffice atau aplikasi lain. Klik <span class="italic">enable editing</span> jika anda menggunakan Microsoft Excel jika file tidakk bisa
          di ubah isinya.
        </li>
        <li>Isikan nilai dari setiap petugas dengan <span class="font-semibold">skala penilaian 1-5 tanpa koma</span>.</li>
        <li>Jika sudah terisi, unggah file dengan mengklik <span class="italic">enable editing</span>.</li>
        <li>Ketika terpilih, file akan otomatis dibaca nilainya dan nilai otomatis tersimpan.</li>
        <li>Klik finalisasi jika anda sudah yakin nilai tidak akan berubah.</li>
        <li>
          <span class="font-semibold" id="excel-problem">Beberapa permasalahan yang mungkin terjadi :</span>
          <ul>
            <li>File template tidak bisa dibuka/diubah : pastikan file telah berhasil diunduh dan buka menggunakan aplikasi yang dapat membaca format XLSX.</li>
            <li>File yang diunggah tidak terbaca : File yang diunggah tidak memiliki nama yang sama dengan template.</li>
            <li>
              Terdapat data nilai yang tidak sesuai setelah diunggah : Terdapat data dari template yang diubah, data yang boleh diubah hanya nilai tiap indikator. Jika data masih tidak konsisten, <span class="italic">reload</span> halaman
              dan unduh templatenya lagi
            </li>
            <li>Data terbaca namun nilai tidak otomatis tersimpan : terdapat permasalahan pada jaringan atau data template yang diubah selain nilai.</li>
          </ul>
        </li>
      </ol>
    </div>
    <div id="status">
      <h6 class="font-semibold mb-2">Mengecek status persetujuan dan melihat riwayat penilaian</h6>
      <ol>
        <li>Status penilaian <span class="font-medium">"Perlu persetujuan"</span> berarti operator berhak menyetujui/menolak/mengubah penilaian yang telah difinalisasi. Jika operator menolak nilai, maka status final akan dibatalkan dan anda harus memfinalisasi kembali nilainya.</li>
        <li>Cek status persetujuan (jika diperlukan) dengan membuka kembali halaman penilaian lalu mengklik pada menu detail kegiatan. Jika opsi persetujuan (dari operator) dibutuhkan, maka status persetujuan akan ditampilkan.</li>
        <li>Riwayat penilaian dengan status penilaian apapun dapat dilihat kembali dengan mengklik tombol tersebut.</li>
      </ol>
    </div>
  </section>
</template>
<style scoped>
ul {
  all: revert;
  margin: 0;
}
ol {
  all: revert;
  margin: 0;
}
#content-list ol {
  list-style-type: upper-alpha;
}
#content-list ol li {
  margin-bottom: 6px;
}
</style>

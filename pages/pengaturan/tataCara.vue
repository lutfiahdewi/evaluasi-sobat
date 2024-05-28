<script setup lang="ts">
useSeoMeta({
  title: "Tata Cara Kelola Kategori-Indikator",
});
</script>

<template>
  <h3 class="font-bold">Tata Cara Kelola Kategori-Indikator</h3>
  <section id="content-list">
    <h6 class="font-semibold mb-2">Daftar konten:</h6>
    <ol>
      <li>
        <NuxtLink class="underline hover:text-blue-600" to="#kategori">Membuat, mengubah dan menghapus kategori penilaian</NuxtLink>
        <ul>
          <li><NuxtLink class="underline hover:text-blue-600" to="#kategori-batch">Buat kategori dan indikator secara bersamaan (batch)</NuxtLink></li>
          <li><NuxtLink class="underline hover:text-blue-600" to="#kategori-indikator">Buat kategori dari indikator yang tersedia</NuxtLink></li>
        </ul>
      </li>
      <li><NuxtLink class="underline hover:text-blue-600" to="#indikator">Membuat, mengubah dan menghapus indikator penilaian</NuxtLink></li>
      <li><NuxtLink class="underline hover:text-blue-600" to="#aturan">Aturan pengisian matriks perbandingan</NuxtLink></li>
    </ol>
  </section>
  <section>
    <div id="kategori" class="mb-8">
      <h6 class="font-semibold mb-2">Membuat, mengubah dan menghapus kategori penilaian</h6>
      <ol>
        <li>
          Untuk membuat kategori terdapat dua cara yaitu:
          <p class="font-medium mb-1" id="kategori-batch">A. Kategori dan indikator secara bersamaan (batch)</p>
          <ul>
            <li>Admin dapat memilih menu ini pada halaman kelola kategori indikator dengan mengklik tombol "Tambah kategori dan Indikator".</li>
            <li>Setelah itu akan muncul pilihan berapa banyak indikator yang akan dibuat. Jika sudah yakin, klik buat kategori.</li>
            <li>Setelah itu anda akan diarahkan ke halaman Tambah Kategori Indikator. Jumlah indikator tidak dapat diubah pada tahapan ini.</li>
            <li>
              Pengisian mengenai indikator dapat dilihat pada bagian <span class="underline hover:text-blue-600"><NuxtLink to="#indikator">Membuat Indikator Penilaian</NuxtLink></span>
            </li>
          </ul>
          <p class="font-medium mb-1" id="kategori-indikator">B. Kategori dari indikator yang tersedia</p>
          <ul>
            <li>Admin dapat memilih menu ini pada halaman kelola kategori indikator dengan mengklik tombol "Tambah kategori dari Indikator tersedia".</li>
            <li>Setelah itu anda akan diarahkan ke halaman Tambah Kategori.</li>
            <li>Anda dapat menambahkan indikator dengan memilih pada search bar dan mengklik tambah indikator.</li>
            <li>Indikator yang berhasil ditambahkan akan masuk kedalam daftar tabel.</li>
            <li>Indikator yang telah ditambah juga bisa dihapus dengan mengklik hapus pada kolom aksi pada tabel.</li>
          </ul>
        </li>
        <li>Kategori penilaian hanya memiliki dua field yang harus diisi yaitu nama dan deskripsi.</li>
        <li>Terdapat matriks perbandingan yang harus diisi.</li>
        <li>Pastikan isian form telah valid dan matriks perbandingan memiliki nilai CI yang konsisten untuk membuat kategori baru.</li>
        <li>Jika sudah valid, klik buat kategori. Akan muncul modal konfirmasi berisi rangkuman kategori penilaian yang akan dibuat.</li>
        <li>Konfirmasi pembuatan dengan klik konfirmasi dan anda akan diarahkan kembali ke halaman kelola indikator. Cek pada tabel kategori yang baru saja dibuat.</li>
        <li>Mereload halaman atau mengubah jumlah indikator membuat data form hilang dan harus mengulang dari halaman kelola.</li>
        <li>
          Mengubah kategori penilaian dapat dilakukan dengan mengklik tombol <span class="inline-block"><ButtonUpdate /></span> pada kolom aksi pada tabel.
        </li>
        <li>
          Menghapus kategori penilaian dapat dilakukan dengan mengklik tombol <span class="inline-block"><ButtonDelete /></span> pada kolom aksi pada tabel.
        </li>
        <li>Aksi penghapusan kategori hanya akan menghapus kategorinya saja, tanpa menghapus indikator penilaiannya. <span class="font-medium">Namun, jika kategori penilaian telah digunakan untuk menilai kinerja, nilai terkait mungkin terhapus atau justru gagal dilakukan penghapusan.</span></li>
      </ol>
    </div>
    <div id="indikator" class="mb-8">
      <h6 class="font-semibold mb-2">Membuat, mengubah dan menghapus indikator penilaian</h6>
      <ol>
        <li>Penambahan indikator dapat dilakukan satu-persatu atau dalam satu kategori penilaian, namun dari kedua cara tersebut indikator penilaian tetap memiliki field yang sama dan dapat diubah melalui tabel indikator.</li>
        <li>Field yang harus diisi yaitu nama, tipe benefit dan konsep definisi.</li>
        <li>
          <span class="font-medium">Tipe benefit</span> merupakan jenis penilaian indikator yang harus dimaksimalkan atau diminimumkan (yang bersesuaian juga dengan konsep definisi). Terdapat dua tipe yaitu cost dan benefit.
          <ul>
            <li>Indikator bertipe benefit jika ingin dimaksimalkan nilainya.</li>
            <li>Indikator bertipe cost jika ingin diminimumkan nilainya.</li>
          </ul>
          <p>Misalnya indikator moral hazard yang ingin diminimalisir dengan skala penilaian 1-5 menandakan jumlah kesalahannya. Semakin tinggi nilainya maka semakin tidak diinginkan maka tipe yang dipilih adalah Cost.</p>
        </li>
        <li><span class="font-bold">Pada pengembangan modul ini, penilaian terbatas skala 1-5 tanpa koma</span>, sehingga konsep definisi harus menyesuaikan skala tersebut.</li>
        <li>Mengubah dan menghapus dapat mengklik tombol serupa pada bagian kategori, namun sesuai dengan indikator yang akan diubah.</li>
        <li><span class="font-bold">Menghapus indikator yang terkait satu/lebih kategori akan menghapus juga detail (seperti bobot) kategori penilaian terkait.</span></li>
        <li><span class="font-medium">Disarankan penghapusan indikator dilakukan ketika sudah dihapus dari kategori terkait.</span></li>
      </ol>
    </div>
    <div id="aturan" class="mb-6">
      <h6 class="font-semibold mb-2">Aturan pengisian matriks perbandingan dan cek konsistensi matriks</h6>
      <ol>
        <li>Matriks perbandingan disusun berdasarkan aturan AHP(Analytical Hierarchy Process)</li>
        <li>Matriks ini membandingkan indikator pada baris (indikator A) dengan indikator pada kolom (indikator B).</li>
        <li>Matriks berisi nilai kepentingan dengan membandingkan tingkat kepentingan dua kriteria/indikator.</li>
        <li>Berikut daftar tingkat kepentingan:</li>
        <TableAhpPC />
        <p>* Jika indikator pada baris lebih penting maka diisi secara langsung tingkat kepentingan</p>
        <p>* Jika indikator pada kolom lebih penting maka diisi 1/(tingkat kepentingannya)</p>
        <li>Pastikan nilai yang diinput berada dalam skala 1-9 begitupun kebalikannya.</li>
        <li>Setelah menginput semua nilai pada matriks perbandingan klik cek konsitensi untuk menghitung CI dan bobot setiap indikator (ditampilkan pada modal konfirmasi).</li>
        <li>Dalam AHP, terdapat aturan bahwa setelah dibuat matriks perbandingannya, maka nilai CI harus < 0.1</li>
        <li>Jika CI > 0.1 maka terdapat ketidak-konsistenan pada isian matriks perbandingan. Silahkan tinjau ulang.</li>
        <li>Kategori tidak bisa dibuat jika matriks tidak konsisten.</li>
        <li></li>
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

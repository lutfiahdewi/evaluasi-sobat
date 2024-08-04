/**
 * Tabel tingkat kepentingan untuk membuat matriks perbandingan pada AHP
 */
<template>
  <table class="bg-slate-200 rounded shadow my-4 divide-y divide-slate-400">
    <thead>
      <tr>
        <th>Nilai</th>
        <th>Deskripsi</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-slate-300">
      <tr>
        <td>1</td>
        <td>Indikator A sama pentingnya dengan Indikator B</td>
      </tr>
      <tr>
        <td>3</td>
        <td>Indikator A sedikt lebih penting daripada Indikator B</td>
      </tr>
      <tr>
        <td>5</td>
        <td>Indikator A lebih penting daripada Indikator B</td>
      </tr>
      <tr>
        <td>7</td>
        <td>Indikator A sangat lebih penting daripada Indikator B</td>
      </tr>
      <tr>
        <td>9</td>
        <td>Indikator A mutlak lebih penting daripada Indikator B</td>
      </tr>
      <tr>
        <td>2, 4, 6, 8</td>
        <td>Nilai-nilai antara dua nilai kepentingan yang berdekatan</td>
      </tr>
      <tr>
        <td>Kebalikan</td>
        <td>Jika indikator A dibandingkan indikator B memiliki nilai 4, maka indikator B dibanding indikator A memiliki nilai 1/4</td>
      </tr>
    </tbody>
  </table>

</template>
<style scoped>
tbody td, th{
    padding: 10px 8px;
}
tbody td:first-child{
    text-align:center;
}
</style>
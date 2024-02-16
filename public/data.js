const kegiatan = [
    {id: 1, nama: 'kegiatan 1', indikator: {id: [1,2]}},
    {id: 2, nama: 'kegiatan 2', indikator: {id: [1,2,3]}}
];

const indikator = [ 
    {id: 1, nama: 'Integritas', kategori: 'umum', bobot: 15, definisi: 'Integritas merupakan suatu aspek yang meliputi 1, 2 dan 3...'},
    {id: 2, nama: 'Keakuratan', kategori: 'pendataan', bobot: 15, definisi: 'Integritas merupakan suatu aspek yang meliputi 1, 2 dan 3...'},
    {id: 3, nama: 'ketepatan', kategori: 'pengolahan', bobot: 15, definisi: 'Integritas merupakan suatu aspek yang meliputi 1, 2 dan 3...'},
];
const nilai = [
    {id: 1, mitra_id: 1, kegiatan_id: 2, nilai: 78}
]
const nilaiIndikator = [
    {id:1, nilai_id: 1, indikator_id:1, nilai: 89},
    {id:1, nilai_id: 1, indikator_id:2, nilai: 70},
    {id:1, nilai_id: 1, indikator_id:3, nilai: 75},
]
const peringkat = [
    {id:1, nama: 'mitra 1', nilai: 89}
]

export default {kegiatan, indikator, nilai, nilaiIndikator, peringkat};
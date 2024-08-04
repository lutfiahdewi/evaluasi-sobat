/**
 * Composables berisi kueri2 yang dapat dipanggil tanpa mendefinisikan query berulang2.
 * Pada composable ini hanya mengambil field yang akan digunakan.
 * Adapun struktur composablenya berisi query graphql yang memiliki detail input serta serta struktur data yang diminta(dikirim oleh API).
 * Tipe input serta field lengkap dari suatu objek dapat dilihat pada skema GraphQL. 
 */

// Login => argumen email and password
/**
 * Used in auth.ts in store
 * @param {string} email
 * @param {string} password
 * @returns token, {user}
 */
export const useLogin = () => {
  const query = gql`
    mutation ($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        token
        user {
          username
          nama
          is_pegawai
          UserRole {
            role_id
          }
        }
      }
    }
  `;
  return query;
};

// profil
/**
 * Get detail profile in page profile
 * @returns username, nama, email etc
 */
export const useGetProfile = () => {
  const query = gql`
    query {
      profile {
        user_id
        username
        nama
        email
        is_pegawai
        UserRole {
          user_role_id
          role_id
          status
        }
        MitraTahunKerja {
          mitratahunkerja_id
          branch_kd
          tahun
          status
        }
      }
    }
  `;
  return query;
};

// Getting all kategori data
/**
 * get all kategori in page kelolaSurvei
 * @returns kategori_id, nama
 */
export const useGetAllKategori = () => {
  const query = gql`
    query {
      allKategori {
        kategori_id
        nama
      }
    }
  `;
  return query;
};

// Getting a Kategori Nested
/**
 * Mengkueri satu kategori nested, terkait kategoriIndikator yang terkait juga dg detail indikator.
 * Pages: \evaluasi\kondef\[query], \evaluasi\nilaiMitra\[query], \pengaturan\ubahKategori\[id], \rekrutmen\nilai\[kegiatan], rekrutmen\nilai\laporan\[kegiatan]
 * COmponent (Table\Rank): All, Annual
 * @param {int} id
 * @returns {kategori}
 */
export const useGetKategori = () => {
  const query = gql`
    query ($id: Int!) {
      Kategori(id: $id) {
        __typename
        kategori_id
        nama
        definisi
        KategoriIndikator {
          kategoriIndikator_id
          branch_kd
          indikator_id
          kategori_id
          bobot
          no_urut
          perbandingan
          indikator {
            indikator_id
            branch_kd
            nama
            is_benefit
            definisi
          }
        }
      }
    }
  `;
  return query;
};

/**
 * Creating a kategori
 * Pages: \pengaturan\tambahKategori, \pengaturan\tambahKategoriIndikator
 * @returns kategori_id
 */
export const useCreateKategori = () => {
  const query = gql`
    mutation createKategori($input: KategoriInputType!) {
      createKategori(input: $input) {
        kategori_id
      }
    }
  `;
  return query;
};

/**
 * updating a kategori
 * Pages: \pengaturan\ubahKategori\[id]
 * @returns kategori_id, nama, definisi
 */
export const useUpdateKategori = () => {
  const query = gql`
    mutation ($input: KategoriInputType!, $id: Int!) {
      updateKategori(input: $input, id: $id) {
        kategori_id
        nama
        definisi
      }
    }
  `;
  return query;
};

/**
 * Deleting a kategori (and connection to kategoriIndikator)
 * Pages: \pengaturan\ubahKategori\[id]
 * Component (Table) : KategoriIndikator
 * @param {int} id
 * @returns kategori_id, nama
 */
export const useDeleteKategori = () => {
  const query = gql`
    mutation ($id: Int!) {
      deleteKategori(id: $id) {
        kategori_id
        nama
      }
    }
  `;
  return query;
};

/**
 * Creating an indikator nested (a kategoriIndikator directly connected)
 * Pages: \pengaturan\tambahKategoriIndikator
 * @returns {indikator}
 */
export const useCreateIndikatorNested = () => {
  const query = gql`
    mutation ($input: IndikatorNestedInputType!) {
      createIndikatorNested(input: $input) {
        indikator_id
        branch_kd
        nama
        is_benefit
        definisi
        KategoriIndikator {
          kategoriIndikator_id
          indikator_id
          kategori_id
        }
      }
    }
  `;
  return query;
};

/**
 * Getting all kategori data
 * Data berupa nama, id kategori beserta indikator2 terkait
 * Component (Table): KAtegoriINdikator
 * @returns {kategori[]}
 */
export const useTableCategories = () => {
  const query = gql`
    query {
      allKategori {
        kategori_id
        nama
        KategoriIndikator {
          indikator_id
          no_urut
          indikator {
            indikator_id
            nama
          }
        }
      }
    }
  `;
  return query;
};
/**
 * Creating an indikator
 * Pages: \pengaturan\kelolaIndikator, \pengaturan\tambahKategoriIndikator
 * @returns {indikator}
 */
export const useCreateIndikator = () => {
  const query = gql`
    mutation ($input: IndikatorInputType!) {
      createIndikator(input: $input) {
        indikator_id
        nama
        is_benefit
        definisi
      }
    }
  `;
  return query;
};

/**
 * Get many or one (id) indikator
 * Pages: \pengaturan\tambahKategori, \pengaturan\ubahKategori\[id]
 * @returns {indikator}
 */
export const useGetIndicators = () => {
  const query = gql`
    query ($id: Int) {
      indikator(id: $id) {
        indikator_id
        branch_kd
        nama
        is_benefit
        definisi
      }
    }
  `;
  return query;
};

/**
 * Update indikator
 * Component (table): Indikator
 * @returns indikator_id
 */
export const useUpdateIndicator = () => {
  const query = gql`
    mutation ($input: IndikatorInputType!, $id: Int!) {
      updateIndikator(input: $input, id: $id) {
        indikator_id
      }
    }
  `;
  return query;
};

/**
 * Delete indikator
 * Component (table): Indikator
 * @returns indikator_id, nama
 */
export const useDeleteIndicator = () => {
  const query = gql`
    mutation ($id: Int!) {
      deleteIndikator(id: $id) {
        indikator_id
        nama
      }
    }
  `;
  return query;
};

/**
 * Getting all indicators data
 * Data berupaka nama indikator, id dan kategori terkait
 * Component (table): Indikator
 * @returns {indikator[]}
 */
export const useTableIndicators = () => {
  const query = gql`
    query {
      allIndikatorNested {
        indikator_id
        branch_kd
        nama
        is_benefit
        definisi
        KategoriIndikator {
          kategori {
            kategori_id
            nama
          }
        }
      }
    }
  `;
  return query;
};

/**
 * create kategoriIndikator
 * Pages: pengaturan\tambahKategori, \pengaturan\ubahKategori\[id]
 * Page ubah kategori juga dapat membuat baru untuk indikator yg belum ada sebelumnya.
 * @returns {kategoriIndikator}
 */
export const useCreateKategoriIndikator = () => {
  return gql`
    mutation ($input: KategoriIndikatorInputType!) {
      createKategoriIndikator(input: $input) {
        kategoriIndikator_id
        branch_kd
        indikator_id
        kategori_id
        bobot
        no_urut
        perbandingan
        kategori {
          kategori_id
          nama
        }
        indikator {
          indikator_id
          nama
        }
      }
    }
  `;
};

/**
 * update kategoriIndikator
 * Pages: \pengaturan\ubahKategori\[id]
 * @returns {kategoriIndikator}
 */
export const useUpdateKategoriIndikator = () => {
  return gql`
    mutation ($input: KategoriIndikatorInputType!, $id: Int!) {
      updateKategoriIndikator(input: $input, id: $id) {
        __typename
        kategoriIndikator_id
        branch_kd
        indikator_id
        kategori_id
        bobot
        no_urut
        perbandingan
        kategori {
          kategori_id
          nama
          definisi
        }
        indikator {
          indikator_id
          branch_kd
          nama
          is_benefit
          definisi
        }
      }
    }
  `;
};

/**
 * Delete kategoriIndikator
 * Pages: \pengaturan\ubahKategori\[id]
 * @param {int} id
 * @returns
 */
export const useDeleteKategoriIndikator = () => {
  return gql`
    mutation ($id: Int!) {
      deleteKategoriIndikator(id: $id) {
        kategoriIndikator_id
        branch_kd
        indikator_id
        kategori_id
        bobot
        no_urut
        perbandingan
      }
    }
  `;
};

// SURVEI
/**
 * Get all or one Survei
 * Component : \Table\Rank\AnnualList.vue
 * Page: \rekrutmen\nilaiEvaluasi
 * @returns {Survei[]}
 */
export const useGetSurvei = () => {
  return gql`
    query ($kode: String) {
      Survei(kode: $kode) {
        survei_id
        kode
        nama
        tahun
        tipe
        unit_kd
      }
    }
  `;
};
/**
 * delete(include reference(cascade))
 * component: \table\survei
 * @param id: Int!
 * @returns survei_id
 */
export const useDeleteSurvei = () => {
  return gql`
    mutation ($id: Int, $kode: String) {
      deleteSurvei(id: $id, kode: $kode) {
        survei_id
      }
    }
  `;
};

// KEGIATAN
/**
 * Get all or one kegiatan
 * pages: \kegiatan\kelolaSurvei, \rekrutmen\nilaiEvaluasi
 * @returns {kegiatan[]}
 */
export const useGetKegiatan = () => {
  return gql`
    query ($kode: String) {
      Kegiatan(kode: $kode) {
        kegiatan_id
        kode
        nama
      }
    }
  `;
};

// POSISI
/**
 * Get all or one posisi
 * Pages: \kegiatan\kelolaSurvei, \rekrutmen\nilaiEvaluasi
 * @returns {posisi[]}
 */
export const useGetPosisi = () => {
  return gql`
    query ($kode: String) {
      Posisi(kode: $kode) {
        posisi_id
        kode
        nama
      }
    }
  `;
};

// KegSurvei
/**
 * Pages: \kegiatan\kelolaSurvei
 * @returns kegsurvei_id, status
 */
export const useCreateKegSurvei = () => {
  return gql`
    mutation ($input: KegSurveiInputType!, $survei: SurveiInputType) {
      createKegSurvei(input: $input, survei: $survei) {
        kegsurvei_id
        status
      }
    }
  `;
};

/**
 * Untuk mendapatkan detail kegiatan survei
 * @param {int} id
 * @param {String} survei_kd
 * @param {String} keg_kd
 * Components (Table): DaftarEvaluasiKegiatan, EvaluasiKegiatan, Survei, Rank\Position
 * Pages: \evaluasi\kondef\[query], \evaluasi\nilaiMitra\[query], \rekrutmen\nilai\[kegiatan], rekrutmen\nilai\laporan\[kegiatan]
 * @returns {kegsurvei}
 */
export const useGetKegSurvei = () => {
  return gql`
    query ($id: Int, $survei_kd: String, $keg_kd: String) {
      KegSurvei(id: $id, survei_kd: $survei_kd, keg_kd: $keg_kd) {
        kegsurvei_id
        Survei {
          kode
          nama
          tipe
          tahun
        }
        Kegiatan {
          kode
          nama
        }
        is_confirm
        status
      }
    }
  `;
};

// PosKEgSurvei
/**
 * Pages: \kegiatan\kelolaSurvei
 * @returns poskegsurvei_id, urutan
 */
export const useCreatePosKegSurvei = () => {
  return gql`
    mutation ($input: PosKegSurveiInputType!) {
      createPosKegSurvei(input: $input) {
        poskegsurvei_id
        urutan
      }
    }
  `;
};

// JumPosisiPetugasKegSurvei
/**
 * Pages: \kegiatan\kelolaSurvei
 * @returns jumposisipetugaskegsurvei_id, jumlah, is_confirmed
 * is_confirmed: apakah penilaian telah disetujui
 */
export const useCreateJumPosisiPetugasKegSurvei = () => {
  return gql`
    mutation ($input: JumPosisiPetugasKegSurveiInputType!) {
      createJumPosisiPetugasKegSurvei(input: $input) {
        jumposisipetugaskegsurvei_id
        jumlah
        is_confirmed
      }
    }
  `;
};
/**
 * Kueri data terkait jumlah petugas, kategori penilaian, status konfirmasi pada poskegsurvei tertentu
 * Components (table): DaftarEvaluasiKegiatan, EvaluasiKegiatan, Survei, Position,
 * @returns {JumPosisiPetugasKegSurvei[]}
 */
export const useGetJumPosisiPetugasKegSurvei = () => {
  return gql`
    query ($id: Int) {
      JumPosisiPetugasKegSurvei(id: $id) {
        jumposisipetugaskegsurvei_id
        survei_kd
        keg_kd
        kategori {
          kategori_id
          nama
        }
        posisi_kd
        Posisi {
          nama
        }
        branch_kd
        jumlah
        is_confirmed
      }
    }
  `;
};

/**
 * Mencari data terkait jumlah petugas, kategori penilaian, status konfirmasi pada poskegsurvei tertentu
 * Pages: \evaluasi\kondef\[query], \evaluasi\nilaiMitra\[query],\rekrutmen\nilai\[kegiatan], rekrutmen\nilai\laporan\[kegiatan]
 * @param {branch_kd, keg_kd, posisi_kd, survei_kd}
 * @returns  {JumPosisiPetugasKegSurvei[]}
 */
export const useSearchJumPosisiPetugasKegSurvei = () => {
  return gql`
    query ($survei_kd: String!, $keg_kd: String!, $branch_kd: String!, $posisi_kd: String!) {
      searchJumPosisiPetugasKegSurvei(survei_kd: $survei_kd, keg_kd: $keg_kd, branch_kd: $branch_kd, posisi_kd: $posisi_kd) {
        jumposisipetugaskegsurvei_id
        Posisi {
          nama
        }
        kategori {
          kategori_id
          nama
          KategoriIndikator {
            kategoriIndikator_id
            no_urut
            bobot
            indikator {
              indikator_id
              nama
              definisi
              is_benefit
            }
          }
        }
        jumlah
        is_confirmed
      }
    }
  `;
};

/**
 * Mengubah data jumlah petugas dan status konfirmasi pada poskegsurvei tertentu
 * Pages: \rekrutmen\nilai\[kegiatan].vue
 * @param {int} id
 * @param {int} jumlah
 * @param {boolean} is_confirmed
 * @returns  {JumPosisiPetugasKegSurvei[]}
 */
export const useUdateJumPosisiPetugasKegSurvei = () => {
  return gql`
    mutation ($id: Int!, $jumlah: Int, $is_confirmed: Boolean) {
      updateJumPosisiPetugasKegSurvei(id: $id, jumlah: $jumlah, is_confirmed: $is_confirmed) {
        jumposisipetugaskegsurvei_id
        jumlah
        is_confirmed
      }
    }
  `;
};

//Petugas Survey
/**
 * Mendapat daftar petugas pada poskegsurvei tertentu
 * Components (table): DaftarEvaluasiKegiatan, EvaluasiKegiatan, Position,
 * @returns {PetugasSurvei[]}
 */
export const useGetPetugasSurvei = () => {
  return gql`
    query ($id: Int) {
      PetugasSurvei(id: $id) {
        __typename
        petugassurvei_id
        survei_kd
        keg_kd
        branch_kd
        posisi_kd
        Posisi {
          nama
        }
        username
        status
      }
    }
  `;
};

/**
 * Membuat relasi (meng-assign posisi) petugas pada poskegsurvei tertentu
 * Pages: \kegiatan\kelolaSurvei
 * @returns {petugassurvei_id[]}
 */
export const useCreateManyPetugasSurvei = () => {
  return gql`
    mutation ($input: PetugasSurveiInputType!, $usernames: [String]!) {
      createManyPetugasSurvei(input: $input, usernames: $usernames) {
        petugassurvei_id
      }
    }
  `;
};

/***
 * Membuat banyak Struktur Penugasan, terkait pengawas dan petugas yang diawasi
 * Pages: \kegiatan\kelolaSurvei
 * @returns {penugasanstruktur_id[]}
 */
export const useCreateManyPenugasanStruktur = () => {
  return gql`
    mutation ($input: PenugasanStrukturInputType!, $usernames: [String]!) {
      createManyPenugasanStruktur(input: $input, usernames: $usernames) {
        penugasanstruktur_id
      }
    }
  `;
};
/**
 * Mencari struktur penugasan berdasarkan poskegsurvei tertentu
 * Pages: \evaluasi\nilaiMitra\[query].vue
 * @returns {username, parent, status}
 */
export const useSearchPenugasanStruktur = () => {
  return gql`
    query ($keg_kd: String!, $survei_kd: String!, $branch_kd: String!, $posisi_kd: String!) {
      searchPenugasanStruktur(keg_kd: $keg_kd, survei_kd: $survei_kd, branch_kd: $branch_kd, posisi_kd: $posisi_kd) {
        username
        User {
          user_id
          nama
        }
        parent
        status
      }
    }
  `;
};

/**
 * Mendapatkan jumlah petugas yang diawasi (user yg login) berdasarkan branch_kd, keg_kd, posisi_kd, survei_kd
 * Components: \Table\EvaluasiKegiatan
 * @returns {int}
 */
export const useCountSearchPenugasanStruktur = () => {
  return gql`
    query ($survei_kd: String!, $keg_kd: String!, $branch_kd: String!, $posisi_kd: String!) {
      countSearchPenugasanStruktur(survei_kd: $survei_kd, keg_kd: $keg_kd, branch_kd: $branch_kd, posisi_kd: $posisi_kd)
    }
  `;
};

// Query optional filtering
/**
 * Kueri data penugasan struktur berdasarkan poskegsurvei tertentu
 * Pages: \rekrutmen\nilai\[kegiatan], \rekrutmen\nilai\laporan\[kegiatan]
 * @returns {user, parent, status,...}
 */
export const useGetPenugasanStruktur = () => {
  return gql`
    query ($id: Int, $survei_kd: String!, $keg_kd: String, $branch_kd: String, $posisi_kd: String) {
      PenugasanStruktur(id: $id, survei_kd: $survei_kd, keg_kd: $keg_kd, branch_kd: $branch_kd, posisi_kd: $posisi_kd) {
        penugasanstruktur_id
        keg_kd
        branch_kd
        posisi_kd
        username
        User {
          user_id
          username
          nama
        }
        parent
        status
      }
    }
  `;
};

/**
 * Membuat nilai pada Kategori Indikator tertentu sesuai petugas dan poskegsurvei-nya, contoh input:
 * PAges: \evaluasi\nilaiMitra\[query].vue
 * @param "input": {
 *      "survei_kd": "0125A",
 *       "keg_kd": "0125B",
 *       "branch_kd": "0123ABC",
 *       "posisi_kd": "0125C",
 *       "username": "mitra_1",
 *       "kategoriIndikator_id": [
 *           1, 2
 *       ],
 *       "nilai": [
 *           null, 4
 *       ],
 *       "is_final": false
 *   }
 * @returns {nilaiKategoriIndikator}
 */
// create
export const useCreateNilaiKategoriIndikator = () => {
  return gql`
    mutation ($input: NilaiKategoriIndikatorInputType!) {
      createNilaiKategoriIndikator(input: $input) {
        nilaikategoriindikator_id
        survei_kd
        keg_kd
        branch_kd
        posisi_kd
        username
        kategoriIndikator_id
        nilai
        is_final
      }
    }
  `;
};

/**
 * Kueri nilai dari suatu kategori-indikator tertentu dengan filter survei_kd, keg_kd, posisi_kd, tahun (kerja), username
 * Pages: \evaluasi\nilaiMitra\[query], \rekrutmen\nilai\[kegiatan], rekrutmen\nilai\laporan\[kegiatan]
 * Component (Table\Rank): All, Annual
 * @returns
 */
export const useGetNilaiKategoriIndikator = () => {
  return gql`
    query ($id: Int, $survei_kd: String, $keg_kd: String, $branch_kd: String, $posisi_kd: String, $kategoriIndikator_id: Int, $username: String, $tahun: String) {
      NilaiKategoriIndikator(id: $id, survei_kd: $survei_kd, keg_kd: $keg_kd, branch_kd: $branch_kd, posisi_kd: $posisi_kd, kategoriIndikator_id: $kategoriIndikator_id, username: $username, tahun: $tahun) {
        nilaikategoriindikator_id
        survei_kd
        keg_kd
        branch_kd
        posisi_kd
        username
        User {
          nama
        }
        kategoriIndikator_id
        KategoriIndikator {
          no_urut
        }
        nilai
        is_final
        tahun
      }
    }
  `;
};

/**
 * Mengubah nilai nilai dari suatu kategori-indikator tertentu, field yang diubah hanya nilai dan is_final (status finalisasi)
 * single update: id should have is_final
 * batch update: input where there are list of kategoriIndikator_id and nilai, both should have same length.
 * Pages: \evaluasi\nilaiMitra\[query], \rekrutmen\nilai\[kegiatan]
 * @returns {nilaikategoriindikator_id, nilai, is_final}[]
 */
export const useUpdateNilaiKategoriIndikator = () => {
  return gql`
    mutation ($input: NilaiKategoriIndikatorInputType, $id: Int, $nilai: Int, $is_final: Boolean) {
      updateNilaiKategoriIndikator(input: $input, id: $id, nilai: $nilai, is_final: $is_final) {
        nilaikategoriindikator_id
        KategoriIndikator {
          kategoriIndikator_id
        }
        nilai
        is_final
      }
    }
  `;
};

/**
 * Mengubah status finalisasi sekelompok nilai pada kategori-indikator poskegsurvei tahun yang sama
 * Finalisasi dilakukan operator admin
 * Pages: \pages\rekrutmen\nilai\[kegiatan]
 * @param $survei_kd: String!,
 * @param $keg_kd: String!,
 * @param $branch_kd: String!,
 * @param $posisi_kd: String!,
 * @param $tahun: String!
 * @param $is_final: Boolean!
 * @returns count: Int(How many data get updated)
 */
export const useFinalizeNilaiKategoriIndikator = () => {
  return gql`
    mutation ($survei_kd: String!, $keg_kd: String!, $branch_kd: String!, $posisi_kd: String!, $tahun: String!, $is_final: Boolean!) {
      finalizeNilaiKategoriIndikator(survei_kd: $survei_kd, keg_kd: $keg_kd, branch_kd: $branch_kd, posisi_kd: $posisi_kd, tahun: $tahun, is_final: $is_final) {
        __typename
        count
      }
    }
  `;
};

/**
 * Membuat data peringkat petugas terkait poskegsurvei tertentu
 * Pages: \rekrutmen\nilai\[kegiatan]
 * @param input {{
    "input": {
        "survei_kd": "Vivamus",
        "keg_kd": "erat",
        "branch_kd": "quis",
        "posisi_kd": "Suspendisse",
        "username": "quis",
        "nilai": 131.52
    }
}}
 * @returns {RankMitraPosKegSurvei}[]
 */
export const useCreateRankMitraPosKegSurvei = () => {
  return gql`
    mutation ($input: RankMitraPosKegSurveiInputType!) {
      createRankMitraPosKegSurvei(input: $input) {
        rankmitraposkegsurvei_id
        survei_kd
        keg_kd
        branch_kd
        posisi_kd
        username
        nilai
      }
    }
  `;
};

/**
 * Kueri peringkat petugas pada poskegsurvei tertentu
 * Pages: \rekrutmen\nilai\laporan\[kegiatan]
 * @returns {RankMitraPosKegSurvei}[]
 */
export const useGetRankMitraPosKegSurvei = () => {
  return gql`
    query ($id: Int, $survei_kd: String, $keg_kd: String, $branch_kd: String, $posisi_kd: String, $username: String) {
      RankMitraPosKegSurvei(id: $id, survei_kd: $survei_kd, keg_kd: $keg_kd, branch_kd: $branch_kd, posisi_kd: $posisi_kd, username: $username) {
        __typename
        rankmitraposkegsurvei_id
        survei_kd
        keg_kd
        branch_kd
        posisi_kd
        username
        nilai
      }
    }
  `;
};

// RankMitra
/**
 * Kueri peringkat mitra/petugas (kategori:umum) secara keseluruhan
 * Pages: profile, rekrutmen\nilai\laporan\[kegiatan]
 * Component (Table\Rank): All, Annual
 * @param branch_kd
 * @param username
 * @param kategori_id
 * @return {RankMitra}[]
 */
export const useGetRankMitra = () => {
  return gql`
    query ($id: Int, $branch_kd: String, $username: String, $kategori_id: String) {
      RankMitra(id: $id, branch_kd: $branch_kd, username: $username, kategori_id: $kategori_id) {
        __typename
        rankmitra_id
        branch_kd
        username
        User {
          user_id
          username
          nama
          email
          is_pegawai
          UserRole {
            user_role_id
            username
            role_id
            status
          }
          MitraTahunKerja {
            mitratahunkerja_id
            username
            tahun
            status
          }
        }
        kategori_id
        nilai
        nilai_rerata
        created_at
        updated_at
      }
    }
  `;
};

/**
 * Membuat peringkat petugas saat penilaian selesai, atau melihat daftar peringkat keseluruhan atau tahunan
 * Pages: rekrutmen\nilai\laporan\[kegiatan]
 * Component (Table\Rank): All, Annual
 * @return {RankMitra}[]
 */

export const useCreateRankMitra = () => {
  return gql`
    mutation ($input: RankMitraInputType!) {
      createRankMitra(input: $input) {
        rankmitra_id
        branch_kd
        username
        kategori_id
        nilai
        nilai_rerata
      }
    }
  `;
};

/**
 * Mengubah peringkat mitra (secara keseluruhan) ketika nilai dari kegiatan baru, maka peringkat perlu diupdate. OPerator harus mengklik "Buat Ulang Peringkat"
 * Component (Table\Rank): All, Annual
 * @param {RankMitraInputType} input
 * @param {int} id
 * @return {RankMitra}[]
 */
export const useUpdateRankMitra = () => {
  return gql`
    mutation ($id: Int!, $input: RankMitraInputType!) {
      updateRankMitra(id: $id, input: $input) {
        rankmitra_id
        branch_kd
        username
        kategori_id
        nilai
        nilai_rerata
        created_at
        updated_at
      }
    }
  `;
};

/**
 * kueri peringkat tahunan mitra/petugas berdasarkan tahun
 * Components (Table\Rank): Annual
 * @returns {rankmitratahunkerja_id, branch_kd, username, tahun, nilai, kategori_id, created_at, updated_at} []
 */
export const useGetRankMitraTahunKerja = () => {
  return gql`
    query ($id: Int, $branch_kd: String, $username: String, $tahun: String) {
      RankMitraTahunKerja(id: $id, branch_kd: $branch_kd, username: $username, tahun: $tahun) {
        rankmitratahunkerja_id
        branch_kd
        username
        tahun
        nilai
        kategori_id
        created_at
        updated_at
      }
    }
  `;
};

/**
 * Membuat peringkat tahunan petugas, digenerate operator dengan klik "Buat Peringkat"
 * Components (Table\Rank): Annual
 * @returns {RankMitraTahunKerja}[]
 * @input {branch_kd: String!,username: String!,tahun: String!,kategori_id: Int!,nilai: Float}
 */
export const useCreateRankMitraTahunKerja = () => {
  return gql`
    mutation ($input: RankMitraTahunKerjaInputType!) {
      createRankMitraTahunKerja(input: $input) {
        rankmitratahunkerja_id
        branch_kd
        username
        tahun
        nilai
        kategori_id
        created_at
        updated_at
      }
    }
  `;
};

/**
 * Mengubah peringkat ketika operator mengklik "Buat Ulang Peringkat"
 * Components (Table\Rank): Annual
 * @input input: {branch_kd: String!,username: String!,tahun: String!,kategori_id: Int!,nilai: Float}
 * @input id: Int!
 * @returns {RankMitraTahunKerja}[]
 */
export const useUpdateRankMitraTahunKerja = () => {
  return gql`
    mutation ($id: Int!, $input: RankMitraTahunKerjaInputType!) {
      updateRankMitraTahunKerja(id: $id, input: $input) {
        rankmitratahunkerja_id
        branch_kd
        username
        tahun
        nilai
        kategori_id
        created_at
        updated_at
      }
    }
  `;
};

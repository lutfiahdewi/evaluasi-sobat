/**
 * Composable for getting GraphQL queries
 * Login
 * List item:
 * 1. Kategori
 * 2. Indikator
 */

// Login => argumen email and password
export const useLogin = () => {
  const query = gql`
    mutation ($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        token
        user {
          username
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

// Getting all kategori data
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
// input: id
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

// Creating a kategori
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

//Deleting a kategori (and connection to kategoriIndikator)
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

// Creating an indikator
export const useCreateIndikator = () => {
  const query = gql`
    mutation createIndikator($input: IndikatorInputType!) {
      createIndikator(input: $input) {
        indikator_id
      }
    }
  `;
  return query;
};

// Creating an indikator nested (a kategoriIndikator directly connected)
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

// Getting all kategori data
// Data berupa nama, id kategori beserta indikator2 terkait
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

// Getting all indicators data
// Data berupaka nama indikator, id dan kategori terkait
export const useTableIndicators = () => {
  const query = gql`
    query {
      allIndikatorNested {
        indikator_id
        nama
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
 * Survei
 * @returns
 */
export const useCreateSurvei = () => {
  return gql`
    mutation ($kode: String!, $nama: String!, $tahun: String!, $tipe: Int!, $unit_kd: String) {
      createSurvei(kode: $kode, nama: $nama, tahun: $tahun, tipe: $tipe, unit_kd: $unit_kd) {
        __typename
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
 * Kegiatan
 */
// Get all or single kegiatan
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

/**
 * Posisi
 */
// Get all or single posisi
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

/**
 * KegSurvei
 */
//create
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
// get
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

/**
 * PosKegSurvei
 */

//Create
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

//get

/**
 * JumPosisiPetugasKegSurvei
 */

// create
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
// query
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
        jumlah
        is_confirmed
      }
    }
  `;
};
// serach by
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
// update
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

/**
 * Petugas Survey
 *
 */

// Create

// Get
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
// create

// create many
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
 * Penugasan Struktur
 * @returns
 * @param input: What?
 */
//get
//create
//create many
export const useCreateManyPenugasanStruktur = () => {
  return gql`
    mutation ($input: PenugasanStrukturInputType!, $usernames: [String]!) {
      createManyPenugasanStruktur(input: $input, usernames: $usernames) {
        penugasanstruktur_id
      }
    }
  `;
};
// search(query by filtering )
export const useSearchPenugasanStruktur = () => {
  return gql`
    query ($keg_kd: String!, $branch_kd: String!, $posisi_kd: String!) {
      searchPenugasanStruktur(keg_kd: $keg_kd, branch_kd: $branch_kd, posisi_kd: $posisi_kd) {
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
// Query optional filtering
export const useGetPenugasanStruktur = () => {
  return gql`
    query ($id: Int, $keg_kd: String, $branch_kd: String, $posisi_kd: String) {
      PenugasanStruktur(id: $id, keg_kd: $keg_kd, branch_kd: $branch_kd, posisi_kd: $posisi_kd) {
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
 * Nilai Kategori Indikator
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
// get
export const useGetNilaiKategoriIndikator = () => {
  return gql`
    query ($id: Int, $survei_kd: String, $keg_kd: String, $branch_kd: String, $posisi_kd: String, $username: String, $tahun: String) {
      NilaiKategoriIndikator(id: $id, survei_kd: $survei_kd, keg_kd: $keg_kd, branch_kd: $branch_kd, posisi_kd: $posisi_kd, username: $username, tahun: $tahun) {
        __typename
        nilaikategoriindikator_id
        survei_kd
        keg_kd
        branch_kd
        posisi_kd
        username
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

// update
/**
 * @returns id, nilai, is_final
 *
 * @param single update: id should have is_final
 * @param
 * batch update: input where there are list of kategoriIndikator_id and nilai, both should have same length.
 *
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

// RankMitraPosKeg
/**
 * CreateRankMitraPosKegSurvei
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
 * @returns 
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
// query
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

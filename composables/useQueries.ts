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
          user_id
          username
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

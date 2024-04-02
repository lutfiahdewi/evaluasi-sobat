/*import { defineEventHandler, useFetch } from 'nuxt/app'

export const useFetchData = async (url: string) => {
  const { data } = await useFetch(url)
  return data
}

export const useFormatData = (data: any) => {
  // Function to format the fetched data
  // ...
  return formattedData;
}*/

// Getting all kategori data
export const useGetAllKategori = () => {
  const query = gql`
    query {
      allKategori {
        nama
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
      allKategoriNested {
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

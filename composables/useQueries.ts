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
}

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
}

// Creating an indikator
export const useCreateIndikator = () => {
	const query =gql`
  mutation createIndikator($input: IndikatorInputType!) {
    createIndikator(input: $input) {
      indikator_id
    }
  }
`;
return query;
}

// Creating an indikator nested (a kategoriIndikator directly connected)
export const useCreateIndikatorNested = () => {
  const query =gql`
  mutation ($input: IndikatorNestedInputType!) {
    createIndikatorNested (
        input: $input
    ) {
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
}
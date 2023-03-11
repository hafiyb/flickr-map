import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const key = process.env.REACT_APP_FLICKR_API_KEY;

export const flickrApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://www.flickr.com/services/rest/',
  }),
  endpoints: (builder) => ({
    getBrands: builder.query({
      query: () => {
        let formData = new FormData();
        formData.append('api_key', key);
        formData.append('method', 'flickr.cameras.getBrands');
        formData.append('format', 'json');
        formData.append('nojsoncallback', '1');
        return {
          method: 'POST',
          body: formData,
        };
      },
    }),
    getModels: builder.query({
      query: () => {
        let formData = new FormData();
        formData.append('api_key', key);
        formData.append('method', 'flickr.cameras.getBrandModels');
        formData.append('brand', 'apple');
        formData.append('format', 'json');
        formData.append('nojsoncallback', '1');
        return {
          method: 'POST',
          body: formData,
        };
      },
    }),
  }),
});

// flickrApi.enhanceEndpoints

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetPokemonByNameQuery,
  useGetBrandsQuery,
  useLazyGetModelsQuery
} = flickrApi;

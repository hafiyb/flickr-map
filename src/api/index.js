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
      query: (brand) => {
        let formData = new FormData();
        formData.append('api_key', key);
        formData.append('method', 'flickr.cameras.getBrandModels');
        formData.append('brand', brand);
        formData.append('format', 'json');
        formData.append('nojsoncallback', '1');
        return {
          method: 'POST',
          body: formData,
        };
      },
    }),
    getPhotos: builder.query({
      query: (model) => {
        let formData = new FormData()
        formData.append('api_key', key);
        formData.append('method', 'flickr.photos.search');
        formData.append('media', 'photos');
        formData.append('privacy_filter', '1');
        formData.append('tags', model.toString());
        formData.append('has_geo', '1');
        formData.append('accuracy', '11');
        formData.append('extras', 'geo');
        formData.append('per_page', '10');
        formData.append('page', '1');
        formData.append('format', 'json');
        formData.append('nojsoncallback', '1');

        return{
          method: 'POST',
          body: formData
        }
      }
    }),
  }),
});


// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetPokemonByNameQuery,
  useGetBrandsQuery,
  useLazyGetModelsQuery,
  useLazyGetPhotosQuery,
  useLazyGetPhotoLocationQuery,
} = flickrApi;

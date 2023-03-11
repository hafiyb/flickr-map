import { configureStore } from '@reduxjs/toolkit';
import { flickrApi } from '../api';
import cameraSlice from './slices/camera';

export const store = configureStore({
  reducer: {
    camera: cameraSlice.reducer,
    
    [flickrApi.reducerPath]: flickrApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(flickrApi.middleware),
})
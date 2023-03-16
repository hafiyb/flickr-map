import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  brands: [],
  selectedBrands: [],
  fetchedModelBrands: [],
  models: [],
  selectedModels: [],
  photos: [],
  selectedPhoto: {},
  maxPages: 0,
  currentPage: 1,
};

export const cameraSlice = createSlice({
  name: 'camera',
  initialState,
  reducers: {
    setBrands: (state, { payload }) => {
      state.brands = payload;
    },
    setSelectedBrands: (state, { payload }) => {
      state.selectedBrands = payload;
    },
    setModels: (state, { payload }) => {
      state.models = [...state.models, ...payload];
      state.fetchedModelBrands = [
        ...state.fetchedModelBrands,
        payload[0].brand,
      ];
    },
    clearModels: (state) => {
      state.models = [];
      state.fetchedModelBrands = [];
    },
    setSelectedModels: (state, { payload }) => {
      state.selectedModels = payload;
    },
    setPhotos: (state, { payload }) => {
      state.photos = payload.photo;
      state.maxPages = payload.pages;
      state.currentPage = payload.page;
    },
    setSelectedPhoto: (state, { payload }) => {
      state.selectedPhoto = { ...state.photos[payload], index: payload };
    },
  },
});

export const {
  setBrands,
  setSelectedBrands,
  setModels,
  setSelectedModels,
  setPhotos,
  clearModels,
  setSelectedPhoto,
} = cameraSlice.actions;

export default cameraSlice;

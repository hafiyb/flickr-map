import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  brands: [],
  selectedBrands: [],
  models: [],
  selectedModels: [],
  photos: []
};

export const cameraSlice = createSlice({
  name: 'camera',
  initialState,
  reducers: {
    setBrands: (state, { payload }) => {
      state.brands = payload;
    },
    setSelectedBrands: (state, {payload}) => {
      state.selectedBrands = payload
    },
    setModels: (state, { payload }) => {
      state.models = payload;
    },
    setSelectedModels: (state, {payload}) => {
      state.selectedModels = payload
    },
    setPhotos: (state, {payload}) => {
      state. photos = payload
    }
  },
});

export const { setBrands, setSelectedBrands, setModels, setSelectedModels, setPhotos } = cameraSlice.actions;

export default cameraSlice

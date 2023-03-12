import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  brands: [],
  selectedBrands: [],
  models: [],
  selectedModels: []
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
  },
});

export const { setBrands, setSelectedBrands, setModels } = cameraSlice.actions;

export default cameraSlice

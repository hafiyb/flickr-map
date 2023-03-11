import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  brands: [],
  models: [],
};

export const cameraSlice = createSlice({
  name: 'camera',
  initialState,
  reducers: {
    setBrands: (state, { payload }) => {
      state.brands = payload;
    },
    setModels: (state, { payload }) => {
      state.models = payload;
    },
  },
});

export const { setBrands, setModels } = cameraSlice.actions;

export default cameraSlice

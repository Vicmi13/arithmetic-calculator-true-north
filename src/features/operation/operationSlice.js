import { createSlice } from "@reduxjs/toolkit";

export const operationSlice = createSlice({
  name: "operation",
  initialState: {
    operationList: [],
    newOperationRegistered: false,
  },
  reducers: {
    saveOperationList: (state, { payload }) => {
      state.operationList = payload;
    },
    operationRegistered: (state) => {
      const currentState = state.newOperationRegistered;
      state.newOperationRegistered = !currentState;
    },
  },
});

export const { saveOperationList, operationRegistered } =
  operationSlice.actions;
export const selectOperationList = (state) => state.operation.operationList;
export const selectOperationRegistered = (state) =>
  state.operation.newOperationRegistered;

export default operationSlice.reducer;

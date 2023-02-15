import { createSlice } from "@reduxjs/toolkit";

export const operationSlice = createSlice({
  name: "operation",
  initialState: {
    operationList: [],
  },
  reducers: {
    saveOperationList: (state, { payload }) => {
      console.log("payload", payload);
      state.operationList = payload;
    },
  },
});

export const { saveOperationList } = operationSlice.actions;
export const selectOperationList = (state) => state.operation.operationList;
export default operationSlice.reducer;

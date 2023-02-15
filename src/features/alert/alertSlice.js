import { createSlice } from "@reduxjs/toolkit";

export const alertSlice = createSlice({
  name: "alert",
  initialState: {
    severity: "info",
    message: "",
    time: 5000,
    isAlertOpen: false,
  },
  reducers: {
    showAlert: (state) => {
      state.isAlertOpen = true;
    },
    hideAlert: (state) => {
      state.isAlertOpen = false;
    },
    alertDetail: (state, { payload }) => {
      const { severity, message, time } = payload;
      state.severity = severity;
      state.message = message;
      state.time = time;
    },
  },
});

export const { alertDetail, showAlert, hideAlert } = alertSlice.actions;
export const selectIsAlertOpen = (state) => state.alert.isAlertOpen;
export const selectMessage = (state) => state.alert.message;
export const selectSeverity = (state) => state.alert.severity;
export default alertSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

export const authenticationSlice = createSlice({
  name: "authentication",
  initialState: {
    userToken: localStorage.getItem("auth") || "",
    isUserLogged: localStorage.getItem("auth") ? true : false,
  },
  reducers: {
    storeToken: (state, { payload }) => {
      // console.log("payload", payload);
      state.userToken = payload.token || payload.refreshedToken;
      localStorage.setItem("auth", payload.token || payload.refreshedToken);
    },
    removeToken: (state) => {
      state.userToken = localStorage.removeItem("auth");
    },
    modifiedStatusUserLogged: (state) => {
      state.isUserLogged = !state.isUserLogged;
    },
  },
});

export const { storeToken, removeToken, modifiedStatusUserLogged } =
  authenticationSlice.actions;
export const selectUserToken = (state) => state.authentication.userToken;
export const selectIsUserLogged = (state) => state.authentication.isUserLogged;
export default authenticationSlice.reducer;

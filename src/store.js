import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import alertReducer from "./features/alert/alertSlice";
import operationReducer from "./features/operation/operationSlice";

export default configureStore({
  reducer: {
    authentication: authReducer,
    alert: alertReducer,
    operation: operationReducer,
  },
});

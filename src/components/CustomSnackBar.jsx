import * as React from "react";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useSelector, useDispatch } from "react-redux";
import {
  selectIsAlertOpen,
  showAlert,
  selectMessage,
  selectSeverity,
  hideAlert,
} from "../features/alert/alertSlice";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const CustomizedSnackbars = () => {
  const dispatch = useDispatch();
  const selectorAlertOpen = useSelector(selectIsAlertOpen);
  const selectorSeverity = useSelector(selectSeverity);
  const selectorMessage = useSelector(selectMessage);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch(hideAlert());
  };

  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={selectorAlertOpen}
        autoHideDuration={4000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={selectorSeverity}
          sx={{ width: "100%" }}
        >
          {selectorMessage}
        </Alert>
      </Snackbar>
    </Stack>
  );
};

export default CustomizedSnackbars;

import React, { useState, useEffect, useRef } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router";
import "./Login.css";
import validateLoginCredentials from "../services/AuthService";
import { useSelector, useDispatch } from "react-redux";
import {
  storeToken,
  selectIsUserLogged,
  modifiedStatusUserLogged,
  selectUserToken,
} from "../features/auth/authSlice";
import { showAlert, alertDetail } from "../features/alert/alertSlice";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";

const LoginForm = () => {
  const [credentials, setcredentials] = useState({});
  const formRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userToken = useSelector(selectUserToken);
  const selectIsUserLoggedIn = useSelector(selectIsUserLogged);

  useEffect(() => {
    // console.log("selectIsUserLogged", selectIsUserLoggedIn);
    if (selectIsUserLoggedIn) navigate("/dashboard");
  }, []);

  const handleInput = ({ target: { name, value } }) =>
    setcredentials({ ...credentials, [name]: value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await validateLoginCredentials(credentials);
      dispatch(storeToken(data));
      dispatch(modifiedStatusUserLogged());
      navigate("/dashboard");
    } catch (error) {
      let message = "";
      if (!!error.response) {
        const { data } = error.response;
        console.log("error data", data);
        message = data.errorDetail;
      } else message = "Error in request, please try later";
      dispatch(alertDetail({ severity: "error", message }));
      dispatch(showAlert());
    }
  };

  return (
    <ValidatorForm
      ref={formRef}
      onSubmit={handleSubmit}
      onError={(errors) => console.log(errors)}
    >
      <div className="login-container">
        <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>

        <TextValidator
          variant="outlined"
          margin="normal"
          fullWidth
          label="Email"
          name="email"
          autoComplete="off"
          autoFocus
          onChange={handleInput}
          value={credentials.email || ""}
          validators={["required", "isEmail"]}
          errorMessages={[
            "Email is required",
            "The email is not in valid format",
          ]}
          inputProps={{
            maxLength: 40,
          }}
        />
        <TextValidator
          margin="normal"
          fullWidth
          name="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          onChange={handleInput}
          value={credentials.password || ""}
          validators={["required"]}
          errorMessages={["Password is required"]}
          inputProps={{
            maxLength: 30,
          }}
        />

        <Button variant="contained" type="submit">
          Submit
        </Button>
      </div>
    </ValidatorForm>
  );
};

export default LoginForm;

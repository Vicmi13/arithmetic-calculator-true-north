import React, { useState, useEffect, useRef } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import "./Login.css";

import { useNavigate } from "react-router";
import backgroundImage from "../../assets/login.png";
import validateLoginCredentials from "../../services/AuthService";
import { useSelector, useDispatch } from "react-redux";
import {
  storeToken,
  selectIsUserLogged,
  modifiedStatusUserLogged,
  selectUserToken,
} from "../../features/auth/authSlice";
import { showAlert, alertDetail } from "../../features/alert/alertSlice";

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
    <Grid container className="login-container" spacing={1}>
      <Grid item xs={12} sm={5} md={6} lg={5}>
        <Card elevation={3} className="card-login">
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <Typography className="title" component="h1" variant="h3">
              Welcome!
            </Typography>

            <Typography className="subtitle" variant="subtitle1">
              Access to your account
            </Typography>

            <ValidatorForm
              className="login-form"
              ref={formRef}
              onSubmit={handleSubmit}
              onError={(errors) => console.log(errors)}
            >
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

              <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
              >
                <Button type="submit" variant="contained" color="primary">
                  Iniciar sesión
                </Button>
              </Grid>
            </ValidatorForm>
          </Grid>
        </Card>
      </Grid>
      <Grid
        item
        component={Box}
        xs={12}
        sm={7}
        md={6}
        lg={7}
        display={{ xs: "none", sm: "block" }}
        style={{
          overflow: "hidden",
        }}
      >
        <img src={backgroundImage} className="background-image" alt="" />
      </Grid>
    </Grid>
  );
};

export default LoginForm;

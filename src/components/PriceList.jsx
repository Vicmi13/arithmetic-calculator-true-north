import React, { useEffect, useState } from "react";
import "./price-list.css";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import recoverAllOperations from "../services/OperationService";
import { addDecimalValues, typeOperationFormat } from "../utils/operations";
import { useSelector, useDispatch } from "react-redux";
import {
  modifiedStatusUserLogged,
  removeToken,
  selectUserToken,
  storeToken,
} from "../features/auth/authSlice";
import { addAuthorizationToHeader } from "../utils/request";
import { alertDetail, showAlert } from "../features/alert/alertSlice";
import { saveOperationList } from "../features/operation/operationSlice";
import { useNavigate } from "react-router";

const PriceList = () => {
  const userToken = useSelector(selectUserToken);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const customHeader = addAuthorizationToHeader(userToken);
        const { data } = await recoverAllOperations(customHeader);
        console.log("recoverAllOperations", data);
        if (!!data.operations) {
          setOperationList(data.operations);
          dispatch(saveOperationList(data.operations));
        }
        if (!!data.refreshedToken) {
          dispatch(storeToken(data));
        }
      } catch (error) {
        const { data } = error.response;

        if (
          data.message === "TokenExpiredError" ||
          data.message === "JsonWebTokenError"
        ) {
          setTimeout(() => {
            dispatch(removeToken());
            dispatch(modifiedStatusUserLogged());
            navigate("/login");
          }, 3000);
          data.errorDetail = data.errorDetail + " so the session will close";
          //
        }
        
        dispatch(
          alertDetail({
            severity: "error",
            message: data.errorDetail || data,
          })
        );
        dispatch(showAlert());
      }
    })();
  }, []);

  const [operationList, setOperationList] = useState([]);
  return (
    <section className="price-list-section">
      <Typography variant="h5" m={1} color="#3385ff">
        List prices
      </Typography>
      <Grid container>
        {operationList.map((operation) => (
          <Grid
            key={operation.id}
            className="grid"
            item
            xs={12}
            md={6}
            textAlign="center"
          >
            <Typography component="div" variant="subtitle1">
              {typeOperationFormat(operation.type)} {"  "}
            </Typography>
            <Typography component="div" variant="body1" color="text.secondary">
              $ {addDecimalValues(operation.cost, 2)}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </section>
  );
};

export default PriceList;

import React, { useEffect, useState } from "react";
import "./price-list.css";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import recoverAllOperations from "../services/OperationService";
import { addDecimalValues, typeOperationFormat } from "../utils/operations";
import { useSelector, useDispatch } from "react-redux";
import { selectUserToken, storeToken } from "../features/auth/authSlice";
import { addAuthorizationToHeader } from "../utils/request";
import { alertDetail, showAlert } from "../features/alert/alertSlice";
import { saveOperationList } from "../features/operation/operationSlice";

const PriceList = () => {
  const userToken = useSelector(selectUserToken);
  const dispatch = useDispatch();

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
        console.log("Error recover operation info", error);
        const { data } = error.response;
        console.log("error data", data);

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
    <section>
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

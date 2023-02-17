import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { OPERATOR_BUTTONS } from "../../constants/calculator-buttons";
import { alertDetail, showAlert } from "../../features/alert/alertSlice";
import { selectUserToken, storeToken } from "../../features/auth/authSlice";
import {
  selectOperationList,
  operationRegistered,
} from "../../features/operation/operationSlice";
import { createOperationRecord } from "../../services/RecordService";
import { addAuthorizationToHeader } from "../../utils/request";
import "./calculator.css";

const Calculator = ({ userBalance, userId, setBalance }) => {
  const selectorUserToken = useSelector(selectUserToken);
  const selectorOperationList = useSelector(selectOperationList);
  const dispatch = useDispatch();

  const [output, setOutput] = useState(0);
  const [firstValue, setfirstValue] = useState(0);
  const [secondValue, setSecondValue] = useState(0);
  const [operationSelected, setoperationSelected] = useState("");
  const [operationInProgress, setOperationInProgress] = useState(false);
  const [operationResponse, setOperationResponse] = useState(false);

  useEffect(() => {
    if (operationInProgress) {
      createNewRecord();
    }
  }, [operationInProgress]);

  const createNewRecord = async () => {
    if (selectorOperationList.length) {
      const customHeader = addAuthorizationToHeader(selectorUserToken);

      const { id, cost } = selectorOperationList.find(
        (element) => element.type === operationSelected
      );
      if (userBalance >= cost) {
        try {
          const body = {
            amount: cost,
            valueOne: firstValue,
            valueTwo: secondValue,
            userBalance,
            operationId: id,
            userId,
          };
          const { data } = await createOperationRecord(customHeader, body);
          const {
            result,
            result: { user_balance, operation_response, operationId },
          } = data;
          if (!!data.refreshedToken) {
            dispatch(storeToken(data));
          }

          /** SCENARIO for random-string */
          if (operationId === 6)
            showInfoForRandomString(user_balance, operation_response);
          else {
            setOutput(operation_response);
          }
          setOperationInProgress(false);
          setBalance(user_balance);
          setOperationResponse(true);

          dispatch(operationRegistered());
        } catch (error) {
          // const { data } = error.response;
          // console.log("Error create new record", data);
          dispatch(
            alertDetail({
              severity: "error",
              message: data.errorDetail || error,
            })
          );
          dispatch(showAlert());
        }
      } else {
        dispatch(
          alertDetail({
            severity: "warning",
            message:
              'You don"t have enough credit to make this request, please contact the admin',
          })
        );
        dispatch(showAlert());
      }
    } else {
      console.log("Error retrieving catalog information, please try again");
    }
  };

  const calculateSquareRoot = (operation) => {
    setOperationInProgress(true);
    setoperationSelected(operation);
    setSecondValue(output);
  };

  const generateRandomString = (operation) => {
    setOperationInProgress(true);
    setoperationSelected(operation);
  };

  const showInfoForRandomString = (userBalance, operationResponse) => {
    setOutput(0);
    dispatch(showAlert());
    dispatch(
      alertDetail({
        severity: "success",
        message: `Random string generated: ${operationResponse} successfully`,
      })
    );
  };

  const handleButtonSelected = ({ operation, symbol, id }) => {
    if (!!id) {
      if (id === 7) {
        setOperationInProgress(true);
        setSecondValue(output);
      } else if (id === 5) {
        /**SCENARIO for square-root */
        calculateSquareRoot(operation);
      } else if (id === 6) {
        /**SCENARIO for random-string */
        generateRandomString(operation);
      } else if (id === 8) {
        /**SCENARIO for A/C button - DISABLED */
        return;
      } else {
        if (operationSelected === id) {
          setOperationInProgress(true);
          setSecondValue(output);
        } else {
          setoperationSelected(operation);
          setfirstValue(output);
          setOutput(0);
        }
      }
    } else {
      if (operationResponse) {
        setOutput(0);
        setOperationResponse(false);
      }

      if (output) {
        setOutput((output) => output + symbol.toString());
      } else setOutput(symbol);
    }
  };

  return (
    <div className="calculator">
      <div className="calculator__output">{output}</div>

      <div className="calculator__keys">
        {OPERATOR_BUTTONS.map((element, i) => (
          <button
            key={i}
            className={
              element.type
                ? `calculator__key calculator__key${element.type}`
                : "calculator__key"
            }
            onClick={() => {
              //  handleButtonSelected(element.operation, element.symbol);
              handleButtonSelected(element);
            }}
          >
            {element.symbol}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Calculator;

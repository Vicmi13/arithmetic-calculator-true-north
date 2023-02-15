import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { OPERATOR_BUTTONS } from "../constants/calculator-buttons";
import { selectOperationList } from "../features/operation/operationSlice";
import { calculateOperation } from "../utils/operations";
import "./calculator.css";

const Calculator = ({ userBalance, userId }) => {
  const [output, setOutput] = useState(0);
  const [firstValue, setfirstValue] = useState(0);
  const [secondValue, setSecondValue] = useState(0);
  const [operationSelected, setoperationSelected] = useState("");
  const [operationInProgress, setOperationInProgress] = useState(false);

  const selectorOperationList = useSelector(selectOperationList);

  useEffect(() => {
    if (operationInProgress) {
      console.log("firstValue", firstValue);
      console.log("secondValue", secondValue);
      console.log("operationSelected", operationSelected);
      createNewRecord();
    }
  }, [operationInProgress]);

  const createNewRecord = async () => {
    if (selectorOperationList.length) {
      const { id, cost } = selectorOperationList.find(
        (element) => element.type === operationSelected
      );
      const body = {
        amount: cost,
        valueOne: firstValue,
        valuetwo: secondValue,
        userBalance,
        operationId: id,
        userId,
      };

      console.log("body", body);
      // await make REQUEST
    } else {
      console.log("Error retrieving catalog information, please try again");
    }
  };

  const handleButtonSelected = ({ operation, symbol, id }) => {
    if (!!id) {
      if (id === 7) {
        setOperationInProgress(true);
        setSecondValue(output);
      } else {
        if (operationSelected === id) {
          console.log("HACER REQUEST");
          setOperationInProgress(true);
          setSecondValue(output);
        } else {
          // setoperationSelected(id);
          setoperationSelected(operation);
          setfirstValue(output);
          setOutput(0);
        }
      }
    } else {
      if (output) {
        setOutput((output) => output + symbol.toString());
      } else setOutput(symbol);
    }
  };

  return (
    // TODO reduce calculator size
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

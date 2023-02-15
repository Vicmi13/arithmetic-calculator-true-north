export const calculateOperation = (
  prevOperation,
  actualOperation,
  accumulator,
  currentValue
) => {
  let result = 0;
  const sanitize = parseInt(currentValue);

  /** ENTER  OPERATION */
  if (prevOperation === "enter") {
    console.log("prevOPE", prevOperation);
    console.log("actualOperation", actualOperation);
    result = accumulator;
  }

  /** ENTER  AFTER OPERATION */
  if (actualOperation === "enter") {
    console.log("PREV ENTER DO OPER", prevOperation);
    console.log("ACTUAL ENTER DO OPER", actualOperation);
    // prevOperation = actualOperation;
  }

  /** SPECIAL SCENARIO */
  if (actualOperation === "square-root") {
    console.log("SQUARE");
    if (accumulator) {
      result = Math.sqrt(accumulator);
    }
    prevOperation = "";
  }

  /** SPECIAL SCENARIO */
  if (actualOperation === "random-string") {
    console.log("generate RANDOM value");
    result = "aswewda";
    prevOperation = "";
  }

  switch (prevOperation) {
    case "addition":
      console.log("ADDITION");
      result = sanitize + accumulator;
      break;

    case "substraction":
      console.log("SUBSTRACTION");
      result = accumulator - sanitize;
      break;

    case "multiplication":
      console.log("MULTI");
      result = accumulator * sanitize;
      break;

    case "division":
      console.log("DIVISION");
      result = accumulator / sanitize;
      break;

    default:
      break;
  }
  return hasDecimalValues(result) ? result.toFixed(2) : result;
};

const hasDecimalValues = (value) => {
  if (typeof value === "number") {
    return value % 1 != 0;
  } else return false;
};

export const typeOperationFormat = (word) =>
  word.charAt(0).toUpperCase() + word.slice(1);

export const addDecimalValues = (value, decimal) => {
  const dec = value.toString().split(".")[1];
  const len = dec && dec.length > decimal ? dec.length : decimal;
  return Number(value).toFixed(len);
};

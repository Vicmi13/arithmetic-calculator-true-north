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

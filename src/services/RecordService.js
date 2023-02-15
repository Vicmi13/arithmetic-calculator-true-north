import axios from "axios";

export const retrieveLatestRecordByUser = async (headerObject, id) => {
  return await axios.get(
    `${import.meta.env.VITE_BASE_URL_DEV}/record/last-operation/${id}`,
    headerObject
  );
};

export const createOperationRecord = async (headerObject, body) => {
  return await axios.post(
    `${import.meta.env.VITE_BASE_URL_DEV}/record`,
    body,
    headerObject
  );
};

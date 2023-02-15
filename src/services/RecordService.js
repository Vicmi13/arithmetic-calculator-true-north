import axios from "axios";

export const getRecordsByUser = async (headerObject, params) => {
  const { page, pageSize, userId, sort } = params;

  const config = {
    headers: { Authorization: headerObject.headers["Authorization"] },
    params: {
      pageSize,
      page,
      userId,
    },
  };
  return await axios.get(`${import.meta.env.VITE_BASE_URL_DEV}/record`, config);
};

export const getLatestRecordByUser = async (headerObject, id) => {
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

export const deleteRecord = async (headerObject, id) => {
  return await axios.patch(
    `${import.meta.env.VITE_BASE_URL_DEV}/record/${id}`,
    null,
    headerObject
  );
};

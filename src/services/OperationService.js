import axios from "axios";

const recoverAllOperations = async (headerObject) => {
  return await axios.get(
    `${import.meta.env.VITE_BASE_URL_DEV}/operation`,
    headerObject
  );
};

export default recoverAllOperations;

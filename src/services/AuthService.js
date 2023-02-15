import axios from "axios";

const validateLoginCredentials = async ({ email, password }) => {
  return await axios.post(`${import.meta.env.VITE_BASE_URL_DEV}/login`, {
    email,
    password,
  });
};

export default validateLoginCredentials;

export const addAuthorizationToHeader = (token) => {
  const customObject = { headers: {} };
  customObject.headers["Authorization"] = token;

  return customObject;
};

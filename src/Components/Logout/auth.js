import loginConfig from "../Login/credentials";

export const isAuthenticated = () => {
  const storedUsername = localStorage.getItem("username");
  return storedUsername === loginConfig.REACT_APP_USERNAME;
};

// import axio from "axios";

// const AUTH_URL = "http://localhost:8080/auth";

// export const login = async (userData) => {
//     return axio.post(`{AUTH_URL/login}`,userData)
// }

import axios from "axios";

const AUTH_URL = "http://localhost:8080/auth";

export const fetchCurrentUser = async () => {
  const response = await axios.get("/me"); // Adjust your backend endpoint
  return response.data;
};

export const login = async (userData) => {
  return axios.post(`${AUTH_URL}/login`, userData, {
    withCredentials: true, // required for sending session cookie
  });
};

export const logout = async () => {
    return axios.post(`${AUTH_URL}/logout`, {}, {
      withCredentials: true,
    });
  };
  

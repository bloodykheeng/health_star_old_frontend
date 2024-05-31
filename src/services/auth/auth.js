import axiosAPI from "../axiosApi";
import axios from "axios";

const csrf = () => axiosAPI.get("/sanctum/csrf-cookie");

export async function getCsrf(data) {
    const response = await axios.get("http://localhost:8000/sanctum/csrf-cookie", {
        withCredentials: true,
        timeout: 50000,
        headers: {
            Authorization: null,
            "Content-Type": "application/json",
            accept: "application/json",
        },
    });
    return response;
}

export async function getUserService(data) {
    //   await csrf();
    const response = await axiosAPI.get("/user");
    return response;
}

// donnt iclude the word api on routes its alraedy configures in axios api.js
// export async function loginService(data) {
//   console.log("am logging in");
//   //   await csrf();
//   const response = await axiosAPI.post("/api/login", data);
//   //   localStorage.setItem("user", response.data);

//   // console.log("response rrrrr : ", response);
//   // Assuming the login response has the token in the "token" field
//   const token = response.data?.data?.token;

//   // Set the token in the Authorization header for subsequent requests
//   axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

//   // Return the user data from the mutation
//   //   return response.data?.data?.user;
//   return response;
// }

// //forgot password
// export async function forgotPassword(email) {
//   const response = await axiosAPI.post("/api/forgot-password", {
//     email
//   });
//   return response;
// }

// export async function registerService(data) {
//   //   await csrf();
//   const response = await axiosAPI.post("/api/register", data);

//   return response;
// }

// export async function logoutService(data) {
//   await csrf();
//   const response = await axiosAPI.get("/api/logout");
//   return response;
// }

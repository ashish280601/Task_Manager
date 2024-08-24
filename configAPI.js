import axios from "axios";
// const hostUrl = "https://task-manager-api-ez3z.onrender.com";
const hostUrl = "http://localhost:7050";

export const axiosInstance = axios.create({
    baseURL: hostUrl
})

export default hostUrl;
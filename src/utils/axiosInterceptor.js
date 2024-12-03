import axios from "axios";

const isObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

const convertQueryString = (object) => {
  if (!object) return "";

  if (!isObject(object)) return "";

  if (!Object.values(object).length) return "";

  let queryParameters = [];

  for (let key in object) {
    if (!object[key]) continue;
    if (typeof object[key] !== "string") continue;
    queryParameters.push(`${key}=${object[key]}`);
  }

  if (!queryParameters.length) return "";

  return "?" + queryParameters.join("&");
};

export default async function axiosInterceptor({ method, url, query, data }) {
  try {
    if (!method) throw new Error("Method not provided");
    if (!url) throw new Error("Url not provided");

    let apiMethod = method.toLowerCase().trim();

    let apiUrl = "https://rentco-backend.lambaharsh01.in";

    apiUrl += url.trim() + convertQueryString(query);

    // Set up axios instance if needed for interceptors
    const axiosInstance = axios.create();

    // Request Interceptor (optional)
    axiosInstance.interceptors.request.use(
      (req) => {
        const token = localStorage.getItem("authToken");
        if (token) req.headers["Authorization"] = `Bearer ${token}`;
        return req;
      },
      (error) => Promise.reject(error)
    );

    // Response Interceptor (optional)
    axiosInstance.interceptors.response.use(
      (res) => {
        console.log(res);
        return res;
      },
      (error) => Promise.reject(error)
    );

    let response;

    switch (apiMethod) {
      case "get":
        response = await axiosInstance.get(apiUrl);
        break;
      case "post":
        response = await axiosInstance.post(apiUrl, data);
        break;
      case "put":
        response = await axiosInstance.put(apiUrl, data);
        break;
      case "delete":
        response = await axiosInstance.delete(apiUrl);
        break;
      default:
        throw new Error("Method not identified");
    }

    return response.data;
  } catch (error) {
    let statusMessage;

    let errorCode = error?.response?.status ?? 405;

    switch (errorCode) {
      case 400:
        statusMessage = "Bad Request";
        break;
      case 401:
        statusMessage = "Unauthorized";
        break;
      case 402:
        statusMessage = "Payment Required";
        break;
      case 403:
        statusMessage = "Forbidden";
        break;
      case 404:
        statusMessage = "Not Found";
        break;
      case 405:
        statusMessage = "Method Not Allowed";
        break;
      case 406:
        statusMessage = "Not Acceptable";
        break;
      case 407:
        statusMessage = "Proxy Authentication Required";
        break;
      case 408:
        statusMessage = "Request Timeout";
        break;
      case 409:
        statusMessage = "Conflict";
        break;
      case 413:
        statusMessage = "Payload Too Large";
        break;
      case 414:
        statusMessage = "URI Too Long";
        break;
      case 429:
        statusMessage = "Too Many Requests";
        break;
      default:
        statusMessage = "Network Error"; //"Internal Server Error";
        break;
    }

    if (errorCode === 401) {
      alert("Session expired please login again");
      localStorage.removeItem("authToken");
      window.location.href = "/";
    }

    let errorMessage =
      error?.response?.data?.message ?? error?.message ?? statusMessage;

    throw new Error(errorMessage);
  }
}

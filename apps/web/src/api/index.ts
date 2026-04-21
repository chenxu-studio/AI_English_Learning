import axios from "axios";
const timeout = 50000;
export const serverApi = axios.create({
  baseURL: "/api/v1",
  timeout,
});
export const aiApi = axios.create({
  baseURL: "/api/v1",
  timeout,
});

serverApi.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error),
);

aiApi.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error),
);
export interface Response<T = any> {
  data: T;
  code: number;
  message: string;
  success: boolean;
  path: string;
  timestamp: string;
}

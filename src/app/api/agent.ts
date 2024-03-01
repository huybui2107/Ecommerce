import axios, { AxiosError, AxiosResponse } from "axios";

axios.defaults.baseURL = "https://localhost:7224/api/";
axios.defaults.withCredentials = true;
const responseBody = (response: AxiosResponse) => response.data;

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    console.log("caught by interceptor");
    return Promise.reject(error.response);
  }
);

const requests = {
  get: (url: string) => axios.get(url).then(responseBody),
  post: (url: string, body: object) => axios.post(url, body).then(responseBody),
  put: (url: string, body: object) => axios.put(url, body).then(responseBody),
  delete: (url: string, body: object) =>
    axios.delete(url, body).then(responseBody),
};

const Catalog = {
  list: () => requests.get("Product"),
  detail: (id: number) => requests.get(`Product/${id}`),
};

const TestErrors = {
  get400Error: () => requests.get("bugggy/bad-request"),
  get401Error: () => requests.get("bugggy/unauthorized"),
  get404Error: () => requests.get("bugggy/not-found"),
  get500Error: () => requests.get("bugggy/server-error"),
  getValidateError: () => requests.get("bugggy/validation-error"),
};
const Basket = {
  getBasket: () => requests.get("Basket"),
  addItem: (productId: number, quantity = 1) =>
    requests.post(`Basket?productId=${productId}&quantity=${quantity}`, {}),
  removeItem: (productId: number, quantity = 1) =>
    requests.delete(`Basket?productId=${productId}&quantity=${quantity}`, {}),
};
const agent = {
  Catalog,
  TestErrors,
  Basket,
};

export default agent;

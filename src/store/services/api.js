import axios from "axios";
import camelcaseKeys from "camelcase-keys";
import Cookies from "js-cookie";
import snakecaseKeys from "snakecase-keys";

const api = {
  init() {
    axios.defaults.baseURL = "https://api.kenshuuexpress.id/api/v1/";
    // axios.defaults.baseURL = "http://127.0.0.1:8000/api/v1/";
    // axios.defaults.baseURL = "http://192.168.43.247:8000/api/v1/";
    axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
    axios.defaults.headers.common.Authorization =
      "Bearer " + Cookies.get("token");
  },
  post(resource, params) {
    return axios.post(`${resource}`, snakecaseKeys(params, { deep: true }), {
      transformResponse: [
        (data) => {
          if (data) {
            return camelcaseKeys(JSON.parse(data), {
              deep: true,
            });
          }
        },
      ],
    });
  },
};

export default api;

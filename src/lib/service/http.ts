import axios, { AxiosRequestConfig, AxiosInstance } from 'axios';

export const getAxiosInstance = (url: string, apiToken?: string): AxiosInstance => {
  const API = axios.create();

  API.defaults.baseURL = url;

  const axiosConfig = (config: AxiosRequestConfig): AxiosRequestConfig => {
    if (apiToken) {
      config.headers = {
        Authorization: `Bearer ${apiToken}`,
      };
    }
    return config;
  };

  API.interceptors.request.use(axiosConfig);

  return API;
};

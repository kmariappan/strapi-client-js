import axios, { AxiosRequestConfig, AxiosInstance } from 'axios';
//import axios, { AxiosRequestConfig, AxiosError, AxiosInstance } from 'axios';
//import { ApiError } from './types';

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

  /*   API.interceptors.response.use(
    response => response,
    (error: AxiosError) => {
      if (error.response) {
        console.log(error);
        const errorData: ApiError = {
          status: 0,
          message: error.response.statusText,
          name: '',
          details: '',
        };
        throw new Error(`${errorData.name} - ${errorData.message}`);
      }
    }
  ); */

  return API;
};

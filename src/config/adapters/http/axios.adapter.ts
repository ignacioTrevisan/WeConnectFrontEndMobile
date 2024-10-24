import axios, { AxiosInstance } from 'axios';
import { HttpAdapter } from './http.adapter';

interface Options {
    baseUrl: string;
    params: Record<string, string>;
}


export class AxiosAdapter implements HttpAdapter {

    private axiosInstance: AxiosInstance;

    constructor(options: Options) {
        this.axiosInstance = axios.create({
            baseURL: options.baseUrl,
            params: options.params,
        })
    }



    async get<T>(url: string, options?: Record<string, unknown> | undefined): Promise<T> {

        try {

            const { data } = await this.axiosInstance.get<T>(url, options);

            return data;

        } catch (error) {
            console.log(error);
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    throw new Error(error.response.data.msg || 'Error en la respuesta del servidor');
                } else {
                    console.log('Error de red o configuración:', error.message);
                }
            }
            throw new Error(`Error fetching post: ${url}`);
        }

    }

    async post<T>(url: string, options?: Record<string, unknown>): Promise<T> {
        try {
            const { data } = await this.axiosInstance.post<T>(url, options);
            return data;
        } catch (error) {
            console.log(error)
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    throw new Error(error.response.data.msg || 'Error en la respuesta del servidor');
                } else {
                    console.log('Error de red o configuración:', error.message);
                }
            }
            throw new Error(`Error fetching post: ${url}`);
        }
    }
    async put<T>(url: string, options?: Record<string, unknown> | undefined): Promise<T> {

        try {

            const { data } = await this.axiosInstance.put<T>(url, options);

            return data;

        } catch (error) {
            console.log(error)
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    throw new Error(error.response.data.msg || 'Error en la respuesta del servidor');
                } else {
                    console.log('Error de red o configuración:', error.message);
                }
            }
            throw new Error(`Error fetching put: ${url}`);
        }

    }

    async delete<T>(url: string, options?: Record<string, unknown> | undefined): Promise<T> {

        try {

            const { data } = await this.axiosInstance.delete<T>(url, options);

            return data;

        } catch (error) {
            console.log(error)
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    throw new Error(error.response.data.msg || 'Error en la respuesta del servidor');
                } else {
                    console.log('Error de red o configuración:', error.message);
                }
            }
            throw new Error(`Error fetching put: ${url}`);
        }

    }






}


import { AxiosAdapter } from "./http/axios.adapter";


export const WeConnectFetcher = new AxiosAdapter({
    baseUrl: 'http://192.168.0.104:4000/api/', params: {

        //RECORDAR QUE AL CAMBIAR EL BASEURL LLEVA HTTPS, EN LOCALHOST NO.
    }
})

// baseUrl: 'http://192.168.0.100:4000/api/', params: {

// baseUrl: 'https://weconnectbackend.onrender.com/api/', params: {

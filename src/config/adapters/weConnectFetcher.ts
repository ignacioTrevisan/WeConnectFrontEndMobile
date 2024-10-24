
import { AxiosAdapter } from "./http/axios.adapter";


export const WeConnectFetcher = new AxiosAdapter({
    baseUrl: 'https://weconnectbackend.onrender.com/api/', params: {

        //RECORDAR QUE AL CAMBIAR EL BASEURL LLEVA HTTPS, EN LOCALHOST NO.
    }
})

// baseUrl: 'http://tuipv4:puertoDeApi/api/', params: {


// baseUrl: 'https://weconnectbackend.onrender.com/api/', params: {

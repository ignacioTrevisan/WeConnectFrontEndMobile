import axios from "axios";
import { HttpAdapter } from "../../../config/adapters/http/http.adapter";
import { ApiResponse } from "../../../infraestructure/interfaces/api-response";

export const VerifyDisplayName = async (fetcher: HttpAdapter, displayName: string): Promise<ApiResponse> => {
    try {
        const resp = await fetcher.post<ApiResponse>(`auth/verificarDisplayname`, { DisplayName: displayName });
        console.log('Respuesta exitosa:', resp);
        return resp;
    } catch (error: any) {
        if (axios.isAxiosError(error) && error.response) {
            console.log(error.response.data)
            return {
                ok: false,
                msg: error.response.data
            }
        }
        console.log(error);
        return {
            ok: false,
            msg: error
        }

    }
};
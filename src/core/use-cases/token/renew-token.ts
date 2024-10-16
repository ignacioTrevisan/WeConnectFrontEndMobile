import axios from "axios";
import { HttpAdapter } from "../../../config/adapters/http/http.adapter";
import { ApiResponse } from "../../../infraestructure/interfaces/api-response";
import { storeToken } from "../../../helpers/saveToken";

export const RenewToken = async (fetcher: HttpAdapter, token: string, uid: string): Promise<ApiResponse<string>> => {
    try {
        const resp = await fetcher.post<ApiResponse<string>>(`auth/renew`, { token: token, uid: uid });
        if (resp.ok && resp.data) {
            await storeToken({ token: resp.data, uid: uid });
        }
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
        throw new Error('Error in renew token');

    }
};
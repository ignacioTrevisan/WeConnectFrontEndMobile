import axios from "axios";
import { HttpAdapter } from "../../../config/adapters/http/http.adapter";
import { UserLoggedResponse } from "../../../infraestructure/interfaces/login-response";
import { ApiResponse } from "../../../infraestructure/interfaces/api-response";
import { BasicResponse } from "../../../infraestructure/interfaces/basic-response";
import { User } from "../../entities/user-entities";
import { UserMapper } from "../../../infraestructure/mapper/userMapper";
import { storeToken } from "../../../helpers/saveToken";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const LoginUser = async (fetcher: HttpAdapter, displayName: string, password: string): Promise<ApiResponse<User>> => {
    try {
        const resp = await fetcher.post<UserLoggedResponse>(`auth/login`, { DisplayName: displayName, Contraseña: password });
        await storeToken({ token: resp.token, uid: resp.uid });

        const respMapped = UserMapper.fromUserToEntities(resp.usuario)
        return {
            ok: true,
            data: respMapped,
        };
    } catch (error: any) {
        console.log(error)
        if (axios.isAxiosError(error) && error.response) {
            console.log(error.response.data)
            return {
                ok: false,
                msg: error.response.data
            }
        }
        return {
            ok: false,
            msg: error
        }
    }
}
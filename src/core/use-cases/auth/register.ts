import axios from "axios";
import { HttpAdapter } from "../../../config/adapters/http/http.adapter";
import { UserLoggedResponse, Usuario } from '../../../infraestructure/interfaces/login-response';
import { ApiResponse } from "../../../infraestructure/interfaces/api-response";
import { BasicResponse } from "../../../infraestructure/interfaces/basic-response";
import { User } from "../../entities/user-entities";
import { UserMapper } from "../../../infraestructure/mapper/userMapper";
import { storeToken } from "../../../helpers/saveToken";
import AsyncStorage from "@react-native-async-storage/async-storage";



export const RegisterUser = async (fetcher: HttpAdapter, displayName: string, password: string, Email: string): Promise<ApiResponse<User>> => {
    try {
        const resp = await fetcher.post<UserLoggedResponse>(`auth/register`, { DisplayName: displayName, Contraseña: password, Email });
        console.log(resp)
        await storeToken({ token: resp.token, uid: resp.uid });

        const obj = {
            uid: resp.uid,
            DisplayName: displayName,
            creationDate: new Date(new Date + "UTC"),
            Email: Email
        }
        return {
            ok: true,
            data: obj
        };
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            console.log(error.response.data)
            return {
                ok: false,
                msg: error.response.data
            }
        }
        console.log(error);
        throw new Error('Error in login user');
    }
}
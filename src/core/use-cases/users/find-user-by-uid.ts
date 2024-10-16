import axios from "axios";
import { HttpAdapter } from "../../../config/adapters/http/http.adapter";
import { ApiResponse } from "../../../infraestructure/interfaces/api-response";
import { User } from "../../entities/user-entities";
import { UserMapper } from "../../../infraestructure/mapper/userMapper";
import { UserLoggedResponse, Usuario } from '../../../infraestructure/interfaces/login-response';

export const FindByUid = async (fetcher: HttpAdapter, uid: string): Promise<ApiResponse<User>> => {
    try {
        const resp = await fetcher.post<UserLoggedResponse>(`usuario/buscar`, { uid: uid });
        let userMapped;
        if (resp.ok) {
            if (resp.usuario) {
                userMapped = UserMapper.fromUserToEntities(resp.usuario);
            }
        }
        return {
            ok: true,
            data: userMapped
        }

    } catch (error: any) {
        console.log(error)

        return {
            ok: false,
            msg: error ? error : 'Error indefinido al buscar usuario por uid'
        };

    }
};
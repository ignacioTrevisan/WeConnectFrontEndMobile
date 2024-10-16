import { HttpAdapter } from "../../../config/adapters/http/http.adapter";
import { ApiResponse } from "../../../infraestructure/interfaces/api-response";
import { User } from "../../entities/user-entities";
import { UserMapper } from "../../../infraestructure/mapper/userMapper";
import { Usuario } from '../../../infraestructure/interfaces/login-response';

export const ChangePassword = async (fetcher: HttpAdapter, uid: string, oldPassword: string, newPassowrd: string): Promise<ApiResponse<string>> => {
    try {

        const resp = await fetcher.put<ApiResponse<Usuario>>(`auth/updatePassword`,
            {
                uid: uid,
                ContraseñaAntigua: oldPassword,
                Contraseña: newPassowrd,
            });
        console.log(resp);
        if (resp.ok) {

            return {
                ok: true,
                msg: 'Contraseña modificada correctamente.'
            }
        }
        return {
            ok: false,
        }

    } catch (error: any) {
        console.log(error)

        return {
            ok: false,
            msg: error ? error : 'Error al actualizar la contraseña, asegurese de haberla ingresado correctamente. '
        };

    }
};
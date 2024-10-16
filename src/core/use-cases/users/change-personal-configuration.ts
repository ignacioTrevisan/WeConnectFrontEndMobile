import { HttpAdapter } from "../../../config/adapters/http/http.adapter";
import { ApiResponse } from "../../../infraestructure/interfaces/api-response";
import { User } from "../../entities/user-entities";
import { UserMapper } from "../../../infraestructure/mapper/userMapper";
import { Usuario } from '../../../infraestructure/interfaces/login-response';

export const ChangePersonalConfiguraton = async (fetcher: HttpAdapter, usuario: User, uid: string): Promise<ApiResponse<User>> => {
    try {
        const resp = await fetcher.put<ApiResponse<Usuario>>(`auth/update`,
            {
                uid: uid,
                DisplayName: usuario.DisplayName,
                Nombre: usuario.Name ? usuario.Name : null,
                Apellido: usuario.LastName ? usuario.LastName : null,
                Email: usuario.Email ? usuario.Email : null,
                genero: usuario.genero ? usuario.genero : null,
                fecha_nacimiento: usuario.fechaNacimiento ? usuario.fechaNacimiento : null,
                numero_telefono: usuario.numeroDeTelefono ? usuario.numeroDeTelefono : null,
                Foto_de_perfil: usuario.UserPhoto ? usuario.UserPhoto : null
            });
        let userMapped;
        if (resp.ok) {
            if (resp.data) {
                userMapped = UserMapper.fromUserToEntities(resp.data);
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
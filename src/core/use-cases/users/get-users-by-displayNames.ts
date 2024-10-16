import { HttpAdapter } from "../../../config/adapters/http/http.adapter";
import { ApiResponse } from '../../../infraestructure/interfaces/api-response';
import { Usuario } from "../../../infraestructure/interfaces/login-response";
import { UserMapper } from "../../../infraestructure/mapper/userMapper";
import { User } from "../../entities/user-entities";



export const FindUsersByDisplayName = async (fetcher: HttpAdapter, displayNameList: string[]): Promise<ApiResponse<User[]>> => {
    try {
        if (displayNameList.length === 0) return {
            ok: false
        }
        let promises = displayNameList.map((d) => fetcher.get<ApiResponse<Usuario>>(`usuario/buscarUsuariosPorDisplayNames`, {
            params: {
                DisplayName: d
            }
        }))
        console.log('Promises', promises)

        const promisesResolves = await Promise.all(promises);
        let userFormatted: User[] = []
        if (promisesResolves) {
            promisesResolves.map((p) => {
                console.log('Data antes de mapear:', p.data);
                if (p.data) {
                    userFormatted.push(UserMapper.fromUserToEntities(p.data));
                }
            });
        }
        console.log('promisesResolves', promisesResolves[0].data)
        console.log('userFormatted', userFormatted[0])

        return {
            ok: true,
            data: userFormatted
        }

    } catch (error: any) {
        console.log(error)
        throw new Error(`Error finding by displayNames ${error}`);

    }
};
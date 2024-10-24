import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../../entities/user-entities";
import { ApiResponse } from "../../../infraestructure/interfaces/api-response";
import { RenewToken } from "./renew-token";
import { WeConnectFetcher } from "../../../config/adapters/weConnectFetcher";
import { FindByUid } from "../users/find-user-by-uid";

export const VerifyToken = async (): Promise<ApiResponse<User>> => {

    try {

        const token = await AsyncStorage.getItem('@token');
        const uid = await AsyncStorage.getItem('@uid');
        console.log(token, '---', uid)
        if (token && uid) {
            const resp = await RenewToken(WeConnectFetcher, token, uid);
            if (resp.ok) {
                console.log(resp)
                const respDos = await FindByUid(WeConnectFetcher, uid);
                if (respDos.ok && respDos.data) {

                    return {
                        ok: true,
                        data: respDos.data
                    }

                }
            }
        } else {
            console.log('nop?')
        }
        return {

            ok: false,
            msg: 'No hay token o uid'
        }

    } catch (e) {
        return {
            ok: false,
            msg: `Ocurrio un error inseperado verificando el token, ${e}`
        }
    }
}
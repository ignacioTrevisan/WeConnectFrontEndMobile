import { useState } from "react";
import { User } from "../../core/entities/user-entities"
import { AlterStore } from "../store/alter/alterUser";
import { authStore } from "../store/auth/auth-store";
import { LoginUser } from "../../core/use-cases/auth/login";
import { WeConnectFetcher } from "../../config/adapters/weConnectFetcher";

export const useUser = () => {
    const setLogged = authStore(state => state.setLogged);
    const setUserAlterated = AlterStore(state => state.setUserAlterated)
    const [step, setIsStep] = useState(0)

    const [isLoading, setIsLoading] = useState(false)

    const setAllLogged = (user: User) => {
        setLogged(user)
        setUserAlterated(user);
        setIsLoading(false);
    }

    const isLogin = async (form: { DisplayName: string, Password: string }) => {
        setIsLoading(true);
        const resp = await LoginUser(WeConnectFetcher, form.DisplayName, form.Password)
        if (resp.ok) {
            if (resp.data) {
                const userType: User = {
                    DisplayName: form.DisplayName,
                    Email: resp.data?.Email,
                    uid: resp.data?.uid,
                    UserPhoto: resp.data.UserPhoto,
                    creationDate: resp.data?.creationDate,
                    Name: resp.data?.Name,
                    LastName: resp.data?.LastName,
                    genero: resp.data?.genero,
                    fechaNacimiento: resp.data.fechaNacimiento,
                    numeroDeTelefono: resp.data?.numeroDeTelefono
                }
                setAllLogged(userType)
                return 'Logeado'
            }

        } else {
            return resp.msg ? resp.msg?.toString() : 'Error indefinido'
        }
    }

    return {
        isLoading,
        step,
        //methods
        setAllLogged,
        setIsLoading,
        setLogged,
        setUserAlterated,
        setIsStep,
        isLogin
    }
}
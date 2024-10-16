import { useEffect, useState } from "react"
import { User } from "../core/entities/user-entities"
import { FindByUid } from "../core/use-cases/users/find-user-by-uid"
import { WeConnectFetcher } from "../config/adapters/weConnectFetcher"
import { FindAllDisplayNamesByUsers } from "../core/use-cases/users/get-all-displayName-by-user"

export const UseUser = () => {
    const [isLoading, setisLoading] = useState(false)
    const [userLoaded, setUserLoaded] = useState<User>()
    const [allDisplayNameUser, setAllDisplayNameUser] = useState<string[]>([])

    const loadUser = async (uid: string) => {
        const respUser = await FindByUid(WeConnectFetcher, uid)
        if (respUser.ok) {
            setUserLoaded(respUser.data)
        }
    }



    return {
        userLoaded,
        isLoading,
        allDisplayNameUser,
        //methods

        loadUser,
    }
}
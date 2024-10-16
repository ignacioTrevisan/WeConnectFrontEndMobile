import { useState } from "react"
import { Post } from "../core/entities/post-entities";
import { GetPostByUser } from "../core/use-cases/post/get-by-user";
import { WeConnectFetcher } from '../config/adapters/weConnectFetcher';

export const UsePost = () => {
    const [postByUser, setPostByUser] = useState<Post[]>();
    const getByUser = async (id: string) => {
        const resp = await GetPostByUser(WeConnectFetcher, id)
        if (resp.ok && resp.data) {
            console.log('data')
            setPostByUser(resp.data)
        }
    }
    return {
        getByUser,


        //methods


        postByUser
    }
}
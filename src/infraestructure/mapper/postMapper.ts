import { Post } from "../../core/entities/post-entities";
import { PostApi } from "../interfaces/post-response";

export class PostMapper {

    static fromPostToEntities(post: PostApi): Post {


        return {
            id: post._id,
            bodyPost: post.Cuerpo_de_post,
            UserPhoto: post.Foto_de_usuario,
            DisplayName: post.DisplayName,
            creationDate: post.Fecha_de_post,
            comments: post.Comentarios,
            likes: post.Likes,
            itLikeForMe: false, //TODO ESTO ESTA EN FALSE CONSTANTEMENTE, HAY QUE HACER ALGO
            Uid: post.Uid,
            isComment: post.esComentario
        }
    }
}
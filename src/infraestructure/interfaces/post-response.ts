export interface PostResponse {
    ok: boolean;
    posts: PostApi[];

}

export interface PostApi {
    _id: string;
    DisplayName: string;
    Uid: string;
    Fecha_de_post: Date;
    Cuerpo_de_post: string;
    Foto_de_usuario: string;
    Likes: any[];
    Comentarios: any[];
    esComentario: boolean;
    __v: number;
}


export interface PostResponseUnique {
    ok: boolean;
    post: PostApi;

}

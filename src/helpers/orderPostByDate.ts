import { Post } from "../core/entities/post-entities";

export const OrderPostByDate = (post: Post[]): Post[] => {
    return post.sort((a, b) => {
        return new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime();
    });


}
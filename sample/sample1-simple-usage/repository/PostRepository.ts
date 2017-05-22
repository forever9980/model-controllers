import {Post} from "../model/Post";

export class PostRepository {

    async findById(id: number): Promise<Post> {
        const post = new Post();
        post.id = id;
        post.title = "Post #" + id;
        post.text = "Post text #" + id;
        return post;
    }

    async findByIdForAdmin(id: number): Promise<Post> {
        const post = new Post();
        post.id = id;
        post.title = "Post #" + id;
        post.text = "Post text #" + id;
        post.authorName = "Umed Khudoiberdiev";
        return post;
    }

    async findAll() {
        return this.findByIds([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    }

    async findAndCount() {
        return [
            await this.findAll(),
            (await this.findAll()).length
        ];
    }

    async findByIds(ids: number[]): Promise<Post[]> {
        return Promise.all(ids.map(id => this.findById(id)));
    }

    async save(post: Post) {
        console.log("saving post... ", post);
        return post;
    }

    async saveMany(posts: Post[]) {
        return Promise.all(posts.map(post => this.save(post)));
    }

    async remove(post: Post) {
        console.log("remove post... ", post);
        return post;
    }

    async removeMany(posts: Post[]) {
        return Promise.all(posts.map(post => this.remove(post)));
    }

}
import {PostRepository} from "../repository/PostRepository";
import {ModelController} from "../../../src/decorator/ModelController";
import {Post} from "../model/Post";
import {GetById} from "../../../src/decorator/GetById";
import {GetOne} from "../../../src/decorator/GetOne";
import {PostByNameCriteria} from "../criteria/PostByNameCriteria";
import {GetMany} from "../../../src/decorator/GetMany";
import {GetManyAndCount} from "../../../src/decorator/GetManyAndCount";
import {Save} from "../../../src/decorator/Save";
import {Remove} from "../../../src/decorator/Remove";
import {PostFilterCriteria} from "../criteria/PostFilterCriteria";
import {SaveAndRemove} from "../../../src/decorator/SaveAndRemove";
import {PostRemoveByNameCriteria} from "../criteria/PostRemoveByNameCriteria";
import {PostSaveCategoryCritertia} from "../criteria/PostSaveCategoryCritertia";

@ModelController(Post)
export class PostController {

    constructor(private postRepository: PostRepository) {
        this.postRepository = new PostRepository();
    }

    @GetById()
    // @Subscribe()
    async getById(id: number): Promise<Post> {
        return this.postRepository.findById(id);
    }

    @GetOne()
    async oneByPostCriteria(criteria: PostByNameCriteria): Promise<Post> {
        console.log(criteria);
        return new Post();
    }

    @GetMany()
    many(): Promise<Post[]> {
        return this.postRepository.findAll();
    }

    @GetMany()
    manyByPostFilter(criteria: PostFilterCriteria): Promise<Post[]> {
        console.log(criteria);
        return this.postRepository.findAll();
    }

    @GetManyAndCount()
    manyAndCount(): Promise<[Post[], number]> {
        // returns array of posts + overall number of posts
        return this.postRepository.findAndCount();
    }

    @GetManyAndCount()
    manyAndCountByPostFilter(filter: PostFilterCriteria): Promise<[Post[], number]> {
        console.log(filter);
        return this.postRepository.findAndCount();
    }

    @Save()
    save(post: Post): Promise<Partial<Post>> {
        // just saves the post. can save post completely and partially
        // it can be used for partial updates of the Post object
        return this.postRepository.save(post);
    }

    @Save()
    saveCateegories(post: Post, critertia: PostSaveCategoryCritertia): Promise<Partial<Post>> {
        // just saves the post. can save post completely and partially
        // it can be used for partial updates of the Post object
        return this.postRepository.save(post);
    }

    @SaveAndRemove()
    async saveAndRemove(savedPosts: Post[], removedPosts: Post[]): Promise<Partial<Post>[]> {
        await this.postRepository.removeMany(removedPosts);
        await this.postRepository.saveMany(savedPosts);
        return savedPosts;
    }

    @Remove()
    async removeById(id: number): Promise<void> {
        // remove any by given post name from the criteria
    }

    @Remove()
    async removeByIds(ids: number[]): Promise<void> {
        // remove any by given post name from the criteria
    }

    @Remove()
    async removeByName(criteria: PostRemoveByNameCriteria): Promise<void> {
        // remove any by given post name from the criteria
    }

    /*@Upload()
    upload(data: any): Promise<any> {
        // uploads a post if its a file
    }*/
}

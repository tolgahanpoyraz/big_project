import { Post, type IPost } from '../models/Post.js';

type NewPost = Pick<IPost, 'foodName' | 'location' | 'badges' | 'imageKey'>;

export async function createPost(authorId: string, data: NewPost) {
    return Post.create({ ...data, author: authorId });
}

export async function listFeed() {
    return Post.find().sort({ createdAt: -1 });
}
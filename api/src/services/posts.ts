import { Post, type IPost, type VoteType, type PostStatus } from '../models/Post.js';
import { AppError } from '../errors.js';

type NewPost = Pick<IPost, 'foodName' | 'location' | 'badges' | 'imageKey'>;

export async function createPost(authorId: string, data: NewPost) {
    return Post.create({ ...data, author: authorId });
}

export async function listFeed() {
    return Post.find().sort({ createdAt: -1 });
}

function statusFromTallies(present: number, gone: number): PostStatus {
    const total = present + gone;
    if (total === 0) return 'fresh';
    const p = present / total;
    return p >= 0.65 ? 'fresh' : p >= 0.5 ? 'likely' : p > 0.15 ? 'fading' : 'gone';
}

export async function vote(postId: string, userId: string, type: VoteType) {
    const post = await Post.findById(postId).select('+votes');

    if (!post) {
        throw new AppError(404, 'Post not found');
    }

    if (post.votes.some((v) => v.user.toString() === userId)) {
        throw new AppError(409, 'You have already voted on this post');
    }

    const present = post.tallies.present + (type === 'present' ? 1 : 0);
    const gone = post.tallies.gone + (type === 'gone' ? 1 : 0);
    const status = statusFromTallies(present, gone);

    const res = await Post.updateOne(
        { _id: postId, 'votes.user': { $ne: userId } },
        {
            $push: { votes: { user: userId, type, at: new Date() } },
            $inc: { [`tallies.${type}`]: 1 },
            $set: { status },
        },
    );
    if (res.matchedCount === 0) {
        throw new AppError(409, 'You have already voted on this post');
    }

    return { status, tallies: { present, gone } };
}
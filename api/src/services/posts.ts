import { Post, type IPost, type VoteType } from '../models/Post.js';
import { updateConfidence, statusFromConfidence } from '../confidence.js';
import { AppError } from '../errors.js';

type NewPost = Pick<IPost, 'foodName' | 'location' | 'badges' | 'imageKey'>;

export async function createPost(authorId: string, data: NewPost) {
    return Post.create({ ...data, author: authorId });
}

export async function listFeed() {
    return Post.find().sort({ createdAt: -1 });
}

export async function vote(postId: string, userId: string, type: VoteType) {
    const post = await Post.findById(postId).select('+votes');

    if (!post) {
        throw new AppError(404, 'Post not found');
    }

    if (post.votes.some((v) => v.user.toString() === userId)) {
        throw new AppError(409, 'You have already voted on this post');
    }

    const confidence = updateConfidence(post.confidence, type);
    const status = statusFromConfidence(confidence);
    const tallies = {
        present: post.tallies.present + (type === 'present' ? 1 : 0),
        gone: post.tallies.gone + (type === 'gone' ? 1 : 0),
    };

    const res = await Post.updateOne(
        { _id: postId, 'votes.user': { $ne: userId } },
        {
            $push: { votes: { user: userId, type, at: new Date() } },
            $inc: { [`tallies.${type}`]: 1 },
            $set: { confidence, status },
        },
    );
    if (res.matchedCount === 0) {
        throw new AppError(409, 'You have already voted on this post');
    }

    return { confidence, status, tallies };
}
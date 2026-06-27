import { Schema, model, Types, type Model } from 'mongoose';

export interface IPost {
    foodName: string;
    location: string;
    imageKey?: string;
    badges: string[];
    author: Types.ObjectId;
}

type PostModel = Model<IPost>;

const postSchema = new Schema<IPost, PostModel>(
    {
        foodName: { type: String, required: true, trim: true },
        location: { type: String, required: true, trim: true },
        imageKey: { type: String },
        badges: { type: [String], default: [] },
        author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    },
    { timestamps: true },
);

export const Post = model<IPost, PostModel>('Post', postSchema);
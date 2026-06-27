import { type Request, type Response } from 'express';
import { type JwtPayload } from 'jsonwebtoken';
import * as postService from '../services/posts.js';
import { requireFields } from '../middleware/errorHandler.js';

export async function createPost(req: Request, res: Response): Promise<void> {
    const { id } = req.auth as JwtPayload;
    const { foodName, location, badges, imageKey } = req.body as {
        foodName?: string; location?: string; badges?: string[]; imageKey?: string;
    };
    requireFields({ foodName, location }, ['foodName', 'location']);

    const post = await postService.createPost(id, {
        foodName: foodName!,
        location: location!,
        badges: badges ?? [],
        imageKey,
    });
    res.status(201).json({ post });
}

export async function getFeed(_req: Request, res: Response): Promise<void> {
    const posts = await postService.listFeed();
    res.status(200).json({ posts });
}
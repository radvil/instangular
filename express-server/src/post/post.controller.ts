import { Router } from 'express';

import { Controller, RequestUser, JsonHttpResponse } from '../interface';
import { authMiddleware, validationMiddleware } from '../middleware';
import { INTERNAL_SERVER_EXCEPTION, NOT_FOUND_EXCEPTION } from '../exception';
import { Req, Res, Next } from '../var/types';
import { postModel } from './post.model';
import { CreatePostDto } from './post.dto';
import { Post } from './post.interface';

export class PostController implements Controller {
  public path = '/posts';
  public router = Router();
  private _postModel = postModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(this.path, this.getAllPosts);
    this.router.get(`${this.path}/:id`, this.getPostById);
    this.router
      .all(`${this.path}/*`, authMiddleware)
      .patch(`${this.path}/:id`, validationMiddleware(CreatePostDto, true), this.updatePost)
      .delete(`${this.path}/:id`, this.deletePost)
      .post(this.path, authMiddleware, validationMiddleware(CreatePostDto), this.createPost);
  }

  private getAllPosts = async (req: Req, res: Res): Promise<void> => {
    const foundPosts = await this._postModel
      .find()
      .select('-__v')
      .populate('author', '-password -__v');

    const jsonResponse: JsonHttpResponse<Post[]> = {
      status: 200,
      message: 'Get all posts succeded!',
      data: foundPosts,
    }

    res.json(jsonResponse);
  }

  private getPostById = async (req: Req, res: Res, next: Next) => {
    const requestedId = req.params.id;
    const foundPost = await this._postModel.findById(requestedId).select('-__v');

    if (!foundPost) {
      next(new NOT_FOUND_EXCEPTION(requestedId));
    }

    const jsonResponse: JsonHttpResponse<Post> = {
      status: 200,
      message: 'Get by id succeded!',
      data: foundPost,
    }

    res.json(jsonResponse);
  }

  private updatePost = async (req: Req, res: Res, next: Next) => {
    const requestedId = req.params.id;
    const requestedChange: CreatePostDto = req.body;

    const updatedPost = await this._postModel
      .findByIdAndUpdate(requestedId, requestedChange, { new: true })
      .select('-__v');

    if (!updatedPost) {
      next(new NOT_FOUND_EXCEPTION(requestedId));
    }

    const jsonResponse: JsonHttpResponse<Post> = {
      status: 200,
      message: 'Update post succeded!',
      data: updatedPost,
    }

    res.json(jsonResponse);
  }

  private createPost = async (req: RequestUser, res: Res, next: Next) => {
    const postBody: CreatePostDto = req.body;

    try {
      const authorId = req.user._id;
      const newPost = new this._postModel({ ...postBody, author: authorId });
      const savedPost = await newPost.save();

      await savedPost
        .populate({ path: 'author', select: '-password -__v' })
        .execPopulate();

      const response: JsonHttpResponse<Post> = {
        status: 200,
        message: 'Post has been created!',
        data: savedPost,
      }

      res.json(response);
    } catch (error) {
      next(new INTERNAL_SERVER_EXCEPTION());
    }
  }

  private deletePost = async (req: Req, res: Res, next: Next) => {
    const requestedId = req.params.id;
    const deletedPost = await this._postModel.findByIdAndDelete(requestedId);

    if (!deletedPost) {
      next(new NOT_FOUND_EXCEPTION(requestedId));
    }

    const jsonResponse: JsonHttpResponse<any> = {
      status: 200,
      message: `Delete post succeded!`,
      data: { deletedPostId: requestedId }
    }

    res.json(jsonResponse);
  }
}
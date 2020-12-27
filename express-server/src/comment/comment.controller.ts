import { Router } from 'express';
import { BAD_REQUEST_EXCEPTION, INTERNAL_SERVER_EXCEPTION, NOT_FOUND_EXCEPTION } from '../exception';
import { Controller, RequestUser, JsonHttpResponse } from '../interface';
import { authorizeAccess, validationMiddleware } from '../middleware';
import { Req, Res, Next } from '../var/types';
import { CreateCommentDto, Comment } from './comment.model';
import { Querify } from '../util/Querify';

export class CommentController implements Controller {
  public path = '/comments';
  public router = Router();
  private _commentModel = Comment;

  private initializeRoutes(): void {
    this.router.post(this.path, authorizeAccess(), validationMiddleware(CreateCommentDto, true), this.createNewComment);
  }

  private createNewComment = async (req: RequestUser, res: Res, next: Next) => {
    const newComment = new this._commentModel({
      ...req.body as CreateCommentDto,
      author: req.user._id,
      post: req.body.postId
     });
    try {
      const savedComment = await newComment.save();
      await savedComment.populate({
        path: 'author',
        select: 'username photo lastLogin'
      }).execPopulate();
      res.json(<JsonHttpResponse<Comment>>{
        status: 200,
        message: 'Create new comment succeed',
        data: savedComment
      })
    } catch (error) {
      next(new INTERNAL_SERVER_EXCEPTION());
    }
  }

  constructor() {
    this.initializeRoutes();
  }
}
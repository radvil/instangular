import { Router } from 'express';
import { INTERNAL_SERVER_EXCEPTION, NOT_FOUND_EXCEPTION, UNAUTHORIZED_EXCEPTION } from '../exception';
import { Req, Res, Next, USER_POPULATE_SELECT } from '../var';
import { Controller, RequestUser, JsonHttpResponse } from '../interface';
import { authorizeAccess, validationMiddleware } from '../middleware';
import { CreateCommentDto, Comment } from './comment.model';
import { Querify } from '../util/Querify';

export class CommentController implements Controller {
  public path = '/comments';
  public router = Router();
  private _commentModel = Comment;

  private initializeRoutes(): void {
    this.router.post(this.path, authorizeAccess(), validationMiddleware(CreateCommentDto, true), this.createNewComment);
    this.router.get(`${this.path}`, this.getCommentsByPostId);
    this.router.delete(`${this.path}/:commentId`, authorizeAccess(), this.deleteComment);
  }

  private createNewComment = async (req: RequestUser, res: Res, next: Next) => {
    try {
      const newComment = new this._commentModel(<CreateCommentDto>{
        ...req.body,
        commentedBy: req.user._id,
      });
      const savedComment = await newComment.save();
      await savedComment.populate({
        path: 'commentedBy',
        select: USER_POPULATE_SELECT,
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

  private getCommentsByPostId = async (req: Req, res: Res) => {
    const querify = new Querify(req.query);
    const foundComments = await this._commentModel
      .find({ postId: req.query.postId.toString() })
      .limit(querify.limit)
      .skip(querify.skip)
      .select(querify.select)
      .sort(querify.sort)
      .populate({
        path: 'commentedBy',
        select: USER_POPULATE_SELECT
      })
      .populate('reactionsCount')
    const jsonResponse: JsonHttpResponse<Comment[]> = {
      status: 200,
      message: 'Get comments by postId succeded!',
      total: foundComments.length,
      data: foundComments,
    }
    res.json(jsonResponse);
  }

  private deleteComment = async (req: RequestUser, res: Res, next: Next) => {
    const foundComment = await this._commentModel.findById(req.params.commentId);
    if (!foundComment) {
      next(new NOT_FOUND_EXCEPTION());
    }
    if (<any>foundComment.commentedBy.toString() !== req.user._id.toString()) {
      next(new UNAUTHORIZED_EXCEPTION())
    }
    try {
      await foundComment.remove();
      res.json(<JsonHttpResponse<any>>{
        status: 200,
        message: "Comment deleted!",
      })
    } catch (error) {
      next(new INTERNAL_SERVER_EXCEPTION());
    }
  }

  constructor() {
    this.initializeRoutes();
  }
}
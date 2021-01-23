import { Router } from 'express';
import { INTERNAL_SERVER_EXCEPTION, NOT_FOUND_EXCEPTION, UNAUTHORIZED_EXCEPTION } from '../exception';
import { Req, Res, Next, USER_POPULATE_SELECT } from '../var';
import { Controller, RequestUser, JsonHttpResponse } from '../interface';
import { authorizeAccess, validationMiddleware } from '../middleware';
import { CreateCommentDto, Comment } from './comment.model';
import { Querify } from '../util/Querify';
import { ModelPopulateOptions } from 'mongoose';

export class CommentController implements Controller {
  public path = '/comments';
  public router = Router();
  private _commentModel = Comment;

  private initializeRoutes(): void {
    this.router.post(this.path, authorizeAccess(), validationMiddleware(CreateCommentDto, true), this.createNewComment);
    this.router.get(this.path, authorizeAccess(), this.getCommentsByPostId);
    this.router.get(`${this.path}/:commentId`, authorizeAccess(), this.getCommentById);
    this.router.get(`${this.path}/:commentId/replies`, authorizeAccess(), this.getCommentReplies);
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

  private getCommentsByPostId = async (req: RequestUser, res: Res, next: Next) => {
    const querify = new Querify(req.query);
    const parentCommentsQuery = {
      postId: req.query.postId.toString(),
      repliedTo: { $eq: null },
    };
    try {
      const foundComments = await this._commentModel
        .find(parentCommentsQuery)
        .limit(querify.limit)
        .skip(querify.skip)
        .select(querify.select)
        .sort(querify.sort)
        .populate({
          path: 'commentedBy',
          select: USER_POPULATE_SELECT
        })
        .populate(<ModelPopulateOptions>{
          path: 'replies',
          options: {
            where: {
              repliedTo: { $ne: null },
            },
            sort: {
              createdAt: -1,
            },
            limit: 5,
            populate: [
              {
                path: 'commentedBy',
                select: USER_POPULATE_SELECT,
              },
              {
                path: 'reactions',
                options: {
                  sort: {
                    createdAt: -1,
                  },
                  limit: 5,
                  populate: {
                    path: 'reactedBy',
                    select: USER_POPULATE_SELECT,
                  }
                }
              } as ModelPopulateOptions,
              { path: 'reactionsCount' },
            ]
          }
        })
        .populate('repliesCount')
        .populate(<ModelPopulateOptions>{
          path: 'reactions',
          options: {
            sort: {
              createdAt: -1,
            },
            limit: 5,
            populate: {
              path: 'reactedBy',
              select: USER_POPULATE_SELECT,
            }
          }
        })
        .populate('reactionsCount');
      const jsonResponse: JsonHttpResponse<Comment[]> = {
        status: 200,
        message: 'Get comments by postId succeded!',
        page: parseInt(req.query.page.toString()),
        total: foundComments.length,
        data: foundComments,
      }
      res.json(jsonResponse);
    } catch (error) {
      next(new INTERNAL_SERVER_EXCEPTION(error));
    }
  }

  private getCommentById = async (req: Req, res: Res, next: Next) => {
    const originalRequest = this._commentModel
      .findById(req.params.commentId)
      .populate({
        path: 'commentedBy',
        select: USER_POPULATE_SELECT
      })
      .populate(<ModelPopulateOptions>{
        path: 'reactions',
        options: {
          sort: {
            createdAt: -1,
          },
          limit: 5,
          populate: {
            path: 'reactedBy',
            select: USER_POPULATE_SELECT,
          }
        }
      })
      .populate('reactionsCount');
    if (req.query.includingReplies === 'true') {
      originalRequest
        .populate(<ModelPopulateOptions>{
          path: 'replies',
          options: {
            where: {
              repliedTo: { $ne: null },
            },
            sort: {
              createdAt: -1,
            },
            limit: 5,
            populate: [
              {
                path: 'commentedBy',
                select: USER_POPULATE_SELECT,
              },
              {
                path: 'reactions',
                options: {
                  sort: {
                    createdAt: -1,
                  },
                  limit: 5,
                  populate: {
                    path: 'reactedBy',
                    select: USER_POPULATE_SELECT,
                  }
                }
              } as ModelPopulateOptions,
              { path: 'reactionsCount' },
            ]
          }
        })
        .populate('repliesCount');
    }
    try {
      const foundComment = await originalRequest;
      res.json(<JsonHttpResponse<Comment>>{
        status: 200,
        message: 'Get comment by id succeded!',
        data: foundComment,
      });
    } catch (error) {
      next(new NOT_FOUND_EXCEPTION());
    }
  }

  private getCommentReplies = async (req: Req, res: Res, next: Next) => {
    const querify = new Querify(req.query);
    try {
      const foundReplies = await this._commentModel
        .find({ repliedTo: req.params.commentId })
        .limit(querify.limit || 5)
        .skip(querify.skip)
        .sort(querify.sort)
        .populate({
          path: 'commentedBy',
          select: USER_POPULATE_SELECT
        })
        .populate(<ModelPopulateOptions>{
          path: 'reactions',
          options: {
            sort: {
              createdAt: -1,
            },
            limit: 5,
            populate: {
              path: 'reactedBy',
              select: USER_POPULATE_SELECT,
            }
          }
        })
        .populate('reactionsCount');
      res.json(<JsonHttpResponse<Comment[]>>{
        status: 200,
        message: 'GET comment replies succeded!',
        data: foundReplies,
      });
    } catch (error) {
      next(new NOT_FOUND_EXCEPTION());
    }
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
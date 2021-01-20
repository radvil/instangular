import { Router } from "express";

import { BAD_REQUEST_EXCEPTION, INTERNAL_SERVER_EXCEPTION, UNAUTHORIZED_EXCEPTION } from "../exception";
import { Controller, JsonHttpResponse, RequestUser } from "../interface";
import { CommentReaction, PostReaction } from "./reaction.model";
import { authorizeAccess } from "../middleware";
import { Querify } from "../util/Querify";
import { Next, Req, Res, USER_POPULATE_SELECT } from "../var";

export class PostReactionController implements Controller {
  public path = "/post-reactions";
  public router = Router();
  private _reactionModel = PostReaction;

  private initializeRoutes(): void {
    this.router.get(`${this.path}`, authorizeAccess(), this.getReactions);
    this.router.post(this.path, authorizeAccess(), this.react);
  }

  private react = async (req: RequestUser, res: Res, next: Next) => {
    const foundReaction = await this._reactionModel.findOne({
      reactedBy: req.user._id,
      postId: req.body.postId,
    });
    if (!foundReaction) {
      const createdReaction = await this._reactionModel.create({
        reactedBy: req.user._id,
        postId: req.body.postId,
        variant: req.body.variant,
      })
      if (!createdReaction) {
        next(new BAD_REQUEST_EXCEPTION('failed to react!'));
      }
      try {
        await createdReaction.populate({
          path: 'reactedBy',
          select: USER_POPULATE_SELECT,
        }).execPopulate();
        return res.json(<JsonHttpResponse<null>>{
          status: 200,
          message: "React post succeed!",
          data: createdReaction,
        });
      } catch (error) {
        next(new INTERNAL_SERVER_EXCEPTION());
      }
    } else {
      if (foundReaction.variant == req.body.variant) {
        if (!(await foundReaction.remove())) {
          next(new INTERNAL_SERVER_EXCEPTION());
        };
        return res.json(<JsonHttpResponse<null>>{
          status: 200,
          message: "undo react comment succeed!"
        });
      }
      try {
        foundReaction.variant = req.body.variant;
        const updated = await foundReaction.save();
        await updated.populate({
          path: 'reactedBy',
          select: USER_POPULATE_SELECT
        }).execPopulate();
        return res.json(<JsonHttpResponse<PostReaction>>{
          status: 200,
          message: "react comment change succeed!",
          data: updated
        });
      } catch (error) {
        next(new INTERNAL_SERVER_EXCEPTION());
      }
    }
  }

  private getReactions = async (req: Req, res: Res, next: Next) => {
    const querify = new Querify(req.query);
    const foundPosts = await this._reactionModel
      .find(querify.search || {})
      .limit(querify.limit || 10)
      .skip(querify.skip)
      .select(querify.select)
      .sort(querify.sort)
      .populate({
        path: 'reactedBy',
        select: USER_POPULATE_SELECT,
      })
    const jsonResponse: JsonHttpResponse<PostReaction[]> = {
      status: 200,
      message: 'Get post reactions succeded!',
      total: foundPosts.length,
      data: foundPosts,
    }
    res.json(jsonResponse);
  }

  constructor() {
    this.initializeRoutes();
  }

}

export class CommentReactionController implements Controller {
  public path = "/comment-reactions";
  public router = Router();
  private _reactionModel = CommentReaction;

  private initializeRoutes(): void {
    this.router.get(`${this.path}`, authorizeAccess(), this.getReactions);
    this.router.post(this.path, authorizeAccess(), this.react);
  }

  private react = async (req: RequestUser, res: Res, next: Next) => {
    const foundReaction = await this._reactionModel.findOne({
      reactedBy: req.user._id,
      commentId: req.body.commentId,
    });
    if (!foundReaction) {
      const createdReaction = await this._reactionModel.create({
        reactedBy: req.user._id,
        commentId: req.body.commentId,
        variant: req.body.variant,
      })
      if (!createdReaction) {
        next(new BAD_REQUEST_EXCEPTION('failed to react!'));
      }
      try {
        await createdReaction.populate({
          path: 'reactedBy',
          select: USER_POPULATE_SELECT
        }).execPopulate();
        return res.json(<JsonHttpResponse<null>>{
          status: 200,
          message: "react comment succeed!",
          data: createdReaction,
        });
      } catch (error) {
        next(new INTERNAL_SERVER_EXCEPTION());
      }
    } else {
      if (foundReaction.variant == req.body.variant) {
        if (!(await foundReaction.remove())) {
          next(new INTERNAL_SERVER_EXCEPTION());
        };
        return res.json(<JsonHttpResponse<null>>{
          status: 200,
          message: "undo react comment succeed!"
        });
      }
      try {
        foundReaction.variant = req.body.variant;
        const updated = await foundReaction.save();
        await updated.populate({
          path: 'reactedBy',
          select: USER_POPULATE_SELECT
        }).execPopulate();
        return res.json(<JsonHttpResponse<CommentReaction>>{
          status: 200,
          message: "react comment change succeed!",
          data: updated
        });
      } catch (error) {
        next(new INTERNAL_SERVER_EXCEPTION());
      }
    }
  }

  private getReactions = async (req: Req, res: Res, next: Next) => {
    const querify = new Querify(req.query);
    const foundReactions = await this._reactionModel
      .find(querify.search || {})
      .limit(querify.limit || 10)
      .skip(querify.skip)
      .select(querify.select)
      .sort(querify.sort)
      .populate({
        path: 'reactedBy',
        select: USER_POPULATE_SELECT
      })
    const jsonResponse: JsonHttpResponse<CommentReaction[]> = {
      status: 200,
      message: 'Get posts succeded!',
      total: foundReactions.length,
      data: foundReactions,
    }
    res.json(jsonResponse);
  }

  constructor() {
    this.initializeRoutes();
  }

}
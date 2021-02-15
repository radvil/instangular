import { Router } from "express";
import { User } from "../user";
import { Next, Res } from "../var";
import { Controller, JsonHttpResponse, RequestUser } from "../interface";
import { BAD_REQUEST_EXCEPTION, INTERNAL_SERVER_EXCEPTION, NOT_FOUND_EXCEPTION } from "../exception";
import { authorizeAccess, validationMiddleware } from "../middleware";
import { FollowRequest } from "./follow-request.model";
import { CreateFollowReqDto } from "./follow-request.dto";

export class FollowRequestController implements Controller {
  public path = "/follow-requests";
  public router = Router();
  private _followReq = FollowRequest;
  private _user = User;

  constructor() {
    this.initRoutes();
  }

  private initRoutes(): void {
    this.router.get(
      this.path, authorizeAccess(),
      this.getFollowRequests
    );
    this.router.post(
      this.path + "/approve",
      authorizeAccess()
    );
    this.router.post(
      this.path + "/follow",
      authorizeAccess(),
      validationMiddleware(CreateFollowReqDto),
      this.toggleFollow
    );
    this.router.post(
      this.path + "/unfollow",
      authorizeAccess(),
      validationMiddleware(CreateFollowReqDto)
    );
  }

  /**
   * 
   * @method GET
   * @url "/follow-requests"
   * @desc Get all unapproved follow requests
   */
  private getFollowRequests = async (req: RequestUser, res: Res) => {
    try {
      const docs = await this._followReq.find({
        receiver: req.user._id,
        isApproved: false,
      });
      res.json(<JsonHttpResponse<FollowRequest[]>>{
        status: 200,
        message: "GET followRequests success",
        data: docs
      })
    } catch (error) {
      res.json(new INTERNAL_SERVER_EXCEPTION());
    }
  }

  /**
   * 
   * @method POST
   * @url "/follow-requests/send"
   * @dto { isApproved: boolean, senderId: string, receiverId: string }
   * @desc Send Follow Request to user
   */
  private followUser = async (req: RequestUser, res: Res, next: Next) => {
    const dto: CreateFollowReqDto = {
      senderId: req.user?._id.toString(),
      receiverId: req.body?.receiverId.toString(),
    };

    if (dto.senderId === dto.receiverId) {
      return next(new BAD_REQUEST_EXCEPTION());
    }

    // find follow req
    const foundReq = await this._followReq.findOne({
      sender: dto.senderId,
      receiver: dto.receiverId,
      isApproved: false,
    });

    // if found BAD REQ
    if (foundReq) {
      return next(new BAD_REQUEST_EXCEPTION('already make request'));
    }

    try {
      // if !found receiver user
      const receiver = await this._user.findById(dto.receiverId);
      if (receiver) {
        // if user.isPublic push followers, followings
        if (receiver.isPublic) {
          this.pushFollower(receiver, dto.senderId);

          const sender = await this._user.findById(dto.senderId);
          this.pushFollowing(sender, dto.receiverId);

          await Promise.all([
            receiver.save({ timestamps: false }),
            sender.save({ timestamps: false })
          ]);

          return res.json(<JsonHttpResponse<null>>{
            status: 200,
            message: 'follow success'
          });
        }
        // if !user.isPublic create follow req
        const createdReq = await this._followReq.create(<FollowRequest>{
          sender: dto.senderId,
          receiver: dto.receiverId,
        });

        if (!createdReq) {
          return next(new INTERNAL_SERVER_EXCEPTION());
        }

        return res.json(<JsonHttpResponse<FollowRequest>>{
          status: 200,
          message: 'Follow request created',
          data: createdReq
        });
      }
    } catch (error) {
      next(error);
    }

  }

  private toggleFollow = async (req: RequestUser, res: Res, next: Next) => {
    const dto: CreateFollowReqDto = {
      senderId: req.user._id.toString(),
      receiverId: req.body.receiverId.toString(),
    };

    const findReceiver = this._user.findById(dto.receiverId);
    const findSender = this._user.findById(dto.senderId);
    // const isPublicUser = ___
    // const isAFollower = ___ receiver.followers.includes(dto.receiverId)
    
    // if isPublic
    //    if isAFollower unfollow
    //    else follow
    // else
    //    foundReq
    //    if foundReq
    //        if isAFollower foundReq.remove(), unfollow
    //        else unfollow
    //    else createReq

  }

  private async saveUsers(user1: User, user2: User) {
    const result = await Promise.all([
      user1.save({ timestamps: false }),
      user2.save({ timestamps: false })
    ]);
    if (!result) throw ('Failed to save users');
    return result;
  }

  private pushFollower(user: User, followerId: string): void {
    // if (!(user.followers as string[]).includes(followerId)) {
    (user.followers as string[]).push(followerId);
    // } else {
    //   throw new BAD_REQUEST_EXCEPTION('Already a follower!');
    // }
  }

  private pushFollowing(user: User, followingId: string): void {
    // if (!(user.followings as string[]).includes(followingId)) {
    (user.followings as string[]).push(followingId);
    // } else {
    //   throw new BAD_REQUEST_EXCEPTION('Already following');
    // }
  }

  private removeFollower(user: User, followerId: string): void {
    user.followers = (<string[]>user.followers).filter(id => id == followerId);
  }

  private removeFollowing(user: User, followingId: string): void {
    user.followings = (<string[]>user.followings).filter(id => id == followingId);
  }
}
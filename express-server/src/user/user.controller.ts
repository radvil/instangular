import { Router } from 'express';
import { INTERNAL_SERVER_EXCEPTION, NOT_FOUND_EXCEPTION, UNAUTHORIZED_EXCEPTION } from '../exception';
import { Controller, JsonHttpResponse, RequestUser } from '../interface';
import { authorizeAccess } from '../middleware';
import { Req, Res, Next } from '../var/types';
import { Post } from '../post';
import { User } from './user.model';

export class UserController implements Controller {
  public path: '/users';
  public router = Router();
  private _postModel = Post;
  private _userModel = User;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(`${this.path}/:userId`, authorizeAccess(), this.getUserById);
    this.router.get(`${this.path}/:userId/posts`, authorizeAccess(), this.getPostsByAuthor);
  }

  /**
   * 
   * @param req.params.userId requested userId
   * @param req.query.includePosts: string = 'true' | 'false'. To populate posts
   * @desc public route
   */
  private getUserById = async (req: Req, res: Res, next: Next) => {
    const requestedUserId = req.params.userId;
    try {
      const findQuery = this._userModel.findById(requestedUserId);
      const includePostsOptionExists = !!(req.query.includePosts === 'true');
      if (includePostsOptionExists) {
        findQuery.populate('posts').exec();
      }
      const foundUser = await findQuery;
      if (!foundUser) {
        next(new NOT_FOUND_EXCEPTION());
      }
      const jsonResponse: JsonHttpResponse<User> = {
        status: 304,
        message: 'Get user by id succeeded',
        data: foundUser
      }
      res.json(jsonResponse);
    } catch (error) {
      next(new INTERNAL_SERVER_EXCEPTION());
    }
  }

  /**
   * 
   * @param req request user
   * @desc this only for private route
   */
  private getPostsByAuthor = async (req: RequestUser, res: Res, next: Next) => {
    const requestedUserId = req.params.userId;
    const hasSameAuthor = !!(requestedUserId === req.user._id.toString());
    if (!hasSameAuthor) {
      next(new UNAUTHORIZED_EXCEPTION());
    }
    try {
      const query = { postedBy: requestedUserId };
      const posts = await this._postModel.find(query);
      const jsonResponse: JsonHttpResponse<Post[]> = {
        status: 304,
        message: 'Get all posts by user succeded',
        data: posts,
      }
      res.json(jsonResponse);
    } catch (error) {
      next(new INTERNAL_SERVER_EXCEPTION());
    }
  }
}
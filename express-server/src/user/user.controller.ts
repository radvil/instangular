import { Router } from 'express';
import multer, { memoryStorage } from 'multer';

import { BAD_REQUEST_EXCEPTION, DUPLICATE_EXCEPTION, INTERNAL_SERVER_EXCEPTION, NOT_FOUND_EXCEPTION, UNAUTHORIZED_EXCEPTION, WRONG_CREDENTIALS_EXCEPTION } from '../exception';
import { ImageUploader, SizeConfig, SizeLabel, TransformOptions, UploadImageDto } from '../image';
import { UpdatePasswordDto, UserBasicsInfoDto, UserSensitivesInfoDto } from './user.dto';
import { Controller, JsonHttpResponse, RequestUser } from '../interface';
import { authorizeAccess, validationMiddleware } from '../middleware';
import { Role, User } from './user.model';
import { Req, Res, Next, USER_POPULATE_SELECT } from '../var';

export class UserController implements Controller {
  public path = '/users';
  public router = Router();
  private _userModel = User;

  // image upload requirement variables;
  private upload = multer({
    storage: memoryStorage(),
    limits: { fileSize: 1024 * 1024 }
  });
  private imageService: ImageUploader;
  private baseUploadPath = '/public/uploads/images';
  private sizesConfigs: SizeConfig[] = [
    {
      label: SizeLabel.THUMB,
      height: 50,
      width: 50,
    },
    {
      label: SizeLabel.SMALL,
      height: 200,
      width: 200,
    },
  ];

  constructor() {
    this.initRoutes();
    this.imageService = new ImageUploader(this.baseUploadPath, this.sizesConfigs);
  }

  private initRoutes(): void {
    this.router.post(this.path + '/upload-profile-photo', authorizeAccess(), this.upload.single('photo'), this.uploadPhoto);
    this.router.patch(this.path + '/basics-info', authorizeAccess(), validationMiddleware(UserBasicsInfoDto), this.patchBasicsInfo);
    this.router.patch(this.path + '/sensitives-info', authorizeAccess(), validationMiddleware(UserSensitivesInfoDto), this.patchSensitivesInfo);
    this.router.get(this.path + '/:username', this.getUserByUsername);
    this.router.patch(this.path + '/password', authorizeAccess([Role.USER, Role.ADMIN]), this.patchPassword);
  }

  /**
   * 
   * @param req.params.username requested username
   * @param req.query.includePosts: string = 'true' | 'false'. To populate posts
   * @desc public route
   */
  private getUserByUsername = async (req: Req, res: Res, next: Next) => {
    const username = req.params.username;
    try {
      const findQuery = this._userModel.findOne({ username }).select('-email');
      const includePostsOptionExists = req.query.includePosts === 'true';
      if (includePostsOptionExists) {
        findQuery.populate([
          {
            path: 'posts',
            limit: 10,
            populate: [
              {
                path: 'reactions',
                options: {
                  sort: {
                    createdAt: -1
                  },
                  limit: 5,
                  populate: {
                    path: 'reactedBy',
                    select: USER_POPULATE_SELECT
                  },
                }
              },
              { path: 'reactionsCount' }
            ]
          },
          { path: 'postsCount' }
        ]).exec();
      }
      const foundUser = await findQuery;
      if (!foundUser) {
        next(new NOT_FOUND_EXCEPTION());
      }
      const jsonResponse: JsonHttpResponse<User> = {
        status: 304,
        message: 'Get user by username succeeded',
        data: foundUser
      }
      res.json(jsonResponse);
    } catch (error) {
      next(new INTERNAL_SERVER_EXCEPTION());
    }
  }

  /**
   * 
   * @method PATCH
   * @param req.params.userId requested userId
   * @field image = req.file (multipart form-data)
   * @desc private route to patch user's basics information
   */
  private uploadPhoto = async (req: RequestUser, res: Res, next: Next) => {
    if (req.user._id.toString() !== req.body.userId.toString()) {
      return next(new UNAUTHORIZED_EXCEPTION('Not allowed!'));
    }
    const foundUser = await this._userModel.findById(req.user._id);
    if (!foundUser) {
      return next(new NOT_FOUND_EXCEPTION('user not found!'));
    }
    try {
      if (foundUser.photo && foundUser.photoThumb) {
        await this.imageService.removeAssociatedImages(foundUser.photo, this.sizesConfigs);
      }
      const [thumbPath, imagePath] = await this.uploadImage(req.file, 'url');
      foundUser.set(<User>{
        photo: imagePath,
        photoThumb: thumbPath,
      })
      const savedUser = await foundUser.save();
      res.json(<JsonHttpResponse<User>>{
        status: 200,
        message: "upload photo succeed!",
        data: savedUser,
      })
    } catch (error) {
      next(new INTERNAL_SERVER_EXCEPTION(error));
    }
  }

  /**
   * 
   * @method PATCH
   * @param req.params.userId requested userId
   * @field <UserBasicsInfoDto>{ bio, websiteLink, facebookLink, twitterLink, githubLink }
   * @desc private route to patch user's basics information
   */
  private patchBasicsInfo = async (req: RequestUser, res: Res, next: Next) => {
    const { name, bio, websiteLink, facebookLink, twitterLink, githubLink } = <UserBasicsInfoDto>req.body;
    const foundUser = await this._userModel.findById(req.user._id);
    if (!foundUser) {
      next(new NOT_FOUND_EXCEPTION('user not found!'));
    }
    try {
      foundUser.set({ name, bio, websiteLink, facebookLink, twitterLink, githubLink });
      const savedUser = await foundUser.save();
      res.json(<JsonHttpResponse<User>>{
        status: 200,
        message: 'PATCH basic info succeed!',
        data: savedUser,
      })
    } catch (error) {
      next(new INTERNAL_SERVER_EXCEPTION('failed to patch basic info!'));
    }
  }

  /**
   * 
   * @param req.params.userId requested userId
   * @field <UserSensitivesInfoDto>{ username: string, email: string, }
   * @method PATCH
   * @desc private route to patch sensitive info
   */
  private patchSensitivesInfo = async (req: RequestUser, res: Res, next: Next) => {
    const { username, email } = <UserSensitivesInfoDto>req.body;
    const foundUser = await this._userModel.findById(req.user._id);
    if (!foundUser) {
      next(new NOT_FOUND_EXCEPTION('user not found!'));
    }
    try {
      foundUser.set({ username, email });
      await foundUser.save();
      res.json(<JsonHttpResponse<any>>{
        status: 200,
        message: 'PATCH basic info succeed!',
      })
    } catch (error) {
      if (parseInt(error.code) === 11000) {
        next(new DUPLICATE_EXCEPTION('username or email is not available!'));
      }
      next(new INTERNAL_SERVER_EXCEPTION(error));
    }
  }

  /**
   * 
   * @method PATCH
   * @param req.params.userId requested userId
   * @field <UpdatePasswordDto>{ oldPassword: string, newPassword: string }
   * @desc private route to update user password
   * @roles ADMIN || User
   */
  private patchPassword = async (req: RequestUser, res: Res, next: Next): Promise<void> => {
    const foundUser = await this._userModel.findById(req.user._id);
    if (!foundUser) {
      return next(new NOT_FOUND_EXCEPTION('user not found!'));
    }
    const { oldPassword, newPassword, confirmNewPassword } = <UpdatePasswordDto>req.body;
    if (newPassword?.toString() !== confirmNewPassword?.toString()) {
      return next(
        new BAD_REQUEST_EXCEPTION('new password and confirmation input should\'ve match')
      );
    }
    if (!await foundUser.validatePassword(oldPassword)) {
      return next(new WRONG_CREDENTIALS_EXCEPTION('Invalid credentials'));
    }
    try {
      foundUser.set(<User>{
        password: newPassword,
        lastPasswordUpdatedAt: new Date().toISOString()
      })
      await foundUser.save();
      res.json(<JsonHttpResponse<User>>{
        status: 200,
        message: "Update Password Succeed!"
      })
    } catch (error) {
      return next(new INTERNAL_SERVER_EXCEPTION(error));
    }
  }

  /**
   * 
   * @param key property key from ImageOutput. Default to "name"
   * @desc get value from a image output that return string provided by given key.
   * #### example usage: uploadPostImage(req.file, 'key');
   */
  protected async uploadImage(file: any, key?: string): Promise<string[]> {
    const options: TransformOptions = {};
    try {
      const images = await this.imageService.uploadImage({ file, options } as UploadImageDto);
      const thumbPath = images.find(img => img.sizeLabel === SizeLabel.THUMB)[key || 'name'];
      const imagePath = images.find(img => img.sizeLabel === SizeLabel.SMALL)[key || 'name'];
      return [thumbPath, imagePath];
    } catch (error) {
      throw (error);
    }
  }
}
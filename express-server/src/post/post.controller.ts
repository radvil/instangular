import { Router } from 'express';
import multer, { memoryStorage } from 'multer';

import { BAD_REQUEST_EXCEPTION, INTERNAL_SERVER_EXCEPTION, NOT_FOUND_EXCEPTION } from '../exception';
import { SizeConfig, SizeLabel, UploadImageDto, ImageUploader, TransformOptions } from '../image';
import { Controller, RequestUser, JsonHttpResponse } from '../interface';
import { authorizeAccess, validationMiddleware } from '../middleware';
import { Req, Res, Next, USER_POPULATE_SELECT } from '../var';
import { Querify } from '../util/Querify';
import { CreatePostDto, Post } from './index';
import { ModelPopulateOptions } from 'mongoose';

export class PostController implements Controller {
  public path = '/posts';
  public router = Router();

  private _postModel = Post;
  private upload = multer({
    storage: memoryStorage()
  });
  private imageService: ImageUploader;
  private baseUploadPath = '/public/uploads/images';
  private sizesConfigs: SizeConfig[] = [
    {
      label: SizeLabel.BLUR,
      height: 20,
      width: 20,
    },
    {
      label: SizeLabel.THUMB,
      height: 50,
      width: 50,
    },
    {
      label: SizeLabel.MEDIUM,
      height: 720,
      width: 720,
    },
    {
      label: SizeLabel.ORIGINAL,
      width: null,
      height: null
    },
  ];

  constructor() {
    this.initImageService();
    this.initializeRoutes();
  }

  private initImageService(): void {
    this.imageService = new ImageUploader(this.baseUploadPath, this.sizesConfigs);
  }

  private initializeRoutes(): void {
    this.router.get(this.path, authorizeAccess(), this.getAllPosts);
    this.router.post(this.path, authorizeAccess(), validationMiddleware(CreatePostDto), this.upload.single('image'), this.createPost);

    this.router.get(`${this.path}/:id`, authorizeAccess(), this.getPostById);
    this.router.patch(`${this.path}/:id`, authorizeAccess(), validationMiddleware(CreatePostDto, true), this.updatePost);
    this.router.delete(`${this.path}/:id`, authorizeAccess(), this.deletePost);
  }

  private getAllPosts = async (req: Req, res: Res, next: Next): Promise<void> => {
    const querify = new Querify(req.query);
    const originalRequest = this._postModel
      .find(querify.search)
      .limit(querify.limit)
      .skip(querify.skip)
      .select(querify.select)
      .sort(querify.sort)
      .populate({
        path: 'postedBy',
        select: USER_POPULATE_SELECT
      })
      .populate('commentsCount')
      .populate('reactionsCount')
    if (req.query.includeComments == 'true') {
      originalRequest.populate('comments');
    }
    if (req.query.includeReactions == 'true') {
      originalRequest.populate('reactions');
    }
    try {
      const foundPosts = await originalRequest;
      res.json(<JsonHttpResponse<Post[]>>{
        status: 200,
        message: 'GET posts succeded!',
        total: foundPosts.length,
        data: foundPosts,
      });
    } catch (error) {
      next(new INTERNAL_SERVER_EXCEPTION());
    }
  }

  private getPostById = async (req: Req, res: Res, next: Next) => {
    const requestedPostId = req.params.id;
    const originalRequest = this._postModel
      .findById(requestedPostId)
      .populate({
        path: 'postedBy',
        select: USER_POPULATE_SELECT,
      })
      .populate('commentsCount')
      .populate('reactionsCount');
    if (req.query.includeComments === 'true') {
      originalRequest.populate(<ModelPopulateOptions>{
        path: 'comments',
        populate: {
          path: 'replies',
          options: { limit: 3 }
        }
      });
    }
    if (req.query.includeReactions === 'true') {
      originalRequest.populate('reactions');
    }
    try {
      const foundPost = await originalRequest;
      if (!foundPost) {
        next(new NOT_FOUND_EXCEPTION());
      }
      res.json(<JsonHttpResponse<Post>>{
        status: 200,
        message: "GET postById succeed!",
        data: foundPost,
      });
    } catch (error) {
      next(new INTERNAL_SERVER_EXCEPTION());
    }
  }

  private updatePost = async (req: Req, res: Res, next: Next) => {
    const requestedId = req.params.id;
    const changes: CreatePostDto = req.body;
    const updatedPost = await this._postModel
      .findByIdAndUpdate(requestedId, changes, { new: true })
      .populate({ path: 'postedBy', select: USER_POPULATE_SELECT })
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
    if (!req.file) {
      next(new BAD_REQUEST_EXCEPTION('Please provide an image!'));
    }
    try {
      const [thumbPath, imagePath] = await this.uploadPostImage(req.file, 'url');
      const newPost = new this._postModel(<CreatePostDto>{
        ...req.body,
        thumbnail: thumbPath,
        image: imagePath,
        postedBy: req.user._id,
      });
      const savedPost = await newPost.save();
      await savedPost.populate({
        path: 'postedBy',
        select: USER_POPULATE_SELECT,
      }).execPopulate();
      const response: JsonHttpResponse<Post> = {
        status: 200,
        message: 'Post has been created!',
        data: savedPost,
      }
      res.json(response);
    } catch (error) {
      next(new INTERNAL_SERVER_EXCEPTION(error));
    }
  }

  private deletePost = async (req: Req, res: Res, next: Next) => {
    const requestedId = req.params.id;
    const foundPost = await this._postModel.findById(requestedId);
    if (!foundPost) {
      next(new NOT_FOUND_EXCEPTION());
    }
    try {
      await Promise.all([
        await this.imageService.removeAssociatedImages(foundPost.image, this.sizesConfigs),
        await foundPost.remove()
      ]);
      const jsonResponse: JsonHttpResponse<any> = {
        status: 200,
        message: `Delete post succeded!`,
        data: { deletedPostId: requestedId }
      }
      res.json(jsonResponse);
    } catch (error) {
      next(new INTERNAL_SERVER_EXCEPTION(error));
    }
  }

  /**
   * 
   * @param key property key from ImageOutput. Default to "name"
   * @desc get value from a image output that return string provided by given key.
   * #### example usage: uploadPostImage(req.file, 'key');
   */
  protected async uploadPostImage(file: any, key?: string): Promise<string[]> {
    const options: TransformOptions = {
      // fit: "contain",
      // background: { r: 255, g: 255, b: 255 },
    }
    const images = await this.imageService.uploadImage({ file, options } as UploadImageDto);
    const thumbPath = images.find(img => img.sizeLabel === SizeLabel.THUMB)[key || 'name'];
    const imagePath = images.find(img => img.sizeLabel === SizeLabel.MEDIUM)[key || 'name'];
    return [thumbPath, imagePath];
  }
}
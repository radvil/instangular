import { Router } from 'express';
import { QueryPopulateOptions } from 'mongoose';
import multer, { memoryStorage } from 'multer';

import { BAD_REQUEST_EXCEPTION, INTERNAL_SERVER_EXCEPTION, NOT_FOUND_EXCEPTION } from '../exception';
import { SizeConfig, SizeLabel, UploadImageDto, ImageUploader } from '../image';
import { Controller, RequestUser, JsonHttpResponse } from '../interface';
import { authorizeAccess, validationMiddleware } from '../middleware';
import { Req, Res, Next } from '../var/types';
import { CreatePostDto } from './post.dto';
import { Querify } from '../util/Querify';
import { Post } from './post.model';
import { TransformOptions } from '../image';

export class PostController implements Controller {
  public path = '/posts';
  public router = Router();

  private _postModel = Post;
  private upload = multer({ storage: memoryStorage() });
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
    this.router.get(this.path, this.getAllPosts);
    this.router.get(`${this.path}/:id`, this.getPostById);
    this.router
      .all(`${this.path}/*`, authorizeAccess())
      .patch(`${this.path}/:id`, validationMiddleware(CreatePostDto, true), this.updatePost)
      .delete(`${this.path}/:id`, authorizeAccess(), this.deletePost)
      .delete(this.path, authorizeAccess(), this.deleteMultiplePosts)
      .post(this.path, authorizeAccess(), validationMiddleware(CreatePostDto), this.upload.single('image'), this.createPost);
  }

  private getAllPosts = async (req: Req, res: Res): Promise<void> => {
    const querify = new Querify(req.query);
    const foundPosts = await this._postModel
      .find(querify.search || {})
      .select(querify.select)
      .populate('author', '-password -__v')
      .populate(<QueryPopulateOptions>{
        path: 'comments',
        populate: {
          path: 'author',
          select: 'username photo',
        },
        options: { limit: 1, sort: '-createdAt' }
      })
      .populate('commentsCount')
      .limit(querify.limit || 5)
      .skip(querify.skip)
    const jsonResponse: JsonHttpResponse<Post[]> = {
      status: 200,
      message: 'Get all posts succeded!',
      total: foundPosts.length,
      data: foundPosts,
    }
    res.json(jsonResponse);
  }

  private getPostById = async (req: Req, res: Res, next: Next) => {
    const requestedId = req.params.id;
    const foundPost = await this._postModel
      .findById(requestedId)
      .select('-__v')
      .populate('author', '-password -__v')
      .populate('commentsCount')
      .populate(<QueryPopulateOptions>{
        path: 'comments',
        populate: {
          path: 'author',
          select: 'username photo',
        },
        options: { limit: 5, sort: '-createdAt' }
      });
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
    const changes: CreatePostDto = req.body;
    const updatedPost = await this._postModel
      .findByIdAndUpdate(requestedId, changes, { new: true })
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
    if (!req.file) {
      next(new BAD_REQUEST_EXCEPTION('Please provide an image!'));
    }
    try {
      const authorId = req.user._id;
      const [thumbPath, imagePath] = await this.uploadPostImage(req.file, 'url');
      const newPost = new this._postModel({
        ...req.body as CreatePostDto,
        thumbnail: thumbPath,
        image: imagePath,
        author: authorId
      });
      const savedPost = await newPost.save();
      await savedPost
        .populate({ path: 'author', select: '-password -__v -email' })
        .execPopulate();
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
    try {
      const foundPost = await this._postModel.findById(requestedId);
      if (!foundPost) {
        next(new NOT_FOUND_EXCEPTION());
      }
      const deleted = await Promise.all([
        await this.imageService.removeAssociatedImages(foundPost.image, this.sizesConfigs),
        await foundPost.remove()
      ]);
      if (!deleted) {
        next(new INTERNAL_SERVER_EXCEPTION('Failed to remove post with images'));
      }
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

  private deleteMultiplePosts = async (req: Req, res: Res, next: Next) => {
    const requestedIds: string[] = req.body.ids;
    try {
      // TODO: FindMany Query
      const deletedPosts = await this._postModel.deleteMany({ _id: requestedIds });
      if (!deletedPosts) {
        next(new NOT_FOUND_EXCEPTION(requestedIds.toString()));
      }
      const jsonResponse: JsonHttpResponse<any> = {
        status: 200,
        message: `Delete multiple posts succeded!`,
        total: requestedIds.length,
        data: { deletedPostId: requestedIds }
      }
      res.json(jsonResponse);
    } catch (error) {
      next(new BAD_REQUEST_EXCEPTION('Failed to delete this posts!'));
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
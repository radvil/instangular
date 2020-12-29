import { Router } from 'express';
import multer, { memoryStorage } from 'multer';

import { BAD_REQUEST_EXCEPTION, INTERNAL_SERVER_EXCEPTION, NOT_FOUND_EXCEPTION } from '../exception';
import { SizeConfig, SizeLabel, UploadImageDto, ImageUploader, TransformOptions } from '../image';
import { Controller, RequestUser, JsonHttpResponse } from '../interface';
import { authorizeAccess, validationMiddleware } from '../middleware';
import { Req, Res, Next, COMMENTS, POSTED_BY, REACTIONS } from '../var';
import { Querify } from '../util/Querify';
import { CreatePostDto, Post } from './index';

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
      .limit(querify.limit || 5)
      .skip(querify.skip)
      .select(querify.select)
      .sort(querify.sort)
      .populate(POSTED_BY)
      .populate('commentsCount')
      .populate({ ...COMMENTS, options: { limit: 2, sort: [[...querify.sort]] } })
      .populate('reactionsCount')
      .populate({...REACTIONS, options: { limit: 3, sort: [[...querify.sort]] } })
    const jsonResponse: JsonHttpResponse<Post[]> = {
      status: 200,
      message: 'Get posts succeded!',
      total: foundPosts.length,
      data: foundPosts,
    }
    res.json(jsonResponse);
  }

  private getPostById = async (req: Req, res: Res, next: Next) => {
    const requestedId = req.params.id;
    const foundPost = await this._postModel
      .findById(requestedId)
      .populate(POSTED_BY)
      .populate('commentsCount')
      .populate(COMMENTS)
      .populate('reactionsCount')
      .populate(REACTIONS)
    if (!foundPost) {
      next(new NOT_FOUND_EXCEPTION());
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
      .populate(POSTED_BY)
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
      await savedPost.populate(POSTED_BY).execPopulate();
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
        data: { deletedPostIds: requestedIds }
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
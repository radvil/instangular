import { Router } from 'express';
import multer, { memoryStorage } from 'multer';

import { BAD_REQUEST_EXCEPTION, INTERNAL_SERVER_EXCEPTION, NOT_FOUND_EXCEPTION, UNAUTHORIZED_EXCEPTION } from '../exception';
import { SizeConfig, SizeLabel, UploadImageDto, ImageUploader, TransformOptions } from '../image';
import { Controller, RequestUser, JsonHttpResponse } from '../interface';
import { authorizeAccess, validationMiddleware } from '../middleware';
import { Res, Next, USER_POPULATE_SELECT } from '../var';
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

  private getAllPosts = async (req: RequestUser, res: Res, next: Next): Promise<void> => {
    const querify = new Querify(req.query);
    try {
      const foundPosts = await this._postModel
        .find(querify.search)
        .limit(querify.limit)
        .skip(querify.skip)
        .select(querify.select)
        .sort(querify.sort)
        .populate({
          path: 'postedBy',
          select: USER_POPULATE_SELECT,
        })
        .populate(<ModelPopulateOptions>{
          path: 'myReaction',
          options: {
            where: { reactedBy: req.user._id },
            // select: '-_id -reactedBy',
            populate: <ModelPopulateOptions>{
              path: 'reactedBy',
              select: USER_POPULATE_SELECT,
            },
          }
        })

      for (const post of foundPosts) {
        if (req.query.includeComments == 'true') {
          await post
            .populate(<ModelPopulateOptions>{
              path: 'comments',
              options: {
                where: { repliedTo: { $eq: null } },
                limit: 5,
                sort: { createdAt: -1 },
              },
              populate: [
                { path: 'reactionsCount' },
                { path: 'commentedBy', select: USER_POPULATE_SELECT },
                {
                  path: 'replies',
                  options: {
                    where: {
                      repliedTo: {
                        $ne: null
                      },
                    },
                    sort: {
                      createdAt: -1,
                    },
                    limit: 5,
                    populate: {
                      path: 'commentedBy',
                      select: USER_POPULATE_SELECT,
                    }
                  }
                },
              ]
            })
            .populate('commentsAsParentCount')
            .populate('commentsCount')
            .execPopulate();
        }
        if (req.query.includeReactions == 'true') {
          await post
            .populate(<ModelPopulateOptions>{
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
              },
            })
            .populate('reactionsCount')
            .execPopulate()
        }
      }

      res.json(<JsonHttpResponse<Post[]>>{
        status: 200,
        message: 'GET posts succeded!',
        total: foundPosts.length,
        data: foundPosts,
      });
    } catch (error) {
      return next(new INTERNAL_SERVER_EXCEPTION());
    }
  }

  private getPostById = async (req: RequestUser, res: Res, next: Next) => {
    const requestedPostId = req.params.id;
    const originalRequest = this._postModel
      .findById(requestedPostId)
      .populate({
        path: 'postedBy',
        select: USER_POPULATE_SELECT,
      });
    if (req.user._id) {
      originalRequest.populate(<ModelPopulateOptions>{
        path: 'myReaction',
        options: {
          where: { reactedBy: req.user._id },
          // select: '-_id -reactedBy',
          populate: <ModelPopulateOptions>{
            path: 'reactedBy',
            select: USER_POPULATE_SELECT,
          },
        }
      })
    }
    if (req.query.includeComments === 'true') {
      originalRequest
        .populate(<ModelPopulateOptions>{
          path: 'comments',
          options: {
            where: { repliedTo: { $eq: null } },
            limit: 5,
            sort: { createdAt: -1 },
          },
          populate: [
            { path: 'reactionsCount' },
            { path: 'repliesCount' },
            { path: 'commentedBy', select: USER_POPULATE_SELECT },
            {
              path: 'replies',
              options: {
                where: {
                  repliedTo: {
                    $ne: null
                  },
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
            },
            {
              path: 'myReaction',
              options: {
                where: { reactedBy: req.user._id },
                // select: '-_id -reactedBy',
              }
            }
          ]
        })
        .populate('commentsAsParentCount')
        .populate('commentsCount')
    }
    if (req.query.includeReactions === 'true') {
      originalRequest
        .populate(<ModelPopulateOptions>{
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
          },
        })
        .populate('reactionsCount');
    }
    try {
      const foundPost = await originalRequest;
      if (!foundPost) {
        return next(new NOT_FOUND_EXCEPTION());
      }
      res.json(<JsonHttpResponse<Post>>{
        status: 200,
        message: "GET postById succeed!",
        data: foundPost,
      });
    } catch (error) {
      return next(new INTERNAL_SERVER_EXCEPTION());
    }
  }

  private updatePost = async (req: RequestUser, res: Res, next: Next) => {
    const requestedId = req.params.id;
    const foundPost = await this._postModel.findById(requestedId);
    if (!foundPost) {
      return next(new NOT_FOUND_EXCEPTION());
    }
    if (req.user._id.toString() !== foundPost.postedBy.toString()) {
      return next(new UNAUTHORIZED_EXCEPTION('Not allowed!'));
    }
    foundPost.description = req.body.description;
    foundPost.tags = req.body.tags;
    try {
      const updatedPost = await foundPost.save();
      // await updatedPost
      //   .populate({ path: 'postedBy', select: USER_POPULATE_SELECT }).execPopulate();
      res.json(<JsonHttpResponse<Post>>{
        status: 200,
        message: 'Update post succeded!',
        data: updatedPost,
      });
    } catch (error) {
      return next(new INTERNAL_SERVER_EXCEPTION())
    }
  }

  private createPost = async (req: RequestUser, res: Res, next: Next) => {
    if (!req.file) {
      return next(new BAD_REQUEST_EXCEPTION('Please provide an image!'));
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
      await savedPost
        .populate([
          { path: 'postedBy', select: USER_POPULATE_SELECT },
          { path: 'comments' },
          { path: 'commentsCount' },
          { path: 'reactions' },
          { path: 'reactionsCount' },
        ])
        .execPopulate();
      res.json(<JsonHttpResponse<Post>>{
        status: 200,
        message: 'Post has been created!',
        data: savedPost,
      });
    } catch (error) {
      return next(new INTERNAL_SERVER_EXCEPTION(error));
    }
  }

  private deletePost = async (req: RequestUser, res: Res, next: Next) => {
    const requestedId = req.params.id;
    const foundPost = await this._postModel.findById(requestedId);
    if (!foundPost) {
      return next(new NOT_FOUND_EXCEPTION());
    }
    if (req.user._id.toString() !== foundPost.postedBy.toString()) {
      return next(new UNAUTHORIZED_EXCEPTION('Not allowed'));
    }
    try {
      await Promise.all([
        this.imageService.removeAssociatedImages(foundPost.image, this.sizesConfigs),
        foundPost.remove()
      ]);
      res.json(<JsonHttpResponse<any>>{
        status: 200,
        message: `Delete post succeded!`,
        data: { deletedPostId: requestedId }
      });
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
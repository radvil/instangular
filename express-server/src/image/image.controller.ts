import { Router } from 'express';
import multer from 'multer';

import { BAD_REQUEST_EXCEPTION, INTERNAL_SERVER_EXCEPTION } from '../exception';
import { Controller, JsonHttpResponse } from '../interface';
import { Req, Res, Next } from '../var';
import { ImageOutput, SizeLabel, SizeConfig, UploadImageDto, UploadImagesArrayDto } from './image';
import { ImageUploader } from './image-uploader';

const storage = multer.memoryStorage();

export class ImageController implements Controller {
  public path = '/images';
  public router = Router();
  public upload = multer({ storage });

  public imageUploader: ImageUploader;
  public baseUploadPath = '/public/uploads/images';
  public sizesConfig: SizeConfig[] = [
    {
      label: SizeLabel.THUMB,
      height: 50,
      width: 50,
    },
    {
      label: SizeLabel.MEDIUM,
      height: 500,
      width: 500,
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
    this.imageUploader = new ImageUploader(this.baseUploadPath, this.sizesConfig);
  }

  private initializeRoutes(): void {
    this.router.post(`${this.path}/upload/single`, this.upload.single('image'), this.uploadImage);
    this.router.post(`${this.path}/upload/array`, this.upload.array('images'), this.uploadImagesArray);
  }

  private uploadImage = async (req: Req, res: Res, next: Next): Promise<void> => {

    if (!req.file) {
      next(new BAD_REQUEST_EXCEPTION('Please provide an image!'));
    }

    try {
      this.imageUploader.baseImageUrl = `${req.protocol}://${req.get("host")}${this.baseUploadPath}/`;
      await this.imageUploader.uploadImage({ file: req.file } as UploadImageDto);

      const jsonResponse: JsonHttpResponse<ImageOutput[]> = {
        status: 200,
        message: 'Uploaded successfully!',
        data: this.imageUploader.getUploadResult('single'),
      }

      res.json(jsonResponse);
    } catch (error) {
      next(new INTERNAL_SERVER_EXCEPTION(error.message));
    }
  }

  private uploadImagesArray = async (req: Req, res: Res, next: Next): Promise<void> => {

    if (!req.files) {
      next(new BAD_REQUEST_EXCEPTION('Please provide images!'));
    }

    try {
      this.imageUploader.baseImageUrl = `${req.protocol}://${req.get("host")}${this.baseUploadPath}/`;
      await this.imageUploader.uploadImagesArray({ files: req.files } as UploadImagesArrayDto);

      const jsonResponse: JsonHttpResponse<ImageOutput[][]> = {
        status: 200,
        message: 'Uploaded successfully!',
        data: this.imageUploader.getUploadResult('array'),
      }

      res.json(jsonResponse);
    } catch (error) {
      next(new INTERNAL_SERVER_EXCEPTION(error.message));
    }
  }

}

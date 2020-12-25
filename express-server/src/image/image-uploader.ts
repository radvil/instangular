import { mkdirSync } from 'fs-extra';
import sharp from 'sharp';
import { ImageOutput, TransformOptions, SizeConfig, UploadImageDto, ImageFile, UploadImagesArrayDto } from './image';

export class ImageUploader {
  private _baseUploadImagePath: string;
  private _baseImageUrl: string;
  private _resultPerImage: ImageOutput[] = [];
  private _resultImagesArray: ImageOutput[][] = [];
  private _timestamps: Date;

  constructor(
    public baseUploadPath: string = '/public/uploads',
    public sizesConfig: SizeConfig[] = []
  ) {
    this._timestamps = new Date();
    this.makeAndSyncUploadDir();
  }

  get timestamps(): Date {
    return this._timestamps;
  }

  get baseUploadImagePath(): string {
    return this._baseUploadImagePath;
  }

  get baseImageUrl(): string {
    return this._baseImageUrl;
  }

  set baseImageUrl(urlInString: string) {
    this._baseImageUrl = urlInString;
  }

  // get resultPerImage(): ImageOutput[] {
  //   return this._resultPerImage;
  // }

  // get resultImagesArray(): ImageOutput[][] {
  //   return this._resultImagesArray;
  // }

  public getUploadResult(uploadType: 'single' | 'array'): Array<any> {
    if (uploadType == 'single') return this._resultPerImage;
    if (uploadType == 'array') return this._resultImagesArray;
    else return null;
  }

  /**
   * 
   * @param uploadImagesArrayDto = {file, options}
   * @param file = req.file
   * @param options = {}
   */
  public async uploadImagesArray(uploadImagesArrayDto: UploadImagesArrayDto) {
    const { options, files } = uploadImagesArrayDto;

    return await Promise.all(
      files.map(async(file: ImageFile) => {
        await this.uploadImage(<UploadImageDto>{ file, options });
        this._resultImagesArray.push(this._resultPerImage)
      })
    );
  }

  /**
   * 
   * @param uploadImageDto = {file, options}
   * @param file = req.file
   * @param options = {}
   */
  public async uploadImage(uploadImageDto: UploadImageDto): Promise<void[]> {
    const { options, file } = uploadImageDto;

    return await Promise.all(
      this.sizesConfig.map((config: SizeConfig) => this.uploadImagePerSize(file, config, options))
    );
  }

  public async uploadImagePerSize(file: ImageFile, sizeConfig: SizeConfig, options: TransformOptions) {
    const transformOptions: TransformOptions = {
      ...options,
      width: sizeConfig.width,
      height: sizeConfig.height,
      label: sizeConfig.label,
    }

    const resultPerSize = await this.transformImage(file, transformOptions);
    this._resultPerImage.push(resultPerSize);
  }

  public async transformImage(file: ImageFile, options: TransformOptions): Promise<ImageOutput> {
    let transformAction = sharp(file.buffer);

    if (options) {
      transformAction = transformAction.resize(options);
    }

    const imageName = this.renameImage(file.originalname, options.label);
    const outputPath = this._baseUploadImagePath + imageName;

    try {
      const result = await transformAction.toFile(outputPath);
      const imageUrl = this._baseImageUrl ? this._baseImageUrl + imageName : null;

      return <ImageOutput>{
        name: imageName,
        url: imageUrl,
        width: result.width,
        height: result.height,
        sizeLabel: options.label,
        sizeInBytes: result.size,
      };
    } catch (error) {
      throw error;
    }
  }

  private makeAndSyncUploadDir(): void {
    const year = this._timestamps.getFullYear();
    const month = `${this._timestamps.getMonth() + 1}`.padStart(2, "0");

    this._baseUploadImagePath = process.cwd() + `${this.baseUploadPath}/${year}/${month}/`;

    try {
      mkdirSync(this._baseUploadImagePath, { recursive: true });
    } catch (error) {
      throw error;
    }
  }

  private renameImage(originalName: string, sizeLabel?: string): string {
    const fileExtension = this.getFileExtension(originalName);
    const fileName = this.getFileName(originalName);
    const modifiedName = this._timestamps.getTime()
      + Math.floor(Math.random() * 100)
      + `-${fileName}-${sizeLabel || 'original'}`
      + `.${fileExtension}`;

    return modifiedName;
  }

  /**
   * 
   * @param fileNameFull string. Full file name with extension;
   * #### usage: getFileName('injoker.file-name.png');
   * #### output : 'injoker.file-name'
   */
  public getFileName(fileNameFull: string): string {
    const result = (fileNameFull.split(/\.([^.]*?)(?=\?|#|$)/) || [])[0];
    return result;
  }

  /**
   * 
   * @param fileNameFull string. Full file name with extension;
   * #### usage: getFileExtension('injoker.file-name.png');
   * #### output : 'png'
   */
  public getFileExtension(fileNameFull: string): string {
    // It takes everything between last dot and first "?" or "#" char or string end.
    // To ignore "?" and "#" characters use /\.([^.]*)$/.
    // To ignore only "#" use /\.([^.]*?)(?=\?|$)/
    return (fileNameFull.match(/\.([^.]*?)(?=\?|#|$)/) || [])[1];
  }
}
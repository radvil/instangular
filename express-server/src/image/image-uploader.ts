import fs, { mkdirSync } from 'fs-extra';
import sharp from 'sharp';
import { ImageOutput, TransformOptions, SizeConfig, UploadImageDto, ImageFile, UploadImagesArrayDto } from './image';

export class ImageUploader {
  private _baseUploadImagePath: string;

  constructor(
    public baseUploadPath: string = '/public/uploads/images',
    public sizesConfig: SizeConfig[] = []
  ) {
    this._baseUploadImagePath = process.cwd() + this.baseUploadPath;
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
      files.map(async (file: ImageFile) => {
        return await this.uploadImage(<UploadImageDto>{ file, options });
      })
    );
  }

  /**
   * 
   * @param uploadImageDto = {file, options}
   * @param file = req.file
   * @param options = {}
   */
  public async uploadImage({ file, options = {} }: UploadImageDto) {
    const timestamp = new Date();
    // subDir output: "2021/01/"
    const subDir = '/' + timestamp.getFullYear() + '/' + `${timestamp.getMonth() + 1}`.padStart(2, "0") + '/';
    const prefix = `${timestamp.getTime() + Math.floor(Math.random() * 100)}`;
    try {
      this.syncAndMakeDir(subDir);
      options.subDir = subDir;
      options.prefix = prefix;
      return await Promise.all(
        this.sizesConfig.map((config: SizeConfig) => this.uploadImagePerSize(file, config, options))
      );
    } catch (error) {
      throw (error)
    }
  }

  public async uploadImagePerSize(file: ImageFile, sizeConfig: SizeConfig, options: TransformOptions) {
    const transformOptions: TransformOptions = {
      ...options,
      width: sizeConfig.width,
      height: sizeConfig.height,
      label: sizeConfig.label,
    }

    const resultPerSize = await this.transformImage(file, transformOptions);
    return resultPerSize;
  }

  public async transformImage(file: ImageFile, options: TransformOptions): Promise<ImageOutput> {
    const transformAction = options ? sharp(file.buffer).resize(options) : sharp(file.buffer);
    const { prefix, label, subDir } = options;
    const uniqueName = this.makeUniqueFilename(prefix, file.originalname, label);
    const pathLikeName = subDir + uniqueName;
    const outputPath = this._baseUploadImagePath + subDir + uniqueName;
    try {
      const result = await transformAction.toFile(outputPath);
      return <ImageOutput>{
        name: uniqueName,
        url: pathLikeName,
        width: result.width,
        height: result.height,
        sizeLabel: options.label,
        sizeInBytes: result.size,
      };
    } catch (error) {
      throw 'failed to transform ' + error;
    }
  }

  private syncAndMakeDir(subDir: string): void {
    const uploadPath = this._baseUploadImagePath + '/' + subDir;

    try {
      mkdirSync(uploadPath, { recursive: true });
    } catch (error) {
      throw error;
    }
  }

  /**
   * 
   * @param pathLike: "/path/to/file/fileName.jpg"
   * @param sizeConfigs: SizeConfig[] { label: SizeLabel.THUMB, height: 20, width: 20 }
   */
  public async removeAssociatedImages(pathLike: string, sizeConfigs: SizeConfig[]) {
    const baseImagePath = process.cwd() + `${this.baseUploadPath}`;

    await Promise.all(
      sizeConfigs.map(async (config) => {
        const [fileName, fileExtension] = this.spliteNameAndExtension(pathLike);
        const nameWithoutLabel = this.getFileNameWithoutLabel(fileName);
        const finalFilePath = `${baseImagePath}/${nameWithoutLabel}-${config.label}.${fileExtension}`;

        return fs.access(finalFilePath, (err) => {
          if (err) return;
          return fs.unlink(finalFilePath);
        });
      })
    )
  }

  /**
   * 
   * @param prefix generatedRandomString to prefix imageName
   * @param originalName "fileName.jpg"
   * @param label "thumbnail | small | medium | etc"
   * @ouput >>> "prefix-fileName-label.extension"
   * ####example >>> "1609022425782-fileName-thumbnail.jpg"
   */
  protected makeUniqueFilename(prefix: string, originalName: string, label = 'original'): string {
    const [fileName, fileExtension] = this.spliteNameAndExtension(originalName);
    const uniqueFilename = prefix + `-${fileName}-${label}.${fileExtension}`;
    return uniqueFilename;
  }

  /**
   * 
   * @param pathLike "/path/to/file/fileName-thumbnail.jpg"
   * #### output "/path/to/file/fileName"
   */
  protected getFileNameWithoutLabel(pathLike: string): string {
    let splittedFileName = pathLike.split('-');
    splittedFileName.length = splittedFileName.length - 1;
    return splittedFileName.join('-');
  }

  /**
   * 
   * @param fileNameFull string. Full file name with extension;
   * #### usage: getFileExtension('injoker.file-name.png');
   * #### output : 'png'
   */
  public spliteNameAndExtension(fileNameFull: string): string[] {
    const fileName = this.getFileName(fileNameFull);
    const fileExtension = this.getFileExtension(fileNameFull);
    return [fileName, fileExtension];
  }
  /**
   * 
   * @param fileNameFull string. Full file name with extension;
   * #### usage: getFileName('injoker.file-name.png');
   * #### output : 'injoker.file-name'
   */
  protected getFileName(fileNameFull: string): string {
    const result = (fileNameFull.split(/\.([^.]*?)(?=\?|#|$)/) || [])[0];
    return result;
  }

  /**
   * 
   * @param fileNameFull string. Full file name with extension;
   * #### usage: getFileExtension('injoker.file-name.png');
   * #### output : 'png'
   */
  protected getFileExtension(fileNameFull: string): string {
    // It takes everything between last dot and first "?" or "#" char or string end.
    // To ignore "?" and "#" characters use /\.([^.]*)$/.
    // To ignore only "#" use /\.([^.]*?)(?=\?|$)/
    return (fileNameFull.match(/\.([^.]*?)(?=\?|#|$)/) || [])[1];
  }

}
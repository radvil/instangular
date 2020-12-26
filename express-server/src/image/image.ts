import { ResizeOptions } from 'sharp';

export interface ImageFile {
  buffer: Buffer;
  originalname: string;
  fieldname?: string;
}

export interface TransformOptions extends ResizeOptions {
  subDir?: string;
  prefix?: string;
  label?: string;
}

export interface SizeConfig {
  label: SizeLabel;
  width: number;
  height: number;
}

export interface ImageOutput {
  name: string;
  width: number;
  height: number;
  path?: string;
  url?: string;
  format?: string;
  sizeLabel?: string;
  sizeInBytes?: number;
}

export enum SizeLabel {
  THUMB = 'thumb',
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
  ORIGINAL = 'original',
}

export class UploadImageDto {
  file: ImageFile;
  options: TransformOptions;
}

export class UploadImagesArrayDto {
  files: ImageFile[] = [];
  options: TransformOptions;
}
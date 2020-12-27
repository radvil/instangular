import { PopulateOptions } from "mongoose"

// image
export const IMAGE_PATH = process.cwd() + '/public/images/';
export const MAXWIDTH_IMAGE_POST = 600;
export const DEFAULT_IMAGE_INPUT_FIELD = 'image';
export const DEFAULT_IMAGE_FOLDERNAME = 'uncategorized';

// mongoose population
export const USER_POPULATE_SELECT: string = "username photo photoThumb lastLoggedInAt";
export const POSTED_BY: PopulateOptions = {
  path: "postedBy",
  select: USER_POPULATE_SELECT
};
export const COMMENTED_BY: PopulateOptions = {
  path: "commentedBy",
  select: USER_POPULATE_SELECT
};
export const COMMENTS: PopulateOptions = {
  path: 'comments',
  populate: COMMENTED_BY,
  options: { limit: 5 }
}
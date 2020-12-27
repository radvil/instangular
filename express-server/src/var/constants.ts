import { PopulateOptions } from "mongoose"

// image
export const IMAGE_PATH = process.cwd() + '/public/images/';
export const MAXWIDTH_IMAGE_POST = 600;
export const DEFAULT_IMAGE_INPUT_FIELD = 'image';
export const DEFAULT_IMAGE_FOLDERNAME = 'uncategorized';

// mongoose population
export const USER_POPULATE_SELECT: string = "username photo photoThumb lastLoggedInAt";

export const REACTED_BY: PopulateOptions = {
  path: "reactedBy",
  select: USER_POPULATE_SELECT
};
export const REACTIONS: PopulateOptions = {
  path: 'reactions',
  populate: [REACTED_BY, { path: 'reactionsCount' }],
  options: { limit: 10 }
};
export const REACTIONS_COUNT: PopulateOptions = { path: 'reactionsCount' };

export const COMMENTED_BY: PopulateOptions = {
  path: "commentedBy",
  select: USER_POPULATE_SELECT
};
export const COMMENTS: PopulateOptions = {
  path: 'comments',
  populate: [COMMENTED_BY, { path: 'reactionsCount' }],
  options: { limit: 5 }
};
export const COMMENTS_COUNT: PopulateOptions = { path: 'commentsCount' };

export const POSTED_BY: PopulateOptions = {
  path: "postedBy",
  select: USER_POPULATE_SELECT
};
export const POSTS: PopulateOptions = {
  path: 'posts',
  populate: [
    POSTED_BY,
    { ...REACTIONS, options: { limit: 3 } },
    REACTIONS_COUNT,
    { ...COMMENTS, options: { limit: 2 } },
    COMMENTS_COUNT,
  ],
  options: { limit: 5 }
};
export const POSTS_COUNT: PopulateOptions = { path: 'postsCount' };

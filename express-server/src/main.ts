import 'dotenv/config';
import App from './App';
import validateEnv from './util/validateEnv';

import { AuthController } from './auth';
import { PostController } from './post';
import { UserController } from './user';
import { CommentController } from './comment';
import { CommentReactionController, PostReactionController } from './reaction';

validateEnv();

const port = parseInt(process.env.PORT);
const app = new App(
  [
    new AuthController(),
    new UserController(),
    new PostController(),
    new PostReactionController(),
    new CommentController(),
    new CommentReactionController(),
  ]
);

app.listen(port);
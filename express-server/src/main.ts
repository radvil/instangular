import 'dotenv/config';
import App from './App';
import validateEnv from './util/validateEnv';

import { ImageController } from './image';
import { AuthController } from './auth';
import { PostController } from './post';
import { UserController } from './user';
import { CommentController } from './comment';

validateEnv();

const port = parseInt(process.env.PORT);
const app = new App(
  [
    new ImageController(),
    new AuthController(),
    new PostController(),
    new CommentController(),
    new UserController(),
  ]
);

app.listen(port);
import 'dotenv/config';
import App from './App';
import validateEnv from './util/validateEnv';

import { ImageController } from './image';
import { AuthController } from './auth';
import { PostController } from './post';
import { UserController } from './user';

validateEnv();

const app = new App(
  [
    new ImageController(),
    new AuthController(),
    new PostController(),
    new UserController(),
  ]
);

app.listen();
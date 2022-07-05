import express, { Application } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { connect, ConnectOptions } from 'mongoose';

import { Controller } from './interface';
import { Logger } from './util/logger';
import { errorMiddleware } from './middleware';
import path from 'path';

class App {
  private _app: Application;
  private _logger = new Logger('App');

  constructor(controllers: Controller[]) {
    this._app = express();

    this.connectToDatabase();
    this.initMiddlewares();
    this.initMainRoutes(controllers);
    this.initErrorHandling();
  }

  get app(): Application {
    return this._app;
  }

  public listen(port: number): void {
    this._app.listen(port, () => {
      this._logger.info(`App started on port ${port}`);
    })
  }

  private initMiddlewares(): void {
    this._app.use(morgan('dev'));
    // this._app.use(helmet());
    // this._app.use(cors({ origin: '*', credentials: true }));
    this.app.use(cors({ origin: (_origin, cb) => cb(null, true), credentials: true }));
    this._app.use(cookieParser());
    this._app.use(express.json());
    // this._app.use(express.urlencoded({ extended: true }));
    this._app.use('/public', express.static(path.join(__dirname, '../public')));
  }

  private initMainRoutes(controllers: Controller[]): void {
    controllers.forEach(controller => {
      this._app.use('/', controller.router);
    })
  }

  private initErrorHandling(): void {
    this._app.use(errorMiddleware);
  }

  private connectToDatabase(): void {
    const { MONGO_URI, MONGO_DBNAME } = process.env;
    const connectionPath = `${MONGO_URI}/${MONGO_DBNAME}`;
    const connectionOpts: ConnectOptions = {
      // autoIndex: false, // for production only
      appName: 'Instangular',
      dbName: 'instangular-db',
    };

    connect(connectionPath, connectionOpts, (err: Error) => {
      return err
        ? this._logger.error(`Failed to connect to database`, err.stack)
        : this._logger.info(`Database connected to ${connectionPath}`);
    });
  }
}

export default App;

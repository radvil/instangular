import { Router } from 'express';

import { Controller } from '../interface';
import { userModel } from '../user/user.model';
import { Req, Res, Next } from '../var/types';

export class ReportController implements Controller {
  public path = '/report';
  public router = Router();
  private _user = userModel;

  constructor() {
    this.initRoutes();
  }

  private initRoutes(): void {
    this.router.get(`${this.path}`, this.generateReport);
  }

  private generateReport = async (req: Req, res: Res, next: Next) => {

    try {
      const usersByCountries = await this._user.aggregate(
        [
          { $match: { 'address.country': { $exists: true } } },
          {
            $group: {
              _id: { country: '$address.country' },
              users: { $push: { _id: '$_id', name: '$name' } },
              count: { $sum: 1 },
            },
          },
          {
            $lookup: {
              from: 'posts',
              localField: 'users._id',
              foreignField: 'author',
              as: 'articles',
            },
          },
          {
            $addFields: {
              amountOfArticles: { $size: '$articles' },
            },
          },
          { $sort: { amountOfArticles: 1 } },
        ]
      );

      res.send({ usersByCountries });
    } catch (error) {
      next(error);
    }
  }
}
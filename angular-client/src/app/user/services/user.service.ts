import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment as env } from 'src/environments/environment'
import { User } from '../interfaces';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private _http: HttpClient) { }

  public getUserByUsername(username: string): Observable<User> {
    const request$ = this._http.get<{ data: User }>(
      `${env.be.url}/users/${username}?includePosts=true`
    );
    return request$.pipe(map(res => res.data))
  }
}
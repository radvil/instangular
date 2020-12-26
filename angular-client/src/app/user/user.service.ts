import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './user.interface';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private _http: HttpClient) { }

  private userUrl = 'http://localhost:3000/users';

  public getUserByUsername(username: string): Observable<User> {
    const request$ = this._http.get<{ data: User }>(`${this.userUrl}/${username}?includePosts=true`);
    return request$.pipe(map(res => res.data))
  }
}
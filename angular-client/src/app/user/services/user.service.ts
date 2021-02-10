import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment as env } from 'src/environments/environment'
import { UserPhotoDto, User } from '../interfaces';
import { ApiRes } from 'src/app/_core';
import { UserBasicsInfoDto, UserSensitivesInfoDto } from '../interfaces/user.dto';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private _http: HttpClient) { }

  public getUserByUsername(username: string): Observable<User> {
    const request$ = this._http.get<{ data: User }>(
      `${env.be.url}/users/${username}?includePosts=true`
    );
    return request$.pipe(map(res => res.data))
  }

  public uploadProfilePicture(dto: UserPhotoDto): Observable<User> {
    const url = env.be.url + `/users/upload-profile-photo`;
    const formData: FormData = new FormData();
    formData.append('userId', dto.userId);
    formData.append('photo', dto.photo);
    return this._http.post<ApiRes<User>>(url, formData).pipe(map(res => res.data));
  }

  public updateBasicsInfo(dto: UserBasicsInfoDto): Observable<User> {
    const url = env.be.url + `/users/basics-info`;
    return this._http.patch<ApiRes<User>>(url, dto).pipe(map(res => res.data));
  }

  public updateSensitivesInfo(dto: UserSensitivesInfoDto): Observable<any> {
    const url = env.be.url + `/users/sensitives-info`;
    return this._http.patch<ApiRes<any>>(url, dto);
  }
}
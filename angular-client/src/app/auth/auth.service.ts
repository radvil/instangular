import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";

import { environment as env } from 'src/environments/environment';
import { ApiRes } from "../interfaces";
import { LocalStorageService } from "../services";
import { LoginDto, LoginResponse } from "./store/auth.model";
import { User } from "../user";

type TokenRes = ApiRes<LoginResponse>;
type AuthUserRes = ApiRes<User>;

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private _http: HttpClient,
    private _localStorageService: LocalStorageService,
  ) { }

  private _authUrl = env.be.url + '/auth';

  public login(loginDto: LoginDto): Observable<string> {
    const request$ = this._http.post<TokenRes>(
      `${this._authUrl}/login`,
      loginDto,
      // { withCredentials: true }
    );
    return request$.pipe(map(res => res.data.accessToken))
  }

  public requestAuthUser(): Observable<User> {
    const request$ = this._http.get<AuthUserRes>(
      `${this._authUrl}/request-auth-user`,
      // { withCredentials: true }
    );
    return request$.pipe(map(res => res.data));
  }

  public refreshToken(): Observable<string> {
    const request$ = this._http.get<TokenRes>(
      `${this._authUrl}/refresh-token`,
      { withCredentials: true }
    );
    return request$.pipe(
      map(res => res.data.accessToken),
      tap(token => this._localStorageService.setItem('accessToken', token))
    )
  }
}
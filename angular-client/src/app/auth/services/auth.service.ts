import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";

import { environment as env } from 'src/environments/environment';
import { ApiRes } from "src/app/_core/interfaces";
import { LocalStorageService } from "src/app/_shared/services";
import { User } from "src/app/user/interfaces";
import { LoginDto, LoginRes, UserRegistrationDto } from "../interfaces";

type TokenRes = ApiRes<LoginRes>;
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
      { withCredentials: true }
    );
    return request$.pipe(map(res => res.data.accessToken))
  }

  public register(dto: UserRegistrationDto): Observable<any> {
    return this._http.post<ApiRes<any>>(`${this._authUrl}/register`, dto)
      .pipe(
        map(res => res.status),
        catchError(error => of(error))
      );
  }

  public requestAuthUser(): Observable<User> {
    const request$ = this._http.get<AuthUserRes>(
      `${this._authUrl}/request-auth-user`,
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
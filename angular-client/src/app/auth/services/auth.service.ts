import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
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
  private _authUrl = env.be.url + '/auth';
  public accessTokenSubject: BehaviorSubject<string>;
  public accessToken$: Observable<string>;

  constructor(
    private _http: HttpClient,
    private _localStorageService: LocalStorageService,
  ) {
    this.initAccessToken();
  }

  get accessToken(): string {
    return this.accessTokenSubject.value;
  }

  private initAccessToken(): void {
    const accessToken = this._localStorageService.getItem('accessToken');
    this.accessTokenSubject = new BehaviorSubject(accessToken);
    this.accessToken$ = this.accessTokenSubject.asObservable();
  }

  public login(loginDto: LoginDto): Observable<string> {
    const url = `${this._authUrl}/login`;
    const request$ = this._http.post<TokenRes>(url, loginDto, { withCredentials: true });
    return request$.pipe(
      tap(res => {
        if (res.data.accessToken) {
          const accessToken = res.data.accessToken;
          this._localStorageService.setItem('accessToken', accessToken);
          this.accessTokenSubject.next(accessToken);
        }
      }),
      map(res => res.data.accessToken)
    )
  }

  public logout(): Observable<ApiRes<any>> {
    return this._http.post<ApiRes<any>>(`${this._authUrl}/revoke-token`, {}, { withCredentials: true }).pipe(
      catchError(error => of(error))
    );
  }

  public register(dto: UserRegistrationDto): Observable<string> {
    const url = `${this._authUrl}/register`;
    return this._http.post<TokenRes>(url, dto, { withCredentials: true }).pipe(
      tap(res => {
        if (res.data.accessToken) {
          const accessToken = res.data.accessToken;
          this._localStorageService.setItem('accessToken', accessToken);
          this.accessTokenSubject.next(accessToken);
        }
      }),
      map(res => res.data.accessToken)
    );
  }

  public requestAuthUser(): Observable<User> {
    const url = `${this._authUrl}/request-auth-user`;
    return this._http.get<AuthUserRes>(url).pipe(map(res => res.data));
  }

  public refreshToken(): Observable<string> {
    const request$ = this._http.get<TokenRes>(
      `${this._authUrl}/refresh-token`,
      { withCredentials: true }
    );
    return request$.pipe(
      tap(res => {
        if (res.data.accessToken) {
          this._localStorageService.setItem('accessToken', res.data.accessToken);
          this.accessTokenSubject.next(res.data.accessToken);
        }
      }),
      map(res => res.data.accessToken),
    )
  }
}
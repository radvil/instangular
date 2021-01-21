import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { CreatePostDto, Post } from "./post.interface";
import { environment as env } from 'src/environments/environment';
import { HttpQueryOptions, makeHttpQueries } from "../utils";
import { ApiRes } from "../interfaces";

@Injectable({ providedIn: 'root' })
export class PostService {
  constructor(private _http: HttpClient) { }

  public getPosts(paramsOptions?: HttpQueryOptions): Observable<Post[]> {
    const params = paramsOptions ? makeHttpQueries(paramsOptions) : null;
    const request$ = this._http.get<ApiRes<Post[]>>(`${env.be.url}/posts`, { params });
    return request$.pipe(map(res => res.data));
  }

  public getPostById(postId: string, paramsOptions?: HttpQueryOptions): Observable<Post> {
    const params = paramsOptions ? makeHttpQueries(paramsOptions) : null;
    const request$ = this._http.get<ApiRes<Post>>(`${env.be.url}/posts/${postId}`, { params });
    return request$.pipe(map(res => res.data));
  }

  public updatePostById(postId: string, changes: CreatePostDto): Observable<Post> {
    const request$ = this._http.patch<ApiRes<Post>>(`${env.be.url}/posts/${postId}`, changes);
    return request$.pipe(map(res => res.data));
  }
}
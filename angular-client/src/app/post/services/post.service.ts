import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { environment as env } from 'src/environments/environment';
import { ApiRes } from "src/app/_core";
import { HttpQueryOptions, makeHttpQueries } from "src/app/_shared";
import { CreatePostDto, Post, PostReaction } from "../interfaces";

@Injectable({ providedIn: 'root' })
export class PostService {
  constructor(private _http: HttpClient) { }

  public getPosts(paramsOptions: HttpQueryOptions): Observable<Post[]> {
    // const params = makeHttpQueries(paramsOptions);
    let params = new HttpParams();
    if (paramsOptions.page) {
      params = params.set('page', `${paramsOptions.page}`)
    }
    if (paramsOptions.includeComments) {
      params = params.set('includeComments', 'true')
    }
    if (paramsOptions.includeReactions) {
      params = params.set('includeReactions', 'true')
    }
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

  public deletePostById(postId: string): Observable<any> {
    return this._http.delete<ApiRes<any>>(`${env.be.url}/posts/${postId}`);
  }

  public reactPost(dto: PostReaction): Observable<any> {
    return this._http.post<ApiRes<PostReaction>>(`${env.be.url}/post-reactions`, dto);
  }
}
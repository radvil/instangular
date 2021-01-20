import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { environment as env } from 'src/environments/environment';
import { ApiRes } from "src/app/_core";
import { HttpQueryOptions, makeHttpQueries } from "src/app/_shared";
import { UpdatePostDto, Post, PostReaction, CreatePostDto } from "../interfaces";

@Injectable({ providedIn: 'root' })
export class PostService {
  constructor(private _http: HttpClient) { }

  public getPosts(paramsOptions: HttpQueryOptions): Observable<Post[]> {
    // const params = makeHttpQueries(paramsOptions);
    let params = new HttpParams();
    if (paramsOptions.page) {
      params = params.set('page', `${paramsOptions.page}`)
    }
    if (paramsOptions.limit) {
      params = params.append('limit', `${paramsOptions.limit}`)
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

  public updatePostById(postId: string, changes: UpdatePostDto): Observable<Post> {
    const request$ = this._http.patch<ApiRes<Post>>(`${env.be.url}/posts/${postId}`, changes);
    return request$.pipe(map(res => res.data));
  }

  public deletePostById(postId: string): Observable<any> {
    return this._http.delete<ApiRes<any>>(`${env.be.url}/posts/${postId}`);
  }

  public reactPost(dto: PostReaction): Observable<any> {
    return this._http.post<ApiRes<PostReaction>>(`${env.be.url}/post-reactions`, dto);
  }

  public createPost(dto: CreatePostDto): Observable<Post> {
    const fd: FormData = new FormData();
    fd.append('description', dto.description);
    fd.append('tags', dto.tags?.toString());
    fd.append('image', dto.image);
    const request$ = this._http.post<ApiRes<Post>>(`${env.be.url}/posts`, fd, {
      reportProgress: true,
    })
    return request$.pipe(map(res => res.data));
  }
}
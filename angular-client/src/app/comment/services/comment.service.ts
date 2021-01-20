import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  PostComment,
  CommentReaction,
  CreatePostCommentDto,
  GetPostCommentsDto,
  GetCommentRepliesDto,
  EditCommentDto,
} from '../interfaces';
import { environment as env } from 'src/environments/environment';
import { ApiRes } from 'src/app/_core';

@Injectable({ providedIn: 'root' })
export class CommentService {
  constructor(private _http: HttpClient) { }

  public getCommentsByPostId(
    getCommentsByPostIdDto: GetPostCommentsDto
  ): Observable<PostComment[]> {
    const { postId, pageNumber, limit } = getCommentsByPostIdDto;

    let httpParams = new HttpParams();
    if (postId) httpParams = httpParams.set('postId', postId);
    if (pageNumber) httpParams = httpParams.set('page', pageNumber.toString());
    if (limit) httpParams = httpParams.set('limit', limit.toString());

    const request$ = this._http.get<ApiRes<PostComment[]>>(
      `${env.be.url}/comments`,
      { params: httpParams }
    );
    return request$.pipe(map((res) => res.data));
  }

  public getRepliesByCommentId(
    dto: GetCommentRepliesDto,
  ): Observable<PostComment[]> {
    let httpParams = new HttpParams();
    let url = `${env.be.url}/comments/${dto.commentId}/replies`;

    if (dto.pageNumber) {
      httpParams = httpParams.set('page', dto.pageNumber.toString());
    }
    if (dto.limit) {
      httpParams = httpParams.set('limit', (dto.limit?.toString() || '5'));
    }
    return this._http.get<ApiRes<PostComment[]>>(url, { params: httpParams })
      .pipe(map((res) => res.data));
  }

  public getCommentById(commentId: string): Observable<PostComment> {
    let httpParams = new HttpParams();
    httpParams = httpParams.set('includingReplies', 'true');

    const request$ = this._http.get<ApiRes<PostComment>>(
      `${env.be.url}/comments/${commentId}`,
      { params: httpParams }
    );
    return request$.pipe(map((res) => res.data));
  }

  public addComment(createCommentDto: CreatePostCommentDto): Observable<PostComment> {
    const request$ = this._http.post<ApiRes<PostComment>>(
      `${env.be.url}/comments`,
      createCommentDto
    );
    return request$.pipe(map((res) => res.data));
  }

  public editComment(dto: EditCommentDto): Observable<any> {
    return this._http.patch(`${env.be.url}/comments/${dto.commentId}`, dto);
  }

  public reactComment(dto: CommentReaction): Observable<any> {
    return this._http.post<ApiRes<CommentReaction>>(`${env.be.url}/comment-reactions`, dto);
  }

  public deleteComment(commentId: string): Observable<ApiRes<any>> {
    return this._http.delete<ApiRes<any>>(`${env.be.url}/comments/${commentId}`);
  }
}

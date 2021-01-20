import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { Comment, CreateCommentDto, GetCommentsByPostIdDto, GetRepliesByCommentIdDto } from "./comment.interface";
import { environment as env } from 'src/environments/environment';
import { ApiRes } from "../interfaces";

@Injectable({ providedIn: 'root' })
export class CommentService {
  constructor(private _http: HttpClient) { }

  public getCommentsByPostId(
    getCommentsByPostIdDto: GetCommentsByPostIdDto
  ): Observable<Comment[]> {
    const { postId, pageNumber, limit } = getCommentsByPostIdDto;

    let httpParams = new HttpParams();
    if (postId) httpParams = httpParams.set('postId', postId);
    if (pageNumber) httpParams = httpParams.set('page', pageNumber.toString());
    if (limit) httpParams = httpParams.set('limit', limit.toString());

    const request$ = this._http.get<ApiRes<Comment[]>>(
      `${env.be.url}/comments`,
      { params: httpParams }
    );
    return request$.pipe(map(res => res.data));
  }

  public getCommentById(commentId: string): Observable<Comment> {
    let httpParams = new HttpParams();
    httpParams = httpParams.set('includingReplies', 'true');

    const request$ = this._http.get<ApiRes<Comment>>(
      `${env.be.url}/comments/${commentId}`,
      { params: httpParams }
    );
    return request$.pipe(map(res => res.data));
  }

  public getRepliesByCommentId(
    getRepliesByCommentIdDto: GetRepliesByCommentIdDto
  ): Observable<Comment[]> {
    const { commentId, pageNumber, limit } = getRepliesByCommentIdDto;

    let httpParams = new HttpParams();
    if (pageNumber) httpParams = httpParams.set('page', pageNumber.toString());
    if (limit) httpParams = httpParams.set('limit', limit.toString());

    const request$ = this._http.get<ApiRes<Comment[]>>(
      `${env.be.url}/comments/${commentId}/replies`,
      { params: httpParams }
    );
    return request$.pipe(map(res => res.data));
  }

  public addComment(createCommentDto: CreateCommentDto): Observable<Comment> {
    const request$ = this._http.post<ApiRes<Comment>>(
      `${env.be.url}/comments`, createCommentDto
    );
    return request$.pipe(map(res => res.data));
  }
}
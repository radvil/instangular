import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { Comment, CreateCommentDto } from "./comment.interface";
import { environment as env } from 'src/environments/environment';
import { ApiRes } from "../interfaces";

@Injectable({ providedIn: 'root' })
export class CommentService {
  constructor(private _http: HttpClient) { }

  public getCommentsByPostId(postId: string, nextIndex?: number): Observable<Comment[]> {
    const pageQuery = nextIndex ? `page=${nextIndex}` : `page=1`;
    const request$ = this._http.get<ApiRes<Comment[]>>(
      `${env.be.url}/comments?postId=${postId}&${pageQuery}&limit=5`
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
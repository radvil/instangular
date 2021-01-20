import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { environment as env } from 'src/environments/environment';
import { ApiRes } from "src/app/_core/interfaces";
import { CreateReplyDto, GetRepliesDto, Reply } from "../interfaces";

@Injectable({ providedIn: 'root' })
export class ReplyService {
  constructor(private _http: HttpClient) { }

  public getRepliesByCommentId(
    getRepliesDto: GetRepliesDto
  ): Observable<Reply[]> {
    const { commentId, pageNumber, limit } = getRepliesDto;

    let httpParams = new HttpParams();
    if (pageNumber) httpParams = httpParams.set('page', pageNumber.toString());
    if (limit) httpParams = httpParams.set('limit', limit.toString());

    const request$ = this._http.get<ApiRes<Reply[]>>(
      `${env.be.url}/comments/${commentId}/replies`,
      { params: httpParams }
    );
    return request$.pipe(map((res) => res.data));
  }

  public createNewReply(dto: CreateReplyDto): Observable<Reply> {
    const request$ = this._http.post<ApiRes<Reply>>(`${env.be.url}/comments`, dto);
    return request$.pipe(map(res => res.data));
  }
}
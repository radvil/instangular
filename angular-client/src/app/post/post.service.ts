import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { Post } from "./post.interface";
import { environment as env } from 'src/environments/environment';

interface JsonHttpResponse<T> {
  status: number;
  message?: string;
  total?: number;
  data?: T;
}

@Injectable({ providedIn: 'root' })
export class PostService {
  constructor(
    private _http: HttpClient,
  ) { }

  public getIncrementalPosts(nextIndex?: number): Observable<Post[]> {
    const query = nextIndex ? `page=${nextIndex}` : `page=1`;
    return this._http.get<JsonHttpResponse<Post[]>>(`${env.be.url}/posts?${query}`)
    .pipe( map(res => res.data) )
  }
}
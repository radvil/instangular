import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { tap } from "rxjs/operators";
import { FollowRequest } from "../interfaces";

const followRequests = <FollowRequest[]>[
  {
    isApproved: false,
    requester: {
      _id: "123",
      photo: "assets/images/portrait.jpg",
      photoThumb: "assets/images/portrait.jpg",
      username: "user1",
      lastLoggedInAt: "2021-02-10T15:03:36.766Z"
    },
    receiver: "890",
    createdAt: "2021-02-10T15:03:36.766Z",
    updatedAt: "2021-02-10T15:03:36.766Z"
  },
  {
    isApproved: false,
    requester: {
      _id: "234",
      photo: "assets/images/portrait.jpg",
      photoThumb: "assets/images/portrait.jpg",
      username: "user2",
      lastLoggedInAt: "2021-02-10T15:03:36.766Z"
    },
    receiver: "890",
    createdAt: "2021-02-10T15:03:36.766Z",
    updatedAt: "2021-02-10T15:03:36.766Z"
  },
  {
    isApproved: false,
    requester: {
      _id: "345",
      photo: "assets/images/portrait.jpg",
      photoThumb: "assets/images/portrait.jpg",
      username: "user3",
      lastLoggedInAt: "2021-02-10T15:03:36.766Z"
    },
    receiver: "890",
    createdAt: "2021-02-10T15:03:36.766Z",
    updatedAt: "2021-02-10T15:03:36.766Z"
  }
]

@Injectable({ providedIn: 'root' })
export class FollowRequestService {
  public followReqsSub = new BehaviorSubject<FollowRequest[]>([]);

  constructor(private _http: HttpClient) {
  }

  getFollowRequests(): Observable<FollowRequest[]> {
    return of(followRequests).pipe(
      tap(reqs => this.followReqsSub.next(reqs))
    );
  }
}
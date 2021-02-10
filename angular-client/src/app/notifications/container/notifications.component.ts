import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, Subscription } from 'rxjs';
import { UserBasic } from "src/app/user";

import { FollowRequest } from '../interfaces';
import { FollowRequestService } from '../services';

enum Tabs {
  FOLLOW_REQUESTS = "Follow Requests",
  NOTIFICATIONS = "Notifications"
}

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit, OnDestroy {
  private _subscription = new Subscription();
  public selectedTab: string = Tabs.FOLLOW_REQUESTS;

  constructor(
    private _frService: FollowRequestService,
    private _router: Router,
  ) { }

  get followRequests(): FollowRequest[] {
    return this._frService.followReqsSub.value;
  }

  ngOnInit(): void {
    this.getFollowRequests();
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  switchTab(selectedTab: string): void {
    this.selectedTab = selectedTab;
  }

  getTabColor(selectedTab: string): string {
    return selectedTab === this.selectedTab ? "accent" : null
  }

  showUser(event: UserBasic) {
    this._router.navigate(['user', event.username]);
  }

  approveRequest(event: boolean) {
    console.log("Follow request approved === " + event);
  }

  declineRequest(event: boolean) {
    console.log("Follow request decline === " + event);
  }

  private getFollowRequests(): void {
    this._subscription.add(
      this._frService.getFollowRequests().subscribe()
    );
  }
}
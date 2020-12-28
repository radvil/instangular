import { Component, OnInit } from '@angular/core';
import { authUser } from './auth';
import { User } from './users';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public authUser: User;
  public isShrinkMode = false;

  public switchLayoutMode() {
    this.isShrinkMode = !this.isShrinkMode;
  }

  ngOnInit(): void {
    this.authUser = authUser;
  }

  constructor() { }
}

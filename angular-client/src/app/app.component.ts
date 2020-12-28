import { Component, OnInit } from '@angular/core';
import { authUser, User } from './users';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public authUser: User;

  constructor() {}

  ngOnInit(): void {
    this.authUser = authUser;
  }
}

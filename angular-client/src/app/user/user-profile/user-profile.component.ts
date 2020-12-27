import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, share, switchMap } from 'rxjs/operators';

// 3rd parties
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faGithub, faFacebook, faTwitter } from '@fortawesome/free-brands-svg-icons';

import { User } from '../user.interface';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  public user$: Observable<User>;
  public errorImagePath = "assets/images/portrait.jpg";

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    public faIconLibrary: FaIconLibrary,
  ) {
    faIconLibrary.addIcons(
			faGithub,
			faFacebook,
			faTwitter,
		);
  }

  ngOnInit(): void {
    this.getUserProfile();
  }

  public editProfile(username: string) {
    this._router.navigate(['user', username, 'edit'])
  }

  private getUserProfile(): void {
    this.user$ = this._route.paramMap.pipe(
      map(param => param.get('username')),
      switchMap(username => this._userService.getUserUsername(username)),
      share()
    );
  }
}

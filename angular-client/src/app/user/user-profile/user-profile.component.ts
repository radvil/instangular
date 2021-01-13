import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, share, switchMap, tap } from 'rxjs/operators';
// 3rd parties
import { Store } from '@ngrx/store';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faGithub, faFacebook, faTwitter } from '@fortawesome/free-brands-svg-icons';
// locals
import { Post } from 'src/app/post';
import { Logout } from 'src/app/auth/store/auth.actions';
import { User } from '../user.interface';
import { GetUser } from '../store/user.actions';
import { $_user, $_userError, $_userLoading } from '../store/user.selectors';
import { $_postsOfUser } from 'src/app/post/store/post.selectors';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  public user$: Observable<User>;
  public posts$: Observable<Post[]>;
  public isLoading$: Observable<boolean>;
  public httpError$: Observable<Error>;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _store: Store<Post | User>,
    public faIconLibrary: FaIconLibrary,
  ) {
    faIconLibrary.addIcons(
      faGithub,
      faFacebook,
      faTwitter,
    );
  }

  ngOnInit(): void {
    this.initValues();
  }

  public editProfile(username: string) {
    this._router.navigate(['user', username, 'edit'])
  }

  private initValues(): void {
    this.isLoading$ = this._store.select($_userLoading);
    this.httpError$ = this._store.select($_userError);

    this.user$ = this._route.paramMap.pipe(
      map(param => param.get('username')),
      tap(username => this.getUserAndSetPosts(username)),
      switchMap(() => this._store.select($_user)),
      share()
    );
  }

  private getUserAndSetPosts(username: string): void {
    this._store.dispatch(GetUser({ username }));
    this.posts$ = this._store.select($_postsOfUser);
  }

  public logout(): void {
    this._store.dispatch(Logout());
  }

  public showUserSettings(): void {
    alert('TODO:// show user\'s settings');
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
// 3rd parties
import { Store } from '@ngrx/store';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faGithub, faFacebook, faTwitter } from '@fortawesome/free-brands-svg-icons';
// locals
import { Post } from 'src/app/post';
import { Logout } from 'src/app/auth/store/auth.actions';
import { $_user, $_userError, $_userLoading } from '../../store/user.selectors';
import { $_postsOfUser } from 'src/app/post/store/post.selectors';
import { $_authUser } from 'src/app/auth/store/auth.selectors';
import { GetUser } from '../../store/user.actions';
import { User } from '../../interfaces';
import { AuthService } from 'src/app/auth';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, OnDestroy {
  private _subscription = new Subscription();
  public authUser$: Observable<User>;
  public user$: Observable<User>;
  public posts$: Observable<Post[]>;
  public isLoading$: Observable<boolean>;
  public httpError$: Observable<Error>;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _store: Store,
    private _authService: AuthService,
    public faIconLibrary: FaIconLibrary,
  ) {
    faIconLibrary.addIcons(
      faGithub,
      faFacebook,
      faTwitter,
    );
  }

  get isSelf$(): Observable<boolean> {
    return this.authUser$.pipe(
      filter(authUser => !!authUser),
      switchMap(authUser => this.user$.pipe(
        filter(user => !!user),
        map(user => authUser._id === user._id)
      ))
    )
  }

  ngOnInit(): void {
    this.initValues();
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  public editProfile(username: string) {
    this._router.navigate(['user', username, 'edit'])
  }

  private initValues(): void {
    this.authUser$ = this._store.select($_authUser);
    this.isLoading$ = this._store.select($_userLoading);
    this.httpError$ = this._store.select($_userError);

    this._subscription.add(
      this._route.paramMap
        .pipe(map(param => param.get('username')))
        .subscribe(username => this.getUserAndSetPosts(username))
    );
    this.user$ = this._store.select($_user).pipe(filter(user => !!user));
  }

  private getUserAndSetPosts(username: string): void {
    this._store.dispatch(GetUser({ username }));
    this.posts$ = this._store.select($_postsOfUser);
  }

  public goToAccountSettings(): void {
    this._router.navigate(['account', 'settings']);
  }

  public logoutUser(): void {
    this._subscription.add(
      this._authService
        .logout()
        .subscribe(({ status }) => {
          console.log(status)
          if (status == 200) this._store.dispatch(Logout());
        })
    )
  }

  public showUserSettings(): void {
    alert('TODO:// show user\'s settings');
  }

}

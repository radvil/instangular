import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, share, switchMap, tap } from 'rxjs/operators';
// 3rd parties
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faGithub, faFacebook, faTwitter } from '@fortawesome/free-brands-svg-icons';
// locals
import { UserService } from '../user.service';
import { User } from '../user.interface';
import { Post } from 'src/app/post';
import { Store } from '@ngrx/store';
import { PushManyPosts } from 'src/app/post/store/post.actions';
import { $_posts } from 'src/app/post/store/post.selectors';
import { Logout } from 'src/app/auth/store/auth.actions';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  public user$: Observable<User>;
  public posts$: Observable<Post[]>;
  public errorImagePath = "assets/images/portrait.jpg";

  private _usernameFromParam: string;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _store: Store<Post>,
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
    this.setInitialPosts();
  }

  private setInitialPosts(): void {
    this.posts$ = this._store.select($_posts).pipe(
      map(posts => posts.filter(post => post.postedBy.username == this._usernameFromParam))
    );
  }

  public editProfile(username: string) {
    this._router.navigate(['user', username, 'edit'])
  }

  private getUserProfile(): void {
    this.user$ = this._route.paramMap.pipe(
      map(param => param.get('username')),
      tap(param => this._usernameFromParam = param),
      switchMap(username => this._userService.getUserUsername(username).pipe(
        tap(({ posts }) => this._store.dispatch(PushManyPosts({ posts })))
      )),
      share()
    );
  }

  public logout(): void {
    this._store.dispatch(Logout());
  }
}

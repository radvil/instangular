import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AuthState } from 'src/app/auth/store/auth.model';
import { $_authUser } from 'src/app/auth/store/auth.selectors';
import { User } from 'src/app/user';

@Component({
  selector: 'app-form-field',
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormFieldComponent {

  public commentInputText: string;
  public authUser$: Observable<User>;

  @Input() placeholder: string;
  @Output() onInputConfirmed = new EventEmitter<string>();

  constructor(private _store: Store<AuthState>) {
    this.authUser$ = this._store.select($_authUser);
  }

  confirmInput(): void {
    if (this.commentInputText) {
      this.onInputConfirmed.emit(this.commentInputText);
      this.commentInputText = "";
    }
  }

}

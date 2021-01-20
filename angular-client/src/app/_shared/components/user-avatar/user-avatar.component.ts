import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from 'src/app/user';

@Component({
  selector: 'app-user-avatar',
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.scss']
})
export class UserAvatarComponent {
  @Input() user: User;
  @Input() imageHeight = "40";
  @Input() imageWidth = "40";
  @Input() clickable = false;
  @Output() clickUser: EventEmitter<User>;

  public get imageContainerStyle() {
    return {
      cursor: this.clickable ? "pointer" : "none",
      height: `${parseInt(this.imageHeight) + 6}px`,
      width: `${parseInt(this.imageHeight) + 6}px`
    }
  }

  constructor() {
    if (this.clickable) {
      this.clickUser = new EventEmitter();
    }
  }

  onClickUser(userEvent: User): void {
    if (this.clickable) {
      this.clickUser.emit(userEvent);
    }
  }

}

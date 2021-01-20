import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User, UserBasic } from 'src/app/user';

@Component({
  selector: 'app-user-avatar',
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.scss']
})
export class UserAvatarComponent {
  @Input() user: UserBasic;
  @Input() imageHeight = "40";
  @Input() imageWidth = "40";
  @Input() clickable = false;
  @Input() bordered = false;
  @Output() clickUser = new EventEmitter<UserBasic>();

  public get imageContainerStyle() {
    return {
      cursor: this.clickable ? "pointer" : "initial",
      height: `${parseInt(this.imageHeight) + 6}px`,
      width: `${parseInt(this.imageHeight) + 6}px`,
      border: this.bordered ? `2px solid red`: 'none'
    }
  }

  onClickUser(userEvent: User): void {
    if (this.clickable) {
      this.clickUser.emit(userEvent);
    }
  }

}

import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';
import { UserBasic } from 'src/app/user/interfaces';
import { FollowRequest } from '../../interfaces';

@Component({
  selector: 'app-follow-request',
  templateUrl: './follow-request.component.html',
  styleUrls: ['./follow-request.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FollowRequestComponent {
  @Input() req: FollowRequest;
  @Output() clickUser = new EventEmitter<UserBasic>();
  @Output() clickApprove = new EventEmitter<boolean>();
  @Output() clickDecline = new EventEmitter<boolean>();

  constructor() { }

}

import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-menu-actions',
  templateUrl: './menu-actions.component.html',
  styleUrls: ['./menu-actions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuActionsComponent {
  @Input('key') uniqueKey: any;
  @Input() canEdit: boolean;
  @Input() canDelete: boolean;
  @Output() onClickedEdit = new EventEmitter<string>();
  @Output() onClickedDelete = new EventEmitter<string>();

  editItem() {
    this.onClickedEdit.emit(this.uniqueKey);
  }

  deleteItem() {
    this.onClickedDelete.emit(this.uniqueKey);
  }
}

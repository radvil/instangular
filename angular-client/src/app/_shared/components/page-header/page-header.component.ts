import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss']
})
export class PageHeaderComponent {

  @Input() style: string;
  @Input() title: string;
  @Input() icon: string;
  @Output() onIconClicked = new EventEmitter<any>();

  public emitIconClick() {
    this.onIconClicked.emit();
  }
}
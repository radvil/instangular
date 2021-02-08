import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { UserBasic } from 'src/app/user';

@Component({
  selector: 'app-form-field',
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.scss'],
})
export class FormFieldComponent {
  @Input() user: UserBasic;
  @Input() placeholder: string;
  @Output() submitInput = new EventEmitter<string>();
  @ViewChild('inputField') input: HTMLInputElement;
  public commentInputText: string;

  constructor() {
  }

  onSubmitInput(): void {
    if (this.commentInputText) {
      this.submitInput.emit(this.commentInputText);
      this.commentInputText = "";
    }
  }

}

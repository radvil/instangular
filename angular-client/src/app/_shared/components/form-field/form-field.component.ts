import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from 'src/app/user';

@Component({
  selector: 'app-form-field',
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormFieldComponent {
  public commentInputText: string;

  @Input() user: User;
  @Input() placeholder: string;
  @Output() submitInput = new EventEmitter<string>();

  onSubmitInput(): void {
    if (this.commentInputText) {
      this.submitInput.emit(this.commentInputText);
      this.commentInputText = "";
    }
  }

}

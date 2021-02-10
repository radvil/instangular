import { AbstractControl, ValidatorFn } from '@angular/forms';

type MatchFunction = (formControl: AbstractControl) => Validator;
type Validator = ValidatorFn | ValidatorFn[];

interface ConfirmationDto {
  fieldName: string;
  confirmName: string;
}

export class ConfirmPasswordValidator {
  static Match(dto: ConfirmationDto): MatchFunction {
    return function (formControl: AbstractControl): Validator {
      const password = formControl.get(dto.fieldName);
      const confirmPassword = formControl.get(dto.confirmName);

      if (password.value !== confirmPassword.value) {
        confirmPassword.setErrors({ shouldMatch: true });
      } else {
        return null;
      }
    };
  }
}

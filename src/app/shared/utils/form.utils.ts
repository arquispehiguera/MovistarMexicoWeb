import { AbstractControl } from '@angular/forms';

export function isInvalid(control: AbstractControl | null): boolean {
  return !!control && control.invalid && (control.dirty || control.touched);
}

import { Component, effect } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SpinnerComponent } from '../../components/spinner/spinner';
import { isInvalid } from '../../../shared/utils/form.utils';
import { LoginUseCase } from '../../../domain/use-cases/auth.use-cases';
import { Credentials } from '../../../domain/entities/credentials.entity';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SpinnerComponent

  ],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  form!: FormGroup;
  passwordVisible = false;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    public loginUseCase: LoginUseCase,
  ) {
    this.form = this.fb.group({
      usuario: ['', Validators.required],
      password: ['', Validators.required]
    });


    effect(() => {
      if (this.loginUseCase.user()) {
        this.router.navigate(['/dashboard']);
      }
    });

  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }




  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const credentials = new Credentials(
      this.form.value.usuario,
      this.form.value.password
    );

    this.loginUseCase.execute(credentials).subscribe();
    // El effect en el constructor se encargará de redirigir al dashboard
  }


  invalid(name: string): boolean {
    return isInvalid(this.form.get(name));
  }
}

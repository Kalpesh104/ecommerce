import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  private fb = inject(FormBuilder);

  signupForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  }, {
    validators: (form) => {
      const pass = form.get('password')?.value;
      const confirm = form.get('confirmPassword')?.value;
      return pass === confirm ? null : { passwordMismatch: true };
    }
  });

  submitted = false;
  successMessage = '';
  errorMessage = '';

  onSubmit() {
    this.submitted = true;

    if (this.signupForm.invalid) return;

    const { name, email, password } = this.signupForm.value;

    // Simulate API call or forward to service
    console.log('Registering:', { name, email, password });

    this.successMessage = 'Signup successful!';
    this.errorMessage = '';
    this.signupForm.reset();
    this.submitted = false;
  }
}
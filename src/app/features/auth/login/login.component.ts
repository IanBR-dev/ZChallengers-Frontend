import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthFormComponent } from './components/auth-form.component';
import { InputFieldComponent } from './components/input-field.component';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, AuthFormComponent, InputFieldComponent],
  template: `
    <div
      class="min-h-screen flex items-center justify-center bg-black 
                bg-[radial-gradient(circle_at_center,_var(--dark-gold)_0%,_transparent_50%)]"
    >
      <div class="max-w-md w-full mx-4">
        <div
          class="text-center mb-8 transform transition-all duration-300 hover:scale-105"
        >
          <h1 class="text-5xl font-bold gold-gradient animate-pulse">
            GAME LOBBY
          </h1>
          <p class="text-gray-400 mt-2 transition-opacity duration-300">
            {{ showRegister ? 'Join the battle' : 'Welcome back, warrior' }}
          </p>
        </div>

        <!-- Login Form -->
        <app-auth-form
          *ngIf="!showRegister"
          [error]="error"
          [isLoading]="isLoading"
          submitText="Sign In"
          toggleText="Don't have an account?"
          toggleButtonText="Create one"
          (onSubmit)="onSubmit()"
          (onToggle)="showRegister = true"
        >
          <app-input-field
            label="Username"
            [(value)]="username"
            name="username"
            [hasError]="!!error && !username"
            placeholder="Enter your username"
            autocomplete="username"
          ></app-input-field>

          <app-input-field
            label="Password"
            type="password"
            [(value)]="password"
            name="password"
            [hasError]="!!error && !password"
            placeholder="Enter your password"
            autocomplete="current-password"
          ></app-input-field>
        </app-auth-form>

        <!-- Register Form -->
        <app-auth-form
          *ngIf="showRegister"
          [error]="error"
          [isLoading]="isLoading"
          submitText="Create Account"
          toggleText="Already have an account?"
          toggleButtonText="Sign in"
          (onSubmit)="onRegister()"
          (onToggle)="showRegister = false"
        >
          <app-input-field
            label="Username"
            [(value)]="registerData.username"
            name="regUsername"
            [hasError]="!!error && !registerData.username"
            placeholder="Choose your username"
            autocomplete="username"
          ></app-input-field>

          <app-input-field
            label="Password"
            type="password"
            [(value)]="registerData.password"
            name="regPassword"
            [hasError]="!!error && !registerData.password"
            placeholder="Create a password"
            autocomplete="new-password"
          ></app-input-field>

          <app-input-field
            label="Confirm Password"
            type="password"
            [(value)]="registerData.confirmPassword"
            name="confirmPassword"
            [hasError]="!!error && !registerData.confirmPassword"
            placeholder="Confirm your password"
            autocomplete="new-password"
          ></app-input-field>
        </app-auth-form>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .gold-gradient {
        background: linear-gradient(to right, #ffd700, #b8860b);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    `,
  ],
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';
  isLoading = false;
  showRegister = false;

  registerData = {
    username: '',
    password: '',
    confirmPassword: '',
  };

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (!this.username || !this.password) {
      this.error = 'Please fill in all fields';
      return;
    }

    this.isLoading = true;
    this.error = '';

    this.authService
      .login({
        username: this.username,
        password: this.password,
      })
      .subscribe({
        next: () => {
          this.router.navigate(['/lobby']);
        },
        error: (err) => {
          this.error = 'Invalid username or password';
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        },
      });
  }

  onRegister() {
    if (
      !this.registerData.username ||
      !this.registerData.password ||
      !this.registerData.confirmPassword
    ) {
      this.error = 'Please fill in all fields';
      return;
    }

    if (this.registerData.password !== this.registerData.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    this.isLoading = true;
    this.error = '';

    this.authService
      .register({
        username: this.registerData.username,
        password: this.registerData.password,
      })
      .subscribe({
        next: () => {
          this.router.navigate(['/lobby']);
        },
        error: (err) => {
          this.error = 'Registration failed. Please try again.';
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        },
      });
  }
}

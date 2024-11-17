import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Login View -->
    <div
      class="min-h-screen flex items-center justify-center bg-black bg-[radial-gradient(circle_at_center,_var(--dark-gold)_0%,_transparent_50%)]"
    >
      <div class="max-w-md w-full mx-4">
        <div class="text-center mb-8">
          <h1 class="text-5xl font-bold gold-gradient">GAME LOBBY</h1>
          <p class="text-gray-400 mt-2">
            {{ showRegister ? 'Join the battle' : 'Welcome back, warrior' }}
          </p>
        </div>

        <!-- Login Form -->
        <form
          *ngIf="!showRegister"
          (ngSubmit)="onSubmit()"
          class="space-y-6 gold-border bg-black/50 p-8 rounded-lg backdrop-blur-sm"
        >
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">
              Username
            </label>
            <input
              type="text"
              [(ngModel)]="username"
              name="username"
              required
              class="w-full bg-black/50 border border-gold/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/50"
              [class.border-red-500]="error && !username"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">
              Password
            </label>
            <input
              type="password"
              [(ngModel)]="password"
              name="password"
              required
              class="w-full bg-black/50 border border-gold/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/50"
              [class.border-red-500]="error && !password"
              placeholder="Enter your password"
            />
          </div>

          <div *ngIf="error" class="text-red-500 text-sm animate-fadeIn">
            {{ error }}
          </div>

          <button
            type="submit"
            class="gold-button w-full relative h-10"
            [disabled]="isLoading"
          >
            <span [class.opacity-0]="isLoading">Sign In</span>
            <div
              *ngIf="isLoading"
              class="absolute inset-0 flex items-center justify-center"
            >
              <div
                class="animate-spin rounded-full h-6 w-6 border-2 border-black border-t-transparent"
              ></div>
            </div>
          </button>

          <div class="text-center text-gray-400">
            <span>Don't have an account? </span>
            <button
              type="button"
              (click)="showRegister = true"
              class="text-gold hover:text-dark-gold transition-colors"
            >
              Create one
            </button>
          </div>
        </form>

        <!-- Register Form -->
        <form
          *ngIf="showRegister"
          (ngSubmit)="onRegister()"
          class="space-y-6 gold-border bg-black/50 p-8 rounded-lg backdrop-blur-sm"
        >
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">
              Username
            </label>
            <input
              type="text"
              [(ngModel)]="registerData.username"
              name="regUsername"
              required
              class="w-full bg-black/50 border border-gold/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/50"
              placeholder="Choose your username"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">
              Email
            </label>
            <input
              type="email"
              [(ngModel)]="registerData.email"
              name="email"
              required
              class="w-full bg-black/50 border border-gold/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/50"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">
              Password
            </label>
            <input
              type="password"
              [(ngModel)]="registerData.password"
              name="regPassword"
              required
              class="w-full bg-black/50 border border-gold/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/50"
              placeholder="Create a password"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              [(ngModel)]="registerData.confirmPassword"
              name="confirmPassword"
              required
              class="w-full bg-black/50 border border-gold/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/50"
              placeholder="Confirm your password"
            />
          </div>

          <div *ngIf="error" class="text-red-500 text-sm animate-fadeIn">
            {{ error }}
          </div>

          <div class="flex gap-4">
            <button
              type="submit"
              class="gold-button flex-1"
              [disabled]="isLoading"
            >
              Create Account
            </button>
            <button
              type="button"
              class="gold-button flex-1"
              (click)="showRegister = false"
            >
              Cancel
            </button>
          </div>

          <div class="text-center text-gray-400">
            <span>Already have an account? </span>
            <button
              type="button"
              (click)="showRegister = false"
              class="text-gold hover:text-dark-gold transition-colors"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class LoginComponent {
  // Auth related
  username = '';
  password = '';
  error = '';
  isLoading = false;
  showRegister = false;

  // Register form
  registerData = {
    username: '',
    email: '',
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
      !this.registerData.email ||
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

    const data = {
      username: this.registerData.username,
      password: this.registerData.password,
      email: this.registerData.email,
    };

    this.authService.register(data).subscribe({
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

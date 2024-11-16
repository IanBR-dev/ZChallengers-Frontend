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
    <div class="min-h-screen flex items-center justify-center bg-black">
      <div class="max-w-md w-full mx-4">
        <div class="text-center mb-8">
          <h1 class="text-4xl font-bold gold-gradient">GAME LOBBY</h1>
          <p class="text-gray-400 mt-2">Sign in to continue</p>
        </div>

        <form
          (ngSubmit)="onSubmit()"
          class="space-y-6 gold-border bg-black/50 p-8 rounded-lg"
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
              class="w-full bg-black/50 border border-gold/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-gold focus:outline-none"
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
              class="w-full bg-black/50 border border-gold/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-gold focus:outline-none"
              [class.border-red-500]="error && !password"
              placeholder="Enter your password"
            />
          </div>

          <div *ngIf="error" class="text-red-500 text-sm animate-fadeIn">
            {{ error }}
          </div>

          <button
            type="submit"
            class="gold-button w-full relative"
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
        </form>
      </div>
    </div>
  `,
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';
  isLoading = false;

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
}

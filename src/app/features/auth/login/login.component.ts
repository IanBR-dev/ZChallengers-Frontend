import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthFormComponent } from './components/auth-form.component';
import { InputFieldComponent } from './components/input-field.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, AuthFormComponent, InputFieldComponent],
  template: `
    <div class="min-h-screen flex relative overflow-hidden">
      <!-- Background Video/Image Container -->
      <div class="absolute inset-0 w-full h-full">
        <video
          *ngIf="showVideo"
          class="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 flip-horizontal"
          autoplay
          loop
          muted
          playsinline
        >
          <source src="assets/videos/login-background.mp4" type="video/mp4" />
        </video>
        <img
          *ngIf="!showVideo"
          src="assets/images/login-background.jpg"
          class="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 flip-horizontal"
          alt="background"
        />
        <div
          class="absolute inset-0"
          style="background: var(--bg-overlay)"
        ></div>
      </div>

      <!-- Auth Container -->
      <div
        class="w-[440px] glass h-screen relative z-10"
        [class.slide-out]="isLoggedIn"
      >
        <div class="p-12 h-full flex flex-col animate-slide-up">
          <!-- Logo -->
          <div class="mb-2">
            <img src="assets/images/logo.png" alt="Dreisafio" class="h-24" />
          </div>

          <!-- Title -->
          <h1
            class="text-2xl font-bold mb-8"
            style="color: var(--text-primary)"
          >
            {{ !showRegister ? 'Iniciar sesión' : 'Crear cuenta' }}
          </h1>

          <!-- Login Form -->
          <app-auth-form
            *ngIf="!showRegister"
            [error]="error"
            [isLoading]="isLoading"
            [isValid]="isLoginFormValid"
            submitText="INICIAR SESIÓN"
            (onSubmit)="onSubmit()"
          >
            <app-input-field
              label="NOMBRE DE USUARIO"
              [(value)]="username"
              name="username"
              [hasError]="!!error && !username"
              autocomplete="username"
              (valueChange)="validateLoginForm()"
            ></app-input-field>

            <app-input-field
              label="CONTRASEÑA"
              type="password"
              [(value)]="password"
              name="password"
              [hasError]="!!error && !password"
              autocomplete="current-password"
              (valueChange)="validateLoginForm()"
            ></app-input-field>
          </app-auth-form>

          <!-- Register Form -->
          <app-auth-form
            *ngIf="showRegister"
            [error]="error"
            [isLoading]="isLoading"
            [isValid]="isRegisterFormValid"
            submitText="CREAR CUENTA"
            (onSubmit)="onRegister()"
          >
            <app-input-field
              label="NOMBRE DE USUARIO"
              [(value)]="registerData.username"
              name="regUsername"
              [hasError]="!!error && !registerData.username"
              autocomplete="username"
              (valueChange)="validateRegisterForm()"
            ></app-input-field>

            <app-input-field
              label="CONTRASEÑA"
              type="password"
              [(value)]="registerData.password"
              name="regPassword"
              [hasError]="!!error && !registerData.password"
              autocomplete="new-password"
              (valueChange)="validateRegisterForm()"
            ></app-input-field>

            <app-input-field
              label="CONFIRMAR CONTRASEÑA"
              type="password"
              [(value)]="registerData.confirmPassword"
              name="confirmPassword"
              [hasError]="!!error && !registerData.confirmPassword"
              autocomplete="new-password"
              (valueChange)="validateRegisterForm()"
            ></app-input-field>
          </app-auth-form>

          <!-- Toggle Register/Login -->
          <button
            (click)="toggleRegister()"
            class="mt-4 text-sm hover:underline transition-colors duration-200"
            style="color: var(--primary)"
          >
            {{
              !showRegister
                ? '¿No tienes cuenta? Crear una'
                : '¿Ya tienes cuenta? Inicia sesión'
            }}
          </button>

          <!-- Version Info -->
          <div class="mt-auto text-xs" style="color: var(--text-muted)">
            <span>v99.0.2</span>
          </div>
        </div>
      </div>

      <!-- Video Toggle Button -->
      <button
        (click)="toggleVideo()"
        class="absolute bottom-4 right-4 bg-black/50 hover:bg-black/70 
               text-white rounded-full p-3 transition-all duration-200 z-20"
        title="{{ showVideo ? 'Desactivar video' : 'Activar video' }}"
      >
        <span class="material-symbols-outlined text-xl">
          {{ showVideo ? 'video_off' : 'video' }}
        </span>
      </button>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      video,
      img {
        @apply opacity-0;
        animation: fadeIn 0.5s ease-in-out forwards;
      }
      .flip-horizontal {
        transform: scaleX(-1);
      }
      .slide-out {
        animation: slideOut 0.5s ease-in-out forwards;
      }
      @keyframes slideOut {
        to {
          transform: translateX(-100%);
          opacity: 0;
        }
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
  showVideo = true;
  isLoginFormValid = false;
  isRegisterFormValid = false;
  isLoggedIn = false;

  registerData = {
    username: '',
    password: '',
    confirmPassword: '',
  };

  constructor(private authService: AuthService, private router: Router) {}

  toggleVideo() {
    this.showVideo = !this.showVideo;
  }

  toggleRegister() {
    this.showRegister = !this.showRegister;
    this.error = '';
  }

  validateLoginForm() {
    this.isLoginFormValid =
      this.username.length >= 1 && this.password.length >= 1;
  }

  validateRegisterForm() {
    this.isRegisterFormValid =
      this.registerData.username.length >= 1 &&
      this.registerData.password.length >= 1 &&
      this.registerData.password === this.registerData.confirmPassword;
  }

  onSubmit() {
    if (!this.isLoginFormValid) {
      this.error = 'Por favor complete todos los campos correctamente';
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
          this.isLoggedIn = true;
          setTimeout(() => {
            this.router.navigate(['/lobby']);
          }, 500);
        },
        error: (err) => {
          this.error = 'Usuario o contraseña inválidos';
          this.isLoading = false;
        },
      });
  }

  onRegister() {
    if (!this.isRegisterFormValid) {
      this.error = 'Por favor complete todos los campos correctamente';
      return;
    }

    if (this.registerData.password !== this.registerData.confirmPassword) {
      this.error = 'Las contraseñas no coinciden';
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
          this.isLoggedIn = true;
          setTimeout(() => {
            this.router.navigate(['/lobby']);
          }, 500);
        },
        error: (err) => {
          this.error =
            'Error al crear la cuenta. Por favor intente nuevamente.';
          this.isLoading = false;
        },
      });
  }
}

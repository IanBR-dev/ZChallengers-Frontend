import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> | Promise<boolean> {
    const token = localStorage.getItem('auth_token');

    if (!token) {
      this.router.navigate(['/login']);
      return Promise.resolve(false);
    }

    return this.authService.loadUserFromToken();
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { Player, Credentials, AuthResponse } from '../models/types';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<Player | null>(null);
  private readonly TOKEN_KEY = 'auth_token';

  constructor() {
    // Check for existing token on startup
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (token) {
      this.loadUserFromToken(token);
    }
  }

  login(credentials: Credentials): Observable<AuthResponse> {
    // Simulate API call
    return of({
      token: 'mock_jwt_token',
      user: {
        id: '1',
        username: credentials.username,
        rank: 'Gold III',
        avatar:
          'https://api.dicebear.com/7.x/avataaars/svg?seed=' +
          credentials.username,
      },
    }).pipe(
      delay(1000),
      tap((response) => {
        localStorage.setItem(this.TOKEN_KEY, response.token);
        this.currentUserSubject.next(response.user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): Observable<Player | null> {
    return this.currentUserSubject.asObservable();
  }

  private loadUserFromToken(token: string): void {
    // In a real app, decode JWT token or make API call
    const mockUser: Player = {
      id: '1',
      username: 'Returning Player',
      rank: 'Gold III',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=player1',
    };
    this.currentUserSubject.next(mockUser);
  }
}

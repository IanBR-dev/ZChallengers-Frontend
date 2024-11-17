import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
import { LOGIN, REGISTER } from '../graphql/auth.graphql';
import { GET_ME } from '../graphql/users.graphql';
import {
  LoginMutation,
  RegisterMutation,
  MeQuery,
  LoginInput,
  RegisterInput,
} from '../generated/graphql';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  private readonly TOKEN_KEY = 'auth_token';

  constructor(private apollo: Apollo) {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (token) {
      this.loadUserFromToken();
    }
  }

  login(
    credentials: LoginInput
  ): Observable<NonNullable<LoginMutation['login']>> {
    return this.apollo
      .mutate<LoginMutation>({
        mutation: LOGIN,
        variables: { input: credentials },
      })
      .pipe(
        map((result) => result.data?.login),
        filter(
          (response): response is NonNullable<typeof response> => !!response
        ), // Excluir undefined
        tap((response) => {
          localStorage.setItem(this.TOKEN_KEY, response.token);
          this.currentUserSubject.next(response.user);
        })
      );
  }

  register(input: RegisterInput): Observable<RegisterMutation['register']> {
    return this.apollo
      .mutate<RegisterMutation>({
        mutation: REGISTER,
        variables: { input },
      })
      .pipe(
        map((result) => result.data?.register),
        filter(
          (response): response is NonNullable<typeof response> => !!response
        ), // Excluir undefined
        tap((response) => {
          localStorage.setItem(this.TOKEN_KEY, response.token);
          this.currentUserSubject.next(response.user);
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.currentUserSubject.next(null);
    this.apollo.client.resetStore();
  }

  getCurrentUser(): Observable<any> {
    return this.currentUserSubject.asObservable();
  }

  private loadUserFromToken(): void {
    this.apollo
      .query<MeQuery>({
        query: GET_ME,
      })
      .pipe(map((result) => result.data?.me))
      .subscribe({
        next: (user) => {
          if (user) {
            this.currentUserSubject.next(user);
          }
        },
        error: () => {
          this.logout();
        },
      });
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map, take, tap } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
import { LOGIN, REGISTER } from '../graphql/auth.graphql';
import { GET_ME } from '../graphql/users.graphql';
import {
  LoginMutation,
  RegisterMutation,
  MeQuery,
  LoginInput,
  RegisterInput,
  DisconnectGQL,
  MeGQL,
} from '../generated/graphql';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  private readonly TOKEN_KEY = 'auth_token';

  constructor(
    private router: Router,
    private apollo: Apollo,
    private disconnectGQL: DisconnectGQL,
    private currentUserGQL: MeGQL
  ) {
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

  async logout() {
    await this.disconnect();
    localStorage.removeItem(this.TOKEN_KEY);
    this.currentUserSubject.next(null);
    this.apollo.client.resetStore();
    this.router.navigate(['/login']);
  }

  getCurrentUser(): Observable<any> {
    return this.currentUserGQL.fetch().pipe(
      take(1),
      map((result) => result.data?.me),
      filter((me): me is NonNullable<typeof me> => !!me), // Filtra valores nulos/indefinidos
      tap((me) => {
        if (me) {
          return me;
        }
        return null;
      })
    );
  }

  loadUserFromToken(): any {
    this.apollo
      .query<MeQuery>({
        query: GET_ME,
      })
      .pipe(map((result) => result.data?.me))
      .subscribe({
        next: (user) => {
          if (user) {
            this.currentUserSubject.next(user);
            return true;
          }
          return false;
        },
        error: () => {
          this.logout();
          return false;
        },
      });
  }

  async disconnect() {
    this.disconnectGQL.mutate().subscribe({
      next: (response) => {
        if (response.data?.disconnect) {
        } else {
        }
      },
      error: (err) => {},
    });
  }
}

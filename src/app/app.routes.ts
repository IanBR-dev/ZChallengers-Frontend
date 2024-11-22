import { Routes } from '@angular/router';
import { AdminMatchListComponent } from './features/admin/admin-match-list.component';
import { LobbyComponent } from './features/lobby/lobby.component';
import { LoginComponent } from './features/auth/login/login.component';
import { AuthGuard } from './features/auth/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'lobby', component: LobbyComponent, canActivate: [AuthGuard] },
  {
    path: 'admin',
    component: AdminMatchListComponent,
    canActivate: [AuthGuard],
  },
  { path: '', redirectTo: '/lobby', pathMatch: 'full' },
  { path: '**', redirectTo: '/lobby' },
];

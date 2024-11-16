import { Routes } from '@angular/router';
import { LoginComponent } from './components/login.component';
import { LobbyComponent } from './components/lobby.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'lobby', component: LobbyComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/lobby', pathMatch: 'full' },
  { path: '**', redirectTo: '/lobby' },
];

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LobbyComponent } from './components/lobby.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LobbyComponent],
  template: `
    <app-lobby></app-lobby>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {}

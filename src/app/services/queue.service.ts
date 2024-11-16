import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Player, QueueMatch } from '../models/types';
import { GameService } from './game.service';

@Injectable({
  providedIn: 'root',
})
export class QueueService {
  private matchFoundSubject = new BehaviorSubject<QueueMatch | null>(null);
  private queueTimeoutId: any;

  constructor(private gameService: GameService) {}

  joinQueue() {
    // Simulate finding a match after random time (5-15 seconds)
    const timeout = Math.random() * 1000 + 2000;
    this.queueTimeoutId = setTimeout(() => {
      const match: QueueMatch = {
        player1: this.gameService.getCurrentPlayer(),
        player2: this.gameService.generateRandomPlayer(),
        timestamp: new Date(),
      };
      this.matchFoundSubject.next(match);
    }, timeout);
  }

  leaveQueue() {
    if (this.queueTimeoutId) {
      clearTimeout(this.queueTimeoutId);
    }
    this.matchFoundSubject.next(null);
  }

  getMatchFound(): Observable<QueueMatch | null> {
    return this.matchFoundSubject.asObservable();
  }

  acceptMatch(match: QueueMatch) {
    // Create team with matched players
    this.gameService.createTeam([match.player1, match.player2]);
    this.matchFoundSubject.next(null);
  }

  declineMatch() {
    this.matchFoundSubject.next(null);
  }
}

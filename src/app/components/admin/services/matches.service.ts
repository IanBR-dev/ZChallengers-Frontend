import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  map,
  tap,
  filter,
  merge,
  catchError,
  EMPTY,
} from 'rxjs';
import {
  GetAllMatchesGQL,
  GetAllMatchStatusGQL,
  GetAllMatchStatusSubscription,
  UpdateMatchGQL,
} from '../../../generated/graphql';
import { Match, Team } from '../../../models/types';

@Injectable({
  providedIn: 'root',
})
export class MatchesService {
  private matchesSubject = new BehaviorSubject<Match[]>([]);
  matches$ = this.matchesSubject.asObservable();

  constructor(
    private getAllMatchesGQL: GetAllMatchesGQL,
    private allMatchStatusGQL: GetAllMatchStatusGQL,
    private updateMatchGQL: UpdateMatchGQL
  ) {}

  initializeMatchesStream(): Observable<Match[]> {
    // Obtener lista inicial de matches
    const initialLoad$ = this.getAllMatchesGQL.fetch().pipe(
      map((result) => result.data?.getAllMatches || []), // Emite Match[]
      tap((matches) => {
        const processedMatches = this.processMatches(matches);
        this.matchesSubject.next(processedMatches); // Actualizar el estado inicial
      })
    );

    // Suscribirse a actualizaciones de matches
    const updates$ = this.allMatchStatusGQL.subscribe().pipe(
      map((result) => result.data?.getAllMatchStatus),
      filter((match): match is NonNullable<typeof match> => !!match), // Filtrar valores nulos
      map((match) => this.processMatch(match as unknown as Match)), // Procesar match
      tap((processedMatch) => {
        // Actualizar el estado acumulado
        const currentMatches = this.matchesSubject.value;
        const matchIndex = currentMatches.findIndex(
          (m) => m.id === processedMatch.id
        );

        let updatedMatches;
        if (matchIndex > -1) {
          // Actualizar el match existente
          updatedMatches = [
            ...currentMatches.slice(0, matchIndex),
            processedMatch,
            ...currentMatches.slice(matchIndex + 1),
          ];
        } else {
          // Agregar el nuevo match
          updatedMatches = [...currentMatches, processedMatch];
        }

        this.matchesSubject.next(updatedMatches); // Emitir el estado actualizado
      })
    );

    // Ejecutar ambos flujos iniciales y de actualización
    initialLoad$.subscribe();
    updates$.subscribe();

    // Retornar el estado acumulado como observable
    return this.matchesSubject.asObservable();
  }

  allMatchStatus(): Observable<
    GetAllMatchStatusSubscription['getAllMatchStatus']
  > {
    return this.allMatchStatusGQL.subscribe().pipe(
      map((result) => result.data?.getAllMatchStatus),
      filter(
        (matchStatus): matchStatus is NonNullable<typeof matchStatus> =>
          !!matchStatus
      ), // Filtra valores nulos/indefinidos
      tap((matchStatus) => {
        return matchStatus;
      })
    );
  }

  private processMatch(match: Match): Match {
    try {
      if (
        match.status === 'completed' &&
        match.team1Snapshot &&
        match.team2Snapshot
      ) {
        return {
          ...match,
          team1: this.convertSnapshotToTeam(match.team1Snapshot),
          team2: this.convertSnapshotToTeam(match.team2Snapshot),
        };
      }
      return match;
    } catch (error) {
      throw error;
    }
  }

  private convertSnapshotToTeam(snapshot: Team): Team {
    return {
      ...snapshot,
      status: 'completed',
      players: snapshot.players.map((p) => ({
        ...p,
        rank: 'Unknown', // O un valor por defecto apropiado
      })),
    };
  }

  private processMatches(matches: any[]): Match[] {
    return matches.map((match) => this.processMatch(match));
  }

  updateMatch(input: { matchId: string; winnerId: string }): Observable<Match> {
    return this.updateMatchGQL.mutate({ input }).pipe(
      map((response) => response.data?.updateMatch),
      filter((match): match is NonNullable<typeof match> => !!match),
      map((match) => this.processMatch(match as Match))
    );
  }

  getMatchesByStatus(status: string): Observable<Match[]> {
    return this.matches$.pipe(
      map((matches) => matches.filter((match) => match.status === status))
    );
  }

  getMatchById(id: string): Observable<Match | undefined> {
    return this.matches$.pipe(
      map((matches) => matches.find((match) => match.id === id))
    );
  }
}

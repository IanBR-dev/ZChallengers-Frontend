import { NgModule } from '@angular/core';
import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { ApolloClientOptions, InMemoryCache, split } from '@apollo/client/core';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';
import { HttpLink } from 'apollo-angular/http';
import { setContext } from '@apollo/client/link/context';

export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {
  // WebSocket Link para suscripciones
  const wsLink = new GraphQLWsLink(
    createClient({
      url: 'ws://localhost:3000/graphql',
      connectionParams: () => ({
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
      }),
    })
  );

  // HttpLink para consultas y mutaciones
  const http = httpLink.create({
    uri: 'http://localhost:3000/graphql',
  });

  // setContext para agregar el token dinámicamente a cada solicitud HTTP
  const authLink = setContext((operation, context) => {
    const token = localStorage.getItem('auth_token');
    return {
      headers: {
        ...context['headers'],
        Authorization: token ? `Bearer ${token}` : '',
      },
    };
  });

  // Dividir entre WebSocket y HTTP según el tipo de operación
  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink,
    authLink.concat(http) // Usa el authLink para agregar el token antes de httpLink
  );

  return {
    link: splitLink,
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'network-only',
        errorPolicy: 'ignore',
      },
      query: {
        fetchPolicy: 'network-only',
        errorPolicy: 'all',
      },
    },
  };
}

@NgModule({
  exports: [ApolloModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}

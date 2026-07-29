---
title: Apollo Server and Client
aliases: [Apollo GraphQL, Apollo Server, Apollo Client React]
tags: [GraphQL, API, WebDevelopment, Apollo]
domain: Web Development
difficulty: Intermediate
created: 2026-07-29
related: [GraphQL_Resolvers, GraphQL_Queries_and_Mutations, GraphQL_Advanced]
status: complete
---

# Apollo Server and Client

> [!abstract] TL;DR
> Apollo Server is the most widely used Node.js GraphQL server — it wraps your schema and resolvers and handles HTTP, subscriptions, plugins, and context. Apollo Client is the React counterpart — it fetches, caches, and synchronizes GraphQL data with a normalized in-memory store, and exposes `useQuery`, `useMutation`, and `useSubscription` hooks.

## Apollo Server (Node.js)

### Minimal Setup

```typescript
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

const typeDefs = `#graphql
  type Book { title: String! author: String! }
  type Query { books: [Book!]! }
`;

const resolvers = {
  Query: {
    books: () => [
      { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' },
    ],
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

const { url } = await startStandaloneServer(server, { listen: { port: 4000 } });
console.log(`Server ready at ${url}`);
```

### Express Integration with `expressMiddleware`

Use `expressMiddleware` when you need to mount GraphQL alongside existing REST routes, apply middleware (CORS, body parser), or run in a serverless function:

```typescript
import express from 'express';
import cors from 'cors';
import { json } from 'body-parser';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';

const app = express();
const server = new ApolloServer({ typeDefs, resolvers });
await server.start();

app.use(
  '/graphql',
  cors<cors.CorsRequest>(),
  json(),
  expressMiddleware(server, {
    context: async ({ req }) => buildContext(req),
  }),
);

app.listen(4000);
```

### Context Function for Auth Injection

The context factory runs once per request. Inject auth, database clients, and DataLoader instances here:

```typescript
expressMiddleware(server, {
  context: async ({ req }) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    let currentUser = null;
    if (token) {
      try { currentUser = await verifyToken(token); }
      catch { /* invalid token — no user */ }
    }
    return {
      currentUser,
      db,
      loaders: createLoaders(db),
    };
  },
});
```

### Plugins

Apollo Server's plugin system lets you hook into the request lifecycle for logging, error formatting, metrics, and more:

```typescript
import { ApolloServerPlugin } from '@apollo/server';

const loggingPlugin: ApolloServerPlugin = {
  async requestDidStart(requestContext) {
    console.log('Request started:', requestContext.request.operationName);
    return {
      async didEncounterErrors({ errors }) {
        errors.forEach(e => console.error('GraphQL error:', e.message));
      },
      async willSendResponse({ response }) {
        console.log('Response sent');
      },
    };
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [loggingPlugin],
  formatError: (formattedError, error) => {
    // Strip internal details from production errors
    if (formattedError.extensions?.code === 'INTERNAL_SERVER_ERROR') {
      return { message: 'Internal server error' };
    }
    return formattedError;
  },
});
```

Built-in plugin: `ApolloServerPluginLandingPageLocalDefault` enables Apollo Sandbox in development.

### Schema Mocking for Frontend Development

Before resolvers are built, mock the schema so the frontend can develop against real types:

```typescript
import { addMocksToSchema } from '@graphql-tools/mock';
import { makeExecutableSchema } from '@graphql-tools/schema';

const schema = makeExecutableSchema({ typeDefs });
const mockedSchema = addMocksToSchema({
  schema,
  mocks: {
    String: () => 'Lorem ipsum',
    Date: () => new Date().toISOString(),
    User: () => ({ id: () => '1', name: () => 'Mock User' }),
  },
});

const server = new ApolloServer({ schema: mockedSchema });
```

## Apollo Client (React)

### Installation and Setup

```bash
npm install @apollo/client graphql
```

```tsx
// main.tsx
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://api.example.com/graphql',
  cache: new InMemoryCache(),
  headers: { Authorization: `Bearer ${getAuthToken()}` },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
```

### `useQuery`

```tsx
import { useQuery, gql } from '@apollo/client';

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
    }
  }
`;

function UserList() {
  const { loading, error, data, refetch } = useQuery(GET_USERS, {
    fetchPolicy: 'cache-and-network',
    pollInterval: 30_000,  // refetch every 30 seconds
  });

  if (loading) return <Spinner />;
  if (error) return <Error message={error.message} />;

  return (
    <ul>
      {data.users.map(u => <li key={u.id}>{u.name}</li>)}
      <button onClick={() => refetch()}>Refresh</button>
    </ul>
  );
}
```

### `useMutation`

```tsx
import { useMutation, gql } from '@apollo/client';

const CREATE_USER = gql`
  mutation CreateUser($name: String!, $email: String!) {
    createUser(name: $name, email: $email) {
      id
      name
      email
    }
  }
`;

function CreateUserForm() {
  const [createUser, { loading, error }] = useMutation(CREATE_USER, {
    // Update the cache after mutation — no refetch needed
    update(cache, { data: { createUser } }) {
      cache.modify({
        fields: {
          users(existing = []) {
            const ref = cache.writeFragment({
              data: createUser,
              fragment: gql`fragment NewUser on User { id name email }`,
            });
            return [...existing, ref];
          },
        },
      });
    },
  });

  return (
    <button onClick={() => createUser({
      variables: { name: 'Alice', email: 'alice@example.com' },
    })}>
      {loading ? 'Creating…' : 'Create User'}
    </button>
  );
}
```

### Optimistic UI

Show the result immediately before the server responds, then reconcile when the response arrives:

```tsx
const [likePost] = useMutation(LIKE_POST, {
  optimisticResponse: {
    likePost: {
      __typename: 'Post',
      id: postId,
      likes: currentLikes + 1,
    },
  },
});
```

If the mutation fails, Apollo automatically rolls back the optimistic write.

### `useSubscription`

```tsx
import { useSubscription, gql } from '@apollo/client';

const ON_MESSAGE_ADDED = gql`
  subscription OnMessageAdded($chatId: ID!) {
    messageAdded(chatId: $chatId) {
      id
      text
      author { name }
    }
  }
`;

function ChatRoom({ chatId }: { chatId: string }) {
  const { data } = useSubscription(ON_MESSAGE_ADDED, {
    variables: { chatId },
    onData: ({ client, data }) => {
      // Manually update the messages cache
    },
  });

  return <div>{data?.messageAdded.text}</div>;
}
```

Subscriptions require a WebSocket link in the Apollo Client setup:

```typescript
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { split, HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';

const httpLink = new HttpLink({ uri: 'https://api.example.com/graphql' });
const wsLink = new GraphQLWsLink(createClient({ url: 'wss://api.example.com/graphql' }));

const splitLink = split(
  ({ query }) => {
    const def = getMainDefinition(query);
    return def.kind === 'OperationDefinition' && def.operation === 'subscription';
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({ link: splitLink, cache: new InMemoryCache() });
```

### Cache: `InMemoryCache`

Apollo Client normalizes the cache by `__typename + id`. Every object with an `id` (or configured key field) is stored once and referenced by pointer.

```typescript
// Read a query from the cache (synchronous)
const data = client.readQuery({ query: GET_USERS });

// Write a query into the cache
client.writeQuery({
  query: GET_USERS,
  data: { users: [...] },
});

// Modify cache fields directly
client.cache.modify({
  id: cache.identify(user),  // "User:1"
  fields: {
    name: () => 'New Name',
  },
});

// Evict and garbage-collect
cache.evict({ id: 'User:1' });
cache.gc();
```

### Fetch Policies

| Policy | Description |
|--------|-------------|
| `cache-first` (default) | Return cache if present; else network. |
| `network-only` | Always go to network; write result to cache. |
| `cache-and-network` | Return cache immediately; also fetch from network and update. |
| `no-cache` | Always network; do not write to cache. |
| `cache-only` | Return cache only; throw if not in cache. |

### `@client` — Local State

```graphql
# Declare client-side field in schema (or use local-only field)
query GetSidebar {
  sidebarOpen @client   # resolved locally, never sent to server
  user { id name }
}
```

```typescript
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        sidebarOpen: {
          read() { return localStorage.getItem('sidebarOpen') === 'true'; },
        },
      },
    },
  },
});
```

## Apollo Sandbox

Apollo Sandbox (`https://studio.apollographql.com/sandbox`) is a browser-based IDE that connects to any GraphQL server via introspection. Features:

- Schema documentation browser.
- Query autocompletion.
- Operation history.
- Schema change detection (diff vs previous version).
- Team sharing and collaboration.

Enabled in development by default when using `ApolloServer` with `NODE_ENV !== 'production'`.

## Common Pitfalls

- **Forgetting `__typename` in `writeFragment`** — cache normalization breaks without it. Apollo Client adds it automatically in queries; add it manually in optimistic responses.
- **Re-creating the `ApolloClient` on every render** — define `client` outside the component tree (module-level or with `useMemo` at the root).
- **N+1 queries from Apollo Client** — use fragment co-location to batch data needs; avoid issuing separate queries in child components when a parent already fetches the same data.
- **Not evicting stale entries** — deleted objects remain in the cache until evicted. Call `cache.evict` after delete mutations.
- **Subscriptions without cleanup** — `useSubscription` auto-unsubscribes on unmount, but manual `client.subscribe` requires explicit cleanup.

## Review Questions

1. What is the role of the `context` function in `expressMiddleware`?
2. What is `InMemoryCache` normalization, and how does Apollo Client determine the cache key for an object?
3. What is optimistic UI, and what happens when the mutation fails?
4. What fetch policy would you use when you need fresh data immediately but also want to display cached data while loading?
5. Why must a WebSocket link be used for subscriptions alongside an HTTP link?
6. What does the `@client` directive indicate to Apollo Client?

#GraphQL #API

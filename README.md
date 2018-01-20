# json-to-graphql-query

This is a simple module that takes a JavaScript object and turns it into a
GraphQL query to be sent to a GraphQL server.

Mainly useful for applications that need to generate graphql queries dynamically.

## Installation

```
npm install json-to-graphql-query
```

## Features

 * Converts a JavaScript object to a GraphQL Query
 * Supports nested objects & arguments
 * Supports JSON input types for arguments (see arguments example below)

## Usage

**jsonToGraphQLQuery(** queryObject: object, options?: object **)**

Supported options:
 * **pretty**: boolean - Set to `true` to enable pretty-printed output

### Simple Query

```typescript
import { jsonToGraphQLQuery } from 'json-to-graphql-query';

const query = {
    query: {
        Posts: {
            id: true,
            title: true,
            post_date: true
        }
    }
};
const graphql_query = jsonToGraphQLQuery(query, { pretty: true });
```

Resulting `graphql_query`

```graphql
query {
    Posts {
        id
        title
        post_date
    }
}
```

### Query with arguments

```typescript
import { jsonToGraphQLQuery } from 'json-to-graphql-query';

const query = {
    query: {
        Posts: {
            __args: {
                where: { id: 2 }
                orderBy: 'post_date'
            },
            id: true,
            title: true,
            post_date: true
        }
    }
};
const graphql_query = jsonToGraphQLQuery(query, { pretty: true });
```

Resulting `graphql_query`

```graphql
query {
    Posts (where: {id: 2}, orderBy: "post_date") {
        id
        title
        post_date
    }
}
```

### Query with nested objects

```typescript
import { jsonToGraphQLQuery } from 'json-to-graphql-query';

const query = {
    query: {
        Posts: {
            id: true,
            title: true,
            comments: {
                id: true,
                comment: true,
                user: true
            }
        }
    }
};
const graphql_query = jsonToGraphQLQuery(query, { pretty: true });
```

Resulting `graphql_query`

```graphql
query {
    Posts {
        id
        title
        comments {
            id
            comment
            user
        }
    }
}
```

## TO-DO List

 * Fragments
 * Probably some other things!...

Pull requests welcome!

## License

MIT
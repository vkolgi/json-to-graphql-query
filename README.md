# json-to-graphql-query

This is a simple module that takes a JavaScript object and turns it into a
GraphQL query to be sent to a GraphQL server.

Mainly useful for applications that need to generate graphql queries dynamically.

## Installation

```
npm install json-to-graphql-query
```

## Features

 * Converts a JavaScript object to a GraphQL Query string
 * Full support for nested query nodes and arguments
 * Support for aliases via `__alias`
 * Support for input arguments via `__args`
 * Support for Enum values via `EnumType`

See usage examples below :)

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
import { jsonToGraphQLQuery, EnumType } from 'json-to-graphql-query';

const query = {
    query: {
        Posts: {
            __args: {
                where: { id: 2 }
                orderBy: 'post_date',
                status: new EnumType('PUBLISHED')
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
    Posts (where: {id: 2}, orderBy: "post_date", status: PUBLISHED) {
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

### Query with disabled fields

```typescript
import { jsonToGraphQLQuery } from 'json-to-graphql-query';

const query = {
    query: {
        Posts: {
            id: true,
            title: false,
            comments: {
                id: true,
                comment: false,
                user: true
            }
        },
        User: false
    }
};
const graphql_query = jsonToGraphQLQuery(query, { pretty: true });
```

Resulting `graphql_query`

```graphql
query {
    Posts {
        id
        comments {
            id
            user
        }
    }
}
```

### Using aliases

```typescript
import { jsonToGraphQLQuery } from 'json-to-graphql-query';

const query = {
    query: {
        Posts: {
            __alias: 'allPosts',
            id: true,
            comments: {
                id: true,
                comment: true
            }
        }
    }
};
const graphql_query = jsonToGraphQLQuery(query, { pretty: true });
```

Resulting `graphql_query`

```graphql
query {
    allPosts: Posts {
        id
        comments {
            id
            comment
        }
    }
}
```

## TO-DO List

 * Support Named Queries / Mutations
 * Probably some other things!...

Pull requests welcome!

## License

MIT

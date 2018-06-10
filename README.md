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
 * Full support for nested query / mutation nodes and arguments
 * Support for input arguments via [`__args`](#query-with-arguments)
 * Support for query aliases via [`__alias`](#using-aliases)
 * Support for Enum values via [`EnumType`](#query-with-enum-values)
 * Support for variables via [`__variables`](#query-with-variables)

## Recent Changes

See the [CHANGELOG](CHANGELOG.md)

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

### Query with Enum Values 

```typescript
import { jsonToGraphQLQuery, EnumType } from 'json-to-graphql-query';

const query = {
    query: {
        Posts: {
            __args: {
                orderBy: 'post_date',
                status: new EnumType('PUBLISHED')
            },
            title: true,
            body: true
        }
    }
};
const graphql_query = jsonToGraphQLQuery(query, { pretty: true });
```

Resulting `graphql_query`

```graphql
query {
    Posts (orderBy: "post_date", status: PUBLISHED) {
        title
        body
    }
}
```

### Query with variables 

```typescript
import { jsonToGraphQLQuery, VariableType } from 'json-to-graphql-query';

const query = {
    query: {
        __variables: {
            variable1: 'String!',
            variableWithDefault: 'String = "default_value"'
        },
        Posts: {
            __args: {
                arg1: 20,
                arg2: new VariableType('variable1')
            },
            id: true,
            title: true
        }
    }
};
const graphql_query = jsonToGraphQLQuery(query, { pretty: true });
```

Resulting `graphql_query`

```graphql
query ($variable1: String!, $variableWithDefault: String = "default_value") {
    Posts (arg1: 20, arg2: $variable1) {
        id
        title
    }
}
```

## TO-DO List

 * Support Named Queries / Mutations
 * Probably some other things!...

Pull requests welcome!

## License

MIT

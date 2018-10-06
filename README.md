# json-to-graphql-query

This is a simple module that takes a JavaScript object and turns it into a
GraphQL query to be sent to a GraphQL server.

Mainly useful for applications that need to generate graphql queries dynamically.

## Installation

```
npm install json-to-graphql-query
```

## Usage

```ts
const query = jsonToGraphQLQuery(queryObject: object, options?: object);
```

Supported Options:
 * `pretty` - boolean - optional - set to `true` to enable pretty-printed output
 * `ignoreFields` - string[] - optional - you can pass an array of object key names that you want removed from the query
 * `includeFalsyKeys` - boolean - optional - disable the default behaviour if excluding keys with a falsy value

## Features

 * Converts a JavaScript object to a GraphQL Query string
 * Full support for nested query / mutation nodes and arguments
 * Optionally strip specific object keys using the `ignoreFields` option
 * Support for input arguments via [`__args`](#query-with-arguments)
 * Support for query aliases via [`__aliasFor`](#using-aliases)
 * Support for Enum values via [`EnumType`](#query-with-enum-values)
 * Support for variables via [`__variables`](#query-with-variables)
 * Support for simple directives (such as `@client`) via [`__directives`](#query-with-directives)
 * Support for one or more inline fragments via [`__on.__typeName`](#query-with-inline-fragments)

## Recent Changes

See the [CHANGELOG](CHANGELOG.md)

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
NOTE: You can tell jsonToGraphQLQuery() not to exclude keys with a falsy value
by setting the `includeFalsyKeys` option.

### Using aliases

```typescript
import { jsonToGraphQLQuery } from 'json-to-graphql-query';

const query = {
    query: {
        allPosts: {
            __aliasFor: 'Posts',
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

### Query with Directives

```typescript
import { jsonToGraphQLQuery } from 'json-to-graphql-query';

const query = {
    query: {
        __directives: {
            client: true
        }
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
    Posts @client {
        id
        title
        post_date
    }
}
```

### Ignoring fields in the query object

We sometimes want to ignore specific fields in the initial object, for instance __typename in Apollo queries.
You can specify these fields using the `ignoreFields` option:

```typescript
import { jsonToGraphQLQuery, VariableType } from 'json-to-graphql-query';

const query = {
    query: {
        Posts: {
            shouldBeIgnored: {
                variable1: 'a value'
            },
            id: true,
            title: true,
            post_date: true
        }
    }
};
const graphql_query = jsonToGraphQLQuery(query, {
    pretty: true,
    ignoreFields: ['shouldBeIgnored']
});
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

### Query with Inline Fragments

```typescript
import { jsonToGraphQLQuery } from 'json-to-graphql-query';

const query = {
    query: {
        Posts: {
            title: true
            __on: {
                __typeName: "ConfigurablePost",
                id: true
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
        title
        ... on ConfigurablePost {
            id
        }
    }
}
```

### Query with multiple Inline Fragments
```typescript
import { jsonToGraphQLQuery } from 'json-to-graphql-query';

const query = {
            query: {
                Posts: {
                    __on: [
                    {
                        __typeName: "ConfigurablePost",
                        id: true
                    },
                    {
                        __typeName: "UnconfigurablePost",
                        name: true
                    }]
                }
            }
        };
const graphql_query = jsonToGraphQLQuery(query, { pretty: true });
```
Resulting `graphql_query`

```graphql
query {
    Posts {
        title
        ... on ConfigurablePost {
            id
        }
        ... on UnconfigurablePost {
            name
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

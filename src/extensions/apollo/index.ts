import { jsonToGraphQLQuery } from '../../index';

export function addApolloTargetToGqlQueryString(query: string, target: string): string {
    for (let i = query.length; i--; i === 0) {
        const thisChar = query[i];
        if ((thisChar !== ' ') && (thisChar !== '}')) {
            return query.slice(0, i + 1) + ' @' + target + query.slice(i + 1 , query.length);
        }
    }
}

export function objToApolloQuery(object: object, target: string): string {
    const gqlQuery = jsonToGraphQLQuery(object);
    const querySansTypenames = gqlQuery.replace(/__typename /g, '');
    const queryWithTarget = addApolloTargetToGqlQueryString(querySansTypenames, target);
    return 'query { ' + queryWithTarget + ' }';
}

// TODO: Add functionality to automatically generate mutations.

// TODO: Add functionality to automatically generate resolvers.

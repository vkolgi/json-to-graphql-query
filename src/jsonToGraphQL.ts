
export function jsonToGraphQL(query: any) {
    if (!query || typeof query != 'object') {
        throw new Error('query object not specified');
    }
}
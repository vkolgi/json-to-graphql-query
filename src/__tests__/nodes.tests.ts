
import { expect } from 'chai';
import { jsonToGraphQLQuery } from '../';

describe('jsonToGraphQL() - node conversion', () => {

    it('throws if no query object is specified', () => {
        expect(() => {
            (jsonToGraphQLQuery as any)();
        }).to.throw('query object not specified');
    });

    it('throws if query is not an object', () => {
        expect(() => {
            jsonToGraphQLQuery('not a query object');
        }).to.throw('query object not specified');
    });

    it('throws if object has no keys', () => {
        expect(() => {
            jsonToGraphQLQuery({});
        }).to.throw('query object has no data');
    });

    it('converts a simple query', () => {
        const query = {
            query: {
                Posts: {
                    id: true,
                    title: true,
                    post_date: true
                }
            }
        };
        expect(jsonToGraphQLQuery(query, { pretty: true })).to.equal(
            `query {
    Posts {
        id
        title
        post_date
    }
}`);
    });

    it('converts a query with nested objects', () => {
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
        expect(jsonToGraphQLQuery(query, { pretty: true })).to.equal(
            `query {
    Posts {
        id
        title
        comments {
            id
            comment
            user
        }
    }
}`);
    });

    it('gets keys from an array instead of adding the index as a key', () => {
        const query = {
            query: {
                Posts: [{
                    id: true,
                    name: true,
                }],
                Lorem: {
                    id: true
                },
                Ipsum: false,
            }
        };
        expect(jsonToGraphQLQuery(query)).to.equal(
            'query { Posts { id name } Lorem { id } }'
        );
    });

    it('gets keys from an array instead of adding the index as a key and print pretty', () => {
        const query = {
            query: {
                Posts: [{
                    id: true,
                    name: true,
                }],
                Lorem: {
                    id: true
                },
                Ipsum: false,
            }
        };
        expect(jsonToGraphQLQuery(query, { pretty: true })).to.equal(
            `query {
    Posts {
        id
        name
    }
    Lorem {
        id
    }
}`);
    });

    it('handles empty arrays by adding the key but no values to the query', () => {
        const Posts: any[] = [];
        const query = {
            query: {
                Posts,
                Lorem: {
                    id: true
                },
                Ipsum: false,
            }
        };
        expect(jsonToGraphQLQuery(query)).to.equal(
            'query { Posts Lorem { id } }'
        );
    });

    it('handles arrays of numbers by adding the key but no values to the query', () => {
        const query = {
            query: {
                Posts: [1, 2, 3],
                Lorem: {
                    id: true
                },
                Ipsum: false,
            }
        };
        expect(jsonToGraphQLQuery(query)).to.equal(
            'query { Posts Lorem { id } }'
        );
    });

    it('handles arrays of strings by adding the key but no values to the query', () => {
        const query = {
            query: {
                Posts: ['test 1', 'test 2', 'test 3'],
                Lorem: {
                    id: true
                },
                Ipsum: false,
            }
        };
        expect(jsonToGraphQLQuery(query)).to.equal(
            'query { Posts Lorem { id } }'
        );
    });

    it('handles arrays of mixed types by taking the first object of the array', () => {
        const query = {
            query: {
                Posts: [1, null, { id: true, name: true }],
                Lorem: {
                    id: true
                },
                Ipsum: false,
            }
        };
        expect(jsonToGraphQLQuery(query)).to.equal(
            'query { Posts { id name } Lorem { id } }'
        );
    });

    it('handles arrays of string by adding the key but no values to the query', () => {
        const Posts: any[] = [null];
        const query = {
            query: {
                Posts,
                Lorem: {
                    id: true
                },
                Ipsum: false,
            }
        };
        expect(jsonToGraphQLQuery(query)).to.equal(
            'query { Posts Lorem { id } }'
        );
    });

    it('handles arrays of string by adding the key but no values to the query and print pretty', () => {
        const Posts: any[] = [];
        const query = {
            query: {
                Posts,
                Lorem: {
                    id: true
                },
                Ipsum: false,
            }
        };
        expect(jsonToGraphQLQuery(query, { pretty: true })).to.equal(
            `query {
    Posts
    Lorem {
        id
    }
}`);
    });

});

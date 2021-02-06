
import { expect } from 'chai';
import { jsonToGraphQLQuery } from '../';

describe('jsonToGraphQLQuery() - arguments', () => {

    it('converts a query with simple arguments', () => {
        const query = {
            query: {
                Posts: {
                    __args: {
                        orderBy: 'post_date',
                        userId: 12
                    },
                    id: true,
                    title: true,
                    post_date: true
                }
            }
        };
        expect(jsonToGraphQLQuery(query, { pretty: true })).to.equal(
            `query {
    Posts (orderBy: "post_date", userId: 12) {
        id
        title
        post_date
    }
}`);
    });

    it('converts a query with JSON arguments', () => {
        const query = {
            query: {
                Posts: {
                    __args: {
                        where: {
                            published: true,
                            rating: { _gt: 3 }
                        },
                        orderBy: 'post_date'
                    },
                    id: true,
                    title: true,
                    post_date: true
                }
            }
        };
        expect(jsonToGraphQLQuery(query, { pretty: true })).to.equal(
            `query {
    Posts (where: {published: true, rating: {_gt: 3}}, orderBy: "post_date") {
        id
        title
        post_date
    }
}`);
    });

    it('converts a query with JSON arguments containing arrays of objects', () => {
        const query = {
            query: {
                Posts: {
                    __args: {
                        or: [
                            { published: true },
                            { rating: [{ _gt: 3 }] }
                        ],
                        orderBy: 'post_date'
                    },
                    id: true,
                    title: true,
                    post_date: true
                }
            }
        };
        expect(jsonToGraphQLQuery(query, { pretty: true })).to.equal(
            `query {
    Posts (or: [{published: true}, {rating: [{_gt: 3}]}], orderBy: "post_date") {
        id
        title
        post_date
    }
}`);
    });

    it('converts a query with null arguments and nested nulls', () => {
        const query = {
            query: {
                Posts: {
                    __args: {
                        where: {
                            id: null,
                        },
                        orderBy: null
                    },
                    id: true,
                    title: true,
                    post_date: true
                }
            }
        } as any;
        expect(jsonToGraphQLQuery(query, { pretty: true })).to.equal(
            `query {
    Posts (where: {id: null}, orderBy: null) {
        id
        title
        post_date
    }
}`);
    });

    it('converts a query with nested objects and arguments', () => {
        const query = {
            query: {
                Posts: {
                    __args: {
                        arg1: 20,
                        arg2: 'flibble'
                    },
                    id: true,
                    title: true,
                    comments: {
                        __args: {
                            offensiveOnly: true
                        },
                        id: true,
                        comment: true,
                        user: true
                    }
                }
            }
        };
        expect(jsonToGraphQLQuery(query, { pretty: true })).to.equal(
            `query {
    Posts (arg1: 20, arg2: "flibble") {
        id
        title
        comments (offensiveOnly: true) {
            id
            comment
            user
        }
    }
}`);
    });

    it('works with pretty mode turned off', () => {
        const query = {
            query: {
                Posts: {
                    __args: {
                        arg1: 20,
                        arg2: 'flibble'
                    },
                    id: true,
                    title: true
                }
            }
        };
        expect(jsonToGraphQLQuery(query)).to.equal(
            'query { Posts (arg1: 20, arg2: "flibble") { id title } }'
        );
    });

    it('Empty args object should not generate parentheses', () => {
        const query = {
            query: {
                Posts: {
                    __args: {},
                    id: true,
                    title: true
                }
            }
        };
        expect(jsonToGraphQLQuery(query)).to.equal(
            'query { Posts { id title } }'
        );
    });

});

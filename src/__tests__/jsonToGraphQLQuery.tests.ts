
import { expect } from 'chai';
import { jsonToGraphQLQuery, EnumType } from '../';

describe('jsonToGraphQL()', () => {

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

    it('converts a query with enum arguments', () => {
      const query = {
          query: {
              Posts: {
                  __args: {
                      status: new EnumType('PUBLISHED')
                  },
                  id: true,
                  title: true,
                  post_date: true
              }
          }
      };
      expect(jsonToGraphQLQuery(query, { pretty: true })).to.equal(
`query {
    Posts (status: PUBLISHED) {
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

    it('correctly converts mutations with no specified return fields', () => {
        const query = {
            mutation: {
                create_post: {
                    __args: {
                        title: 'My Awesome Post',
                        body: 'This post is awesome!'
                    }
                }
            }
        };
        expect(jsonToGraphQLQuery(query, { pretty: true })).to.equal(
`mutation {
    create_post (title: "My Awesome Post", body: "This post is awesome!")
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

    it('uses aliases for fields', () => {
      const query = {
        query: {
            Posts: {
                __alias: 'lorem',
                __args: {
                    arg1: 20,
                },
                id: true
            }
        }
      };
      expect(jsonToGraphQLQuery(query)).to.equal(
        'query { lorem: Posts (arg1: 20) { id } }'
      );
    });

    it('does not include fields which value is false', () => {
      const query = {
        query: {
            Posts: {
                __args: {
                  a: false
                },
                id: true,
                name: false
            },
            Lorem: {
              id: true
            },
            Ipsum: false
        }
      };
      expect(jsonToGraphQLQuery(query)).to.equal(
        'query { Posts (a: false) { id } Lorem { id } }'
      );
    });
});


import { expect } from 'chai';
import { jsonToGraphQLQuery } from '../';

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

    it('converts a simple query with args and directives with no arguments', () => {
        const query = {
            query: {
                Posts: {
                    __args: {
                        where: {
                            id: 10,
                        },
                        orderBy: 'flibble'
                    },
                    __directives: {
                        client: true
                    },
                    id: true,
                    title: true,
                    post_date: true
                }
            }
        } as any;
        expect(jsonToGraphQLQuery(query, { pretty: true })).to.equal(
`query {
    Posts @client (where: {id: 10}, orderBy: "flibble") {
        id
        title
        post_date
    }
}`);
    });

    it('converts a complex query with directives with no arguments', () => {
        const query = {
            query: {
                diet: {
                    __directives: {
                        client: true
                    },
                    id: 'diet',
                    options: {
                        mood: {
                            category: 'Diet',
                            id: 'mood',
                            selected: true,
                        },
                        weight: {
                            category: 'Diet',
                            icon: 'fa fa-question-circle',
                            id: 'weight',
                            selected: false,
                            text: 'Weight'
                        },
                    },
                    title: 'Diet'
                },
                someOtherAbritraryKey: {
                    __directives: {
                        client: true
                    },
                    arb1: 'arbitrary value',
                    arb2: 'some other arbitrary value'
                }
            }
        };
        const expected = 'query { diet @client { id options { ' +
        'mood { category id selected } weight { category icon id text } } ' +
        'title } someOtherAbritraryKey @client { arb1 arb2 } }';
        expect(jsonToGraphQLQuery(query)).to.equal(expected);
    });

    // TODO: Need this test still? How to handle variables unless $ declared explicitly?
    // it('converts a JavaScript object into a valid query, including single directives ' +
    // 'with args, so long as any variables used are enclosed in a string with "$" included', () => {
    //     interface ILooseObject { [key: string]: any; }
    //     let input: ILooseObject = {
    //         someOtherAbritraryKey: {
    //             __typename: 'someArbitraryObjType',
    //             arb1: 'arbitrary value',
    //             arb2: 'some other arbitrary value'
    //         }
    //     };
    //     Object.keys(input)
    //     .filter(filterNonConfigFields)
    //     .forEach((key) => {
    //         input[key]['__directives'] = { include: {if: '$isAwesome'}, };
    //     });
    //     input = {query: input};
    //     const expected = 'query { someOtherAbritraryKey @include(if: $isAwesome) { arb1 arb2 } }';
    //     expect(jsonToGraphQLQuery(input)).to.equal(expected);
    // });

    // TODO
    // it('converts a JavaScript object into a valid query, including *multiple* directives ' +
    // 'with args, so long as any variables used are enclosed in a string with "$" included', () => {
    // });

    // TODO
    // it('creates a query, stripping/ignoring certain, specified keys', () => {
    // // Example usage: jsonToGraphqlQuery(preInput, { keysToStrip: ['__typename'] });
    // });

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

    it('ignores a field that exists in the initial object', () => {
        const query = {
            query: {
                Posts: {
                    thisShouldBeIgnored: {
                        test: 'a value'
                    },
                    id: true,
                    title: true,
                    post_date: true
                }
            }
        };
        expect(jsonToGraphQLQuery(query, {
            pretty: true,
            ignoreFields: ['thisShouldBeIgnored']
        })).to.equal(
            `query {
    Posts {
        id
        title
        post_date
    }
}`);
    });

    it('we can ignore apollo __typename keys', () => {
        const query = {
            query: {
                Posts: {
                    __typename: 'Posts',
                    id: true,
                    title: true,
                    post_date: true,
                    subObject: {
                        __typename: 'subObject',
                        test: 'a value'
                    },
                }
            }
        };
        expect(jsonToGraphQLQuery(query, {
            pretty: true,
            ignoreFields: ['__typename']
        })).to.equal(
            `query {
    Posts {
        id
        title
        post_date
        subObject {
            test
        }
    }
}`);
    });

});

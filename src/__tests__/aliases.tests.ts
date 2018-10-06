
import { expect } from 'chai';
import { jsonToGraphQLQuery } from '../';

describe('jsonToGraphQL() - aliases', () => {

    it('uses aliases for fields', () => {
        // Deprecated...
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

    it('supports multiple aliases for one type', () => {
        const query = {
            query: {
                lorem: {
                    __aliasFor: 'Posts',
                    __args: {
                        arg1: 20,
                    },
                    id: true
                },
                larem: {
                    __aliasFor: 'Posts',
                    __args: {
                        arg2: 10,
                    },
                    id: true
                }
            }
        };
        expect(jsonToGraphQLQuery(query)).to.equal(
            'query { lorem: Posts (arg1: 20) { id } larem: Posts (arg2: 10) { id } }'
        );
    });

});

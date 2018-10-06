
import { expect } from 'chai';
import { jsonToGraphQLQuery } from '../';

describe('jsonToGraphQL() - fragments', () => {

    it('supports inline fragments', () => {
        const query = {
            query: {
                Posts: {
                    __on: {
                        __typeName: 'ConfigurablePost',
                        id: true
                    }
                }
            }
        };
        expect(jsonToGraphQLQuery(query)).to.equal(
            'query { Posts { ... on ConfigurablePost { id } } }'
        );
    });

    it('supports inline fragments with subfields on same level', () => {
        const query = {
            query: {
                Posts: {
                    title: true,
                    __on: {
                        __typeName: 'ConfigurablePost',
                        id: true
                    }
                }
            }
        };
        expect(jsonToGraphQLQuery(query)).to.equal(
            'query { Posts { title ... on ConfigurablePost { id } } }'
        );
    });

    it('supports multiple inline fragments', () => {
        const query = {
            query: {
                Posts: {
                    __on: [
                        {
                            __typeName: 'ConfigurablePost',
                            id: true
                        },
                        {
                            __typeName: 'UnconfigurablePost',
                            name: true
                        }]
                }
            }
        };
        expect(jsonToGraphQLQuery(query)).to.equal(
            'query { Posts { ... on ConfigurablePost { id } ... on UnconfigurablePost { name } } }'
        );
    });

});

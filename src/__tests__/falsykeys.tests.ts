
import { expect } from 'chai';
import { jsonToGraphQLQuery } from '../';

describe('jsonToGraphQL() - falsy keys', () => {

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

    it('includes fields with falsy values if includeFalsyKeys is true', () => {
        const query = {
            query: {
                Posts: {
                    __args: {
                        a: false
                    },
                    id: '',
                    name: ''
                },
                Lorem: {
                    id: ''
                },
                Ipsum: false
            }
        };
        expect(jsonToGraphQLQuery(query, { includeFalsyKeys: true })).to.equal(
            'query { Posts (a: false) { id name } Lorem { id } Ipsum }'
        );
    });

});

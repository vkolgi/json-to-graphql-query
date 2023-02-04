
import { expect } from 'chai';
import { jsonToGraphQLQuery } from '../';

describe('jsonToGraphQLQuery() - falsy keys', () => {

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

    it('does not include object with only false keys', () => {
        const query = {
            query: {
                Posts: {
                    id: true,
                    name: false
                },
                Lorem: {
                    id: false
                },
                Ipsum: true
            }
        };
        expect(jsonToGraphQLQuery(query)).to.equal(
            'query { Posts { id } Ipsum }'
        );
    });

    it('does include object with only false keys if includeFalsyKeys is true', () => {
        const query = {
            query: {
                Posts: {
                    id: true,
                    name: false
                },
                Lorem: {
                    id: false
                },
                Ipsum: true
            }
        };
        expect(jsonToGraphQLQuery(query, { includeFalsyKeys: true })).to.equal(
            'query { Posts { id name } Lorem { id } Ipsum }'
        );
    });

});

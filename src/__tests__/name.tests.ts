import { expect } from 'chai';
import { jsonToGraphQLQuery } from '../';

describe('jsonToGraphQLQuery() - name', () => {

    it('supports Named Queries', () => {
        const query = {
            query: {
                __name: 'NewName',
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
        expect(jsonToGraphQLQuery(query)).to.equal('query NewName { lorem: Posts (arg1: 20) { id } larem: Posts (arg2: 10) { id } }');
    });

    it('supports Named Mutations', () => {
        const query = {
            mutation: {
                __name: 'NewName',
                one: {
                    __aliasFor: 'Posts',
                    __args: {
                        arg1: 20,
                    },
                    id: true
                },
                two: {
                    __aliasFor: 'Posts',
                    __args: {
                        arg2: 10,
                    },
                    id: true
                }
            }
        };
        expect(jsonToGraphQLQuery(query)).to.equal('mutation NewName { one: Posts (arg1: 20) { id } two: Posts (arg2: 10) { id } }');
    });
});

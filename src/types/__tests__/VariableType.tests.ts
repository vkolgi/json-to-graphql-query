
import { expect } from 'chai';
import { jsonToGraphQLQuery, VariableType } from '../../';

describe('VariableType()', () => {

    it('converts query variables', () => {
        const query = {
            query: {
                __variables: {
                    someString: 'String!',
                    varWithDefault: 'String = "default_value"'
                },
                Posts: {
                    __args: {
                        arg1: 20,
                        arg2: new VariableType('someString')
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
`query ($someString: String!, $varWithDefault: String = "default_value") {
    Posts (arg1: 20, arg2: $someString) {
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

});
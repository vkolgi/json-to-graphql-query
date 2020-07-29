
import { expect } from 'chai';
import { jsonToGraphQLQuery, EnumType, VariableType } from '../';

describe('jsonToGraphQLQuery() - example', () => {

    it('correctly converts query with name/variables', () => {
        const query = {
            query: {
                __name: 'NewName',
                __variables: {
                    variable1: 'String!',
                    variableWithDefault: 'String = "default_value"'
                },
                Posts: {
                    __args: {
                        arg1: 20,
                        arg2: new VariableType('variable1')
                    },
                    id: true,
                    title: true
                }
            }
        };
        expect(jsonToGraphQLQuery(query, { pretty: true })).to.equal(
`query NewName ($variable1: String!, $variableWithDefault: String = "default_value") {
    Posts (arg1: 20, arg2: $variable1) {
        id
        title
    }
}`)
    });

    it('correctly converts query with variables/name/alias/args/variable/fragments', () => {
        const query = {
            query: {
                __name: 'NewName',
                __variables: {
                    someString: 'String!',
                    varWithDefault: 'String = "default_value"',
                },
                one: {
                    __aliasFor: 'Posts',
                    __args: {
                        arg1: 20,
                        arg2: new VariableType('someString'),
                        status: new EnumType('PUBLISHED')
                    },
                    name: false,
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
                },
                Post: {
                    __args: {
                        arg1: 20,
                        arg2: new VariableType('someString')
                    },
                    __on: {
                        __typeName: 'ConfigurablePost',
                        id: true
                    },
                    name: false,
                    title: true,
                    comments: {
                        __args: {
                            offensiveOnly: true
                        },
                        id: true,
                        comment: true,
                        user: true
                    }
                },
                Posts: {
                    __args: {
                        arg1: 20,
                        arg2: new VariableType('someString')
                    },
                    name: false,
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
`query NewName ($someString: String!, $varWithDefault: String = "default_value") {
    one: Posts (arg1: 20, arg2: $someString, status: PUBLISHED) {
        id
        title
        comments (offensiveOnly: true) {
            id
            comment
            user
        }
    }
    Post (arg1: 20, arg2: $someString) {
        title
        comments (offensiveOnly: true) {
            id
            comment
            user
        }
        ... on ConfigurablePost {
            id
        }
    }
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

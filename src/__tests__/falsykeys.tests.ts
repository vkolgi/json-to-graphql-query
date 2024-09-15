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

    it('Includes the nested object if includeFalsyKeys is true', () => {
        const query = {
            query: {
                Posts: {
                    id: true,
                    name: false
                },
                Lorem: {
                    Ipsum: {
                        name: false
                    }
                }
            }
        };
        expect(jsonToGraphQLQuery(query, { includeFalsyKeys: true })).to.equal(
            'query { Posts { id name } Lorem { Ipsum { name } } }'
        );
    });

    it('does not include the object if nested object has falsy values', () => {
        const query = {
            query: {
                Posts: {
                    id: true,
                    name: false
                },
                Lorem: {
                    Ipsum: {
                        name: false
                    }
                }
            }
        };
        expect(jsonToGraphQLQuery(query)).to.equal('query { Posts { id } }');
    });

    it('skip objects when deeply nested keys contain falsy values', () => {
        const query = {
            query: {
                id: true,
                Posts: {
                    id: true,
                    name: false
                },
                Lorem: {
                    Ipsum: {
                        Dolor: {
                            Sit: {
                                amet: false
                            }
                        }
                    },
                    details: {
                        name: false,
                        address: true
                    }
                }
            }
        };
        expect(jsonToGraphQLQuery(query)).to.equal(
            'query { id Posts { id } Lorem { details { address } } }'
        );
    });

    it('Include values if nested object has falsy values and includeFalsyKeys is true', () => {
        const query = {
            query: {
                Posts: {
                    id: true,
                    name: false
                },
                Lorem: {
                    Ipsum: {
                        name: false
                    }
                }
            }
        };
        expect(jsonToGraphQLQuery(query, { includeFalsyKeys: true })).to.equal(
            'query { Posts { id name } Lorem { Ipsum { name } } }'
        );
    });
});

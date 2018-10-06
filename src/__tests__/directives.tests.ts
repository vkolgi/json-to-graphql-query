
import { expect } from 'chai';
import { jsonToGraphQLQuery } from '../';

describe('jsonToGraphQLQuery() - directives', () => {

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

});

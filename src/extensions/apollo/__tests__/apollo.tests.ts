import { expect } from 'chai';
import {objToApolloQuery, addApolloTargetToGqlQueryString} from '../';

describe('addApolloTarget()', () => {

    it('Converts a simple JavaScript object into a valid Apollo query', () => {
        const input = {
            appState2: {
                hello2: 'some arbitrary value',
                hello: 'arbitrary value'
            }
        };
        const apolloTarget = 'client';
        const expected = 'query { appState2 { hello2 hello @client } }';
        expect(objToApolloQuery(input, apolloTarget)).to.equal(expected);
    });

    it('Converts a somewhat complex JavaScript object into a valid Apollo query', () => {
        const input = {
            __typename: 'everyday-health-focuses',
            diet: {
                __typename: 'diet',
                title: 'Diet',
                id: 'diet',
                options: {
                    '__typename': 'diet-options',	// Why does my IDE tell me only this line needs quotation?
                    'calorie-count': {
                        __typename: 'calorie-count',
                        text: 'Calorie Count',
                        id: 'calorie-count',
                        icon: 'fa fa-question-circle',
                        category: 'Diet',
                        selected: false
                    },
                    'weight': {
                        __typename: 'weight',
                        text: 'Weight',
                        id: 'weight',
                        icon: 'fa fa-question-circle',
                        category: 'Diet',
                        selected: false
                    },
                    'mood': {
                        __typename: 'mood',
                        text: 'Mood',
                        id: 'mood',
                        icon: 'fa fa-question-circle',
                        category: 'Diet',
                        selected: false
                    },
                }
            },
        };
        const apolloTarget = 'client';
        // const expected = 'query { __typename diet { __typename title id options { __typename calorie-count ' +
        //     '{ __typename text id icon category } weight { __typename text id icon category } mood ' +
        //     '\{ __typename text id icon category @client } } } }';
        const expected = 'query { diet { title id options { calorie-count ' +
            '{ text id icon category } weight { text id icon category } mood ' +
            '\{ text id icon category @client } } } }';
        expect(objToApolloQuery(input, apolloTarget)).to.equal(expected);
    });

    it('Adds apollo target to appropriate location in a graphql query string.', () => {
        const input = 'query { appState2 { hello2 hello } }';
        const apolloTarget = 'client';
        const expected = 'query { appState2 { hello2 hello @client } }';
        expect(addApolloTargetToGqlQueryString(input, apolloTarget)).to.equal(expected);
    });

});

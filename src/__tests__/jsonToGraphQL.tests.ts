
import { expect } from 'chai';
import { jsonToGraphQL } from '../jsonToGraphQL';

describe('jsonToGraphQL()', () => {

    it('throws if no query object is specified', () => {
        expect(() => {
            (jsonToGraphQL as any)();
        }).to.throw('query object not specified');
    });

    it('throws if query is not an object', () => {
        expect(() => {
            jsonToGraphQL('not a query object');
        }).to.throw('query object not specified');
    });

});
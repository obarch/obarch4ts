import {DecoderSource} from '../DecoderSource';
import * as livedoc from "@obarch/livedoc"

test('decodeNull', () => {
    const testData = livedoc.myTestData()
    for (let row of testData.table) {
        const isNull = 'true' === row['is null']
        expect(new DecoderSource(livedoc.stripQuote(row['source'])).decodeNull()).toEqual(isNull)
    }
})

describe('decodeBoolean', () => {
    test('valid', () => {
        const testData = livedoc.myTestData()
        for (let row of testData.table) {
            const value = 'true' === row['value']
            expect(new DecoderSource(livedoc.stripQuote(row['source'])).decodeBoolean()).toEqual(value)
        }
    })
    test('invalid', () => {

    })
})
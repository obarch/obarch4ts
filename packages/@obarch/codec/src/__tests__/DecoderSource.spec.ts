const DecoderSource = require('../DecoderSource').DecoderSource
const livedoc = require("@obarch/livedoc")

test('decodeNull', () => {
    const testData = livedoc.myTestData()
    for (let $row of testData.table) {
        eval(testData.code.content)
    }
})

describe('decodeBoolean', () => {
    test('valid', () => {
        const testData = livedoc.myTestData()
        for (let row of testData.table) {
            const value = 'true' === row['value']
            expect(new DecoderSource(row['source']).decodeBoolean()).toEqual(value)
        }
    })
    test('invalid', () => {

    })
})
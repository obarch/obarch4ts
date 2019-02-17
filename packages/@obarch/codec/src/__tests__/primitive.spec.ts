const DecoderSource = require('../DecoderSource').default
const EncoderSink = require('../EncoderSink').default
const livedoc = require("@obarch/livedoc")

function testByTable() {
    const testData = livedoc.myTestData()
    for (let $row of testData.table) {
        for (let code of testData.codes) {
            eval(code.content)
        }
    }
}

function testByList() {
    const testData = livedoc.myTestData()
    for (let $item of testData.list) {
        eval(testData.code.content)
    }
}

describe('null', () => {
    test('decode', testByTable)
    test('encode', testByTable)
})

describe('boolean', () => {
    test('valid', testByTable)
    test('invalid', testByList)
})

describe('string', () => {
    test('valid', testByTable)
    test('invalid', testByList)
})

describe('integer', () => {
    test('decode', testByTable)
    test('encode/decode', testByTable)
    test('decode invalid', testByList)
    test('encode invalid', testByList)
})
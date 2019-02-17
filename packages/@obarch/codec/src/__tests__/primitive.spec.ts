const DecoderSource = require('../DecoderSource').default
const InvalidUTF8Error = require('../DecoderSource').InvalidUTF8Error
const EncoderSink = require('../EncoderSink').default
const livedoc = require('@obarch/livedoc')
//@ts-ignore
const Long = require('long')

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
    test('decode utf8', testByTable)
    test('invalid', testByList)
    test('invalid utf8', testByList)
})

describe('integer', () => {
    test('decode', testByTable)
    test('encode/decode', testByTable)
    test('decode invalid', testByList)
    test('encode invalid', testByList)
})

describe('long', () => {
    test('valid', testByTable)
    test('decode invalid', testByList)
})

describe('double', () => {
    test('valid', testByTable)
    test('invalid', testByList)
})
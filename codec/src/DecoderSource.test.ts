import {DecoderSource} from './DecoderSource';
import Markdown from 'markdown-it'
import * as fs from 'fs';
import {loadTestData} from './livedoc'

describe('decodeNull', () => {
    test('hello', function () {
        let testData = loadTestData()
        for (let row of testData.tables[0]) {
            console.log(row)
        }
        expect(new DecoderSource('null').decodeNull()).toBeTruthy()
        expect(new DecoderSource('nul').decodeNull()).toBeFalsy()
        expect(new DecoderSource('none').decodeNull()).toBeFalsy()
    });
})

test('markdown', () => {
    let md = Markdown()
    let tokens = md.parse(fs.readFileSync(__dirname + '/DecoderSource.test.md', 'utf8'), {})
    for (let token of tokens) {
        console.log(token.type, token)
    }
})
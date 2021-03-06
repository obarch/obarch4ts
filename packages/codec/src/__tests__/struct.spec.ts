const EncoderSink = require('../EncoderSink').default
const DecoderSource = require('../DecoderSource').default
const livedoc = require('@obarch/livedoc')

function testByTable() {
    const testData = livedoc.myTestData()
    const table = testData.table
    for (let $row of table) {
        for (let code of testData.codes) {
            eval(code.content)
        }
    }
}

test('struct', () => {
    testByTable()
})

export default {}
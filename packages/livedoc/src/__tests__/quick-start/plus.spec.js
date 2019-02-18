const plus = require('./plus')
const livedoc = require('@obarch/livedoc')

test('测试加法', () => {
    const testData = livedoc.myTestData()
    for(let $row of testData.table) {
        eval(testData.code.content)
    }
})
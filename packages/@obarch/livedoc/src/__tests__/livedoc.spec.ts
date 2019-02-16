import {myTestData} from "../livedoc"

test('one level table', () => {
    const testData = myTestData()
    expect(Array.from(testData.table)).toEqual([
        {col1: '1.1', col2: '1.2'},
        {col1: '2.1', col2: '2.2'}
    ])
})

describe('two level table', () => {
    test('leaf', () => {
        const testData = myTestData()
        expect(Array.from(testData.table)).toEqual([
            {col1: '1.1', col2: '1.2'},
            {col1: '2.1', col2: '2.2'}
        ])
    })
})

test('list', () => {
    const testData = myTestData()
    const list = testData.lists[0]
    expect(list).toEqual(['a', 'b'])
})
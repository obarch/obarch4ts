import {myTestData} from "../livedoc"

test('one level table', () => {
    const testData = myTestData()
    const table = testData.tables[0]
    expect(Array.from(table)).toEqual([
        {col1: '1.1', col2: '1.2'},
        {col1: '2.1', col2: '2.2'}
    ])
})

describe('two level table', () => {
    test('leaf', () => {
        const testData = myTestData()
        const table = testData.tables[0]
        expect(Array.from(table)).toEqual([
            {col1: '1.1', col2: '1.2'},
            {col1: '2.1', col2: '2.2'}
        ])
    })
})
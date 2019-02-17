import {myTestData} from "../livedoc"

test('one level table', () => {
    const testData = myTestData()
    let rows: any[] = []
    for (let row of testData.table) {
        rows.push(row)
    }
    expect(rows).toEqual([
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
    expect(testData.list).toEqual(['a', 'b'])
})

describe('code', () => {
    test('just one', () => {
        const testData = myTestData()
        expect(testData.code.content).toEqual('1+1')
    })
})
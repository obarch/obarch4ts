import BytesBuilder from "../BytesBuilder"

describe('append', () => {
    test('not overflow', () => {
        const builder = new BytesBuilder()
        builder.append(100)
        builder.append(101)
        expect(builder.toArray()).toEqual([100, 101])
    })
    test('overflow', () => {
        const builder = new BytesBuilder(new Uint8Array(1))
        builder.append(100)
        builder.append(101)
        expect(builder.toArray()).toEqual([100, 101])
    })
})
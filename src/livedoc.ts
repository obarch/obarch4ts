expect.extend({
    // @ts-ignore
    async getCurrentTest(testNamePath: string[]) {
        // @ts-ignore
        let path = this.currentTestName.split(' ')
        testNamePath.push(...path)
        return { pass: true };
    },
});

export function loadTestData() {
    let testNamePath: string[] = []
    // @ts-ignore
    expect(testNamePath).getCurrentTest()
    console.log(testNamePath)
}
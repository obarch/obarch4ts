import Markdown from 'markdown-it'
import * as fs from 'fs';
import Token from 'markdown-it/lib/token'

class TestInfo {
    testNames: string[] = [];
    testPath: string = ''
}

expect.extend({
    // @ts-ignore
    async inspectCurrentTest(testInfo: TestInfo) {
        // @ts-ignore
        testInfo.testNames = this.currentTestName.split(' ')
        // @ts-ignore
        testInfo.testPath = this.testPath
        return {pass: true};
    },
});

class TestData {
    private tokens: Token[]
    private offset: number = 0
    private currentHeadings: string[] = []

    constructor(tokens: Token[]) {
        this.tokens = tokens
        this.parse()
    }

    private parse() {
        for (; this.offset < this.tokens.length;) {
            let token = this.tokens[this.offset]
            this.offset++
            if (token.type === 'heading_open') {
                this.parseHeading(token)
            }
        }
    }

    private parseHeading(token: Token) {
        let level = TestData.levelOfHeadingTag(token.tag)
        if (level < 0) {
            return
        }
        let heading = this.parseTextUntil(t => t.type === 'heading_close')
        this.offset++
        this.currentHeadings = this.currentHeadings.slice(0, level).concat([heading])
    }

    private static levelOfHeadingTag(tag: string): number {
        switch (tag) {
            case 'h1':
                return 0
            case 'h2':
                return 1
            case 'h3':
                return 2
            case 'h4':
                return 3
            case 'h5':
                return 4
            default:
                return -1
        }
    }

    private parseTextUntil(until: (t: Token) => boolean): string {
        let content: string = ''
        for (; this.offset < this.tokens.length && !until(this.tokens[this.offset]); this.offset++) {
            let token = this.tokens[this.offset]
            content += token.content
        }
        return content
    }
}

export function loadTestData() {
    let testInfo = new TestInfo()
    // @ts-ignore
    expect(testInfo).inspectCurrentTest()
    let mdFilePath = testInfo.testPath.substring(0, testInfo.testPath.lastIndexOf('.')) + '.md'
    let md = new Markdown()
    let content = fs.readFileSync(mdFilePath, 'utf8')
    let tokens = md.parse(content, {})
    return new TestData(tokens)
}
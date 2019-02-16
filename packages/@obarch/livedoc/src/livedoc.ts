import Markdown from 'markdown-it'
import * as fs from 'fs';
import Token from 'markdown-it/lib/token'

class TestInfo {
    testName: string = ''
    testPath: string = ''
}

expect.extend({
    // @ts-ignore
    async inspectCurrentTest(testInfo: TestInfo) {
        // @ts-ignore
        testInfo.testName = this.currentTestName
        // @ts-ignore
        testInfo.testPath = this.testPath
        return {pass: true};
    },
});

class Table {
    head: string[] = []
    body: string[][] = [];

    * [Symbol.iterator]() {
        for (let row of this.body) {
            let namedRow: Record<string, string> = {}
            for (let i = 0; i < this.head.length; i++) {
                namedRow[this.head[i]] = row[i]
            }
            yield namedRow
        }
    }
}

type Code =  {
    info: string
    content: string
}

class TestData {
    private tokens: Token[]
    private offset: number = 0
    private currentHeadings: string[] = []
    private testName: string
    private _tables: Table[] = []
    private _lists: string[][] = []
    private _codes: Code[] = []

    constructor(tokens: Token[], testName: string) {
        this.tokens = tokens
        this.testName = testName
        this.parse()
    }

    get tables(): Table[] {
        return this._tables
    }

    get table(): Table {
        if (this._tables.length === 0) {
            throw 'no table in the test data'
        }
        return this._tables[0]
    }

    get lists(): string[][] {
        return this._lists
    }

    get list(): string[] {
        if (this._lists.length === 0) {
            throw 'no list in the test data'
        }
        return this._lists[0]
    }

    get codes(): Code[] {
        return this._codes
    }

    get code(): Code {
        if (this._codes.length === 0) {
            throw 'no code in the test data'
        }
        return this._codes[0]
    }

    private parse() {
        for (; this.offset < this.tokens.length;) {
            let token = this.tokens[this.offset++]
            if (token.type === 'heading_open') {
                this.parseHeading(token)
                continue
            }
            if (!this.isMySection()) {
                continue
            }
            if (token.type === 'table_open') {
                const table = this.parseTable()
                this._tables.push(table)
            } else if (token.type === 'bullet_list_open') {
                const list = this.parseList()
                this._lists.push(list)
            } else if (token.type === 'fence') {
                this._codes.push({info: token.info, content: stripTrailingNL(token.content)})
            }
        }
    }

    private isMySection(): boolean {
        return this.testName === this.currentHeadings.join(' ')
    }

    private parseList(): string[] {
        let list: string[] = []
        for(; this.offset < this.tokens.length;) {
            let token = this.tokens[this.offset++]
            if (token.type == 'bullet_list_close') {
                return list
            }
            if (token.type === 'list_item_open') {
                list.push(this.parseTextUntil(t => t.type === 'list_item_close'))
            }
        }
        return list
    }

    private parseTable(): Table {
        let table: Table = new Table()
        for (; this.offset < this.tokens.length;) {
            let token = this.tokens[this.offset++]
            if (token.type == 'table_close') {
                return table
            }
            if (token.type === 'thead_open') {
                table.head = this.parseTableHead()
            } else if (token.type == 'tbody_open') {
                table.body = this.parseTableBody()
            }
        }
        return table
    }

    private parseTableHead(): string[] {
        let head: string[] = []
        for (; this.offset < this.tokens.length;) {
            let token = this.tokens[this.offset]
            this.offset++
            if (token.type === 'thead_close') {
                return head
            }
            if (token.type === 'th_open') {
                head.push(this.parseTextUntil(t => t.type === 'th_close'))
            }
        }
        return head
    }

    private parseTableBody(): string[][] {
        let body: string[][] = []
        for (; this.offset < this.tokens.length;) {
            let token = this.tokens[this.offset]
            this.offset++
            if (token.type === 'tbody_close') {
                return body
            }
            if (token.type === 'tr_open') {
                body.push(this.parseTableRow())
            }
        }
        return body
    }

    private parseTableRow(): string[] {
        let row: string[] = []
        for (; this.offset < this.tokens.length;) {
            let token = this.tokens[this.offset]
            this.offset++
            if (token.type === 'tr_close') {
                return row
            }
            if (token.type === 'td_open') {
                row.push(this.parseTextUntil(t => t.type === 'td_close'))
            }
        }
        return row
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
        return stripQuote(content)
    }
}

export function myTestData(): TestData {
    let testInfo = new TestInfo()
    // @ts-ignore
    expect(testInfo).inspectCurrentTest()
    let mdFilePath = testInfo.testPath.substring(0, testInfo.testPath.lastIndexOf('.')) + '.md'
    let md = new Markdown()
    let content = fs.readFileSync(mdFilePath, 'utf8')
    let tokens = md.parse(content, {})
    return new TestData(tokens, testInfo.testName)
}

function stripQuote(str: string): string {
    if (str[0] === '`') {
        return str.substr(1, str.length - 2)
    }
    return str
}

function stripTrailingNL(str: string): string {
    if (str[str.length - 1] === '\n') {
        return str.substr(0, str.length - 1)
    }
    return str
}
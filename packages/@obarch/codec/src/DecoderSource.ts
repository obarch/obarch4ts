const A = 'A'.charCodeAt(0)


export default class DecoderSource {

    private readonly buf: string
    private offset: number

    constructor(buf: string) {
        this.buf = buf
        this.offset = 0
    }

    decodeNull(): boolean {
        let isNull = this.buf[this.offset] === 'n'
            && this.buf[this.offset + 1] === 'u'
            && this.buf[this.offset + 2] === 'l'
            && this.buf[this.offset + 3] === 'l'
        if (isNull) {
            this.offset += 4
        }
        return isNull
    }

    decodeBoolean(): boolean {
        if (this.buf[this.offset] === 't'
            && this.buf[this.offset + 1] === 'r'
            && this.buf[this.offset + 2] === 'u'
            && this.buf[this.offset + 3] === 'e') {
            this.offset += 4
            return true
        }
        if (this.buf[this.offset] === 'f'
            && this.buf[this.offset + 1] === 'a'
            && this.buf[this.offset + 2] === 'l'
            && this.buf[this.offset + 3] === 's'
            && this.buf[this.offset + 4] === 'e') {
            this.offset += 5
            return false
        }
        throw 'expect true or false'
    }

    decodeString(): string {
        if (this.buf[this.offset] !== '"') {
            throw 'expect "'
        }
        this.offset++
        let i = this.offset
        for (; i < this.buf.length;) {
            const c = this.buf[i]
            if (c === '"') {
                let str = this.buf.substr(this.offset, i - this.offset)
                this.offset = i + 1
                return str
            }
            if (c === '\\') {
                break
            }
            i++
        }
        let builder: [string] = [this.buf.substr(this.offset, i - this.offset)]
        this.offset = i
        while (true) {
            if (this.decodeStringEscaped(builder)) {
                break;
            }
            if (this.decodeStringRaw(builder)) {
                break;
            }
        }
        return builder[0]
    }

    private decodeStringEscaped(builder: [string]): boolean {
        let str = builder[0]
        for (let i = this.offset; i < this.buf.length;) {
            const c = this.buf[i]
            if (c === '"') {
                builder[0] = str
                this.offset = i + 1;
                return true
            }
            if (c === '\\') {
                if (this.buf[i + 1] !== '\\') {
                    throw 'expect \\'
                }
                const code = ((this.buf.charCodeAt(i + 2) - A) << 4) + this.buf.charCodeAt(i + 3) - A
                str += String.fromCharCode(code)
                i += 4
                continue
            }
            builder[0] = str
            this.offset = i;
            return false
        }
        throw 'expect closing "'
    }

    private decodeStringRaw(builder: [string]): boolean {
        for (let i = this.offset; i < this.buf.length;) {
            const c = this.buf[i]
            if (c === '"') {
                builder[0] += this.buf.substr(this.offset, i - this.offset)
                this.offset = i + 1;
                return true
            }
            if (c === '\\') {
                builder[0] += this.buf.substr(this.offset, i - this.offset)
                this.offset = i;
                return false
            }
            i++
        }
        throw 'expect closing "'
    }
}
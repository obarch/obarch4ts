const SLASH = '/'.charCodeAt(0)
const BACKSLASH = '\\'.charCodeAt(0)
const DOUBLE_QUOTE = '"'.charCodeAt(0)
const A = 'A'.charCodeAt(0)
const SEMICOLON = ';'.charCodeAt(0)
const MASK = (1 << 5) - 1

export default class EncoderSink {
    private builder: string = ''

    encodeNull(): EncoderSink {
        this.builder += 'null'
        return this
    }

    encodeBoolean(val: boolean): EncoderSink {
        if (val) {
            this.builder += 'true'
        } else {
            this.builder += 'false'
        }
        return this
    }

    encodeString(val: string): EncoderSink {
        this.builder += '"'
        for (let i = 0; i < val.length; i++) {
            const c = val.charCodeAt(i)
            if (c < 0x20 || c === SLASH || c === BACKSLASH || c === DOUBLE_QUOTE) {
                this.builder += '\\\\'
                this.builder += String.fromCharCode(A + (c >>> 4), A + (c & 0xF))
            } else {
                this.builder += val[i]
            }
        }
        this.builder += '"'
        return this
    }

    encodeInteger(val: number): EncoderSink {
        if (!Number.isInteger(val)) {
            throw 'expect Integer'
        }
        if (val > 2147483647) {
            throw '> 2147483647 can not be encoded by this method'
        }
        if (val < -2147483648) {
            throw '< -2147483648 can not be encoded by this method'
        }
        this.builder += '"\\b'
        this.builder += String.fromCharCode(
            SEMICOLON + ((val >>> 30) & MASK),
            SEMICOLON + ((val >>> 25) & MASK),
            SEMICOLON + ((val >>> 20) & MASK),
            SEMICOLON + ((val >>> 15) & MASK),
            SEMICOLON + ((val >>> 10) & MASK),
            SEMICOLON + ((val >>> 5) & MASK),
            SEMICOLON + (val & MASK),
        )
        this.builder += '"'
        return this
    }

    encodeObject(obj: any): EncoderSink {
        if (obj === undefined || obj === null) {
            this.encodeNull()
        }
        return this
    }

    toString(): string {
        return this.builder
    }
}
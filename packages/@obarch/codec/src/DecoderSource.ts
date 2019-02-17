import * as Long from 'long'
import {fromNumber as longFromNumber} from 'long'
import BytesBuilder from "./BytesBuilder"

const A = 'A'.charCodeAt(0)
const SEMICOLON = ';'.charCodeAt(0)
const DOUBLE_QUOTE = '"'.charCodeAt(0)
const BACKSLASH = '\\'.charCodeAt(0)

export class InvalidUTF8Error extends Error {
    constructor(m: string) {
        super(m);
        Object.setPrototypeOf(this, InvalidUTF8Error.prototype);
    }
}

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

    decodeInteger(): number {
        let isValid = this.buf[this.offset] === '"' && this.buf[this.offset + 1] === '\\' && this.buf[this.offset + 2] === 'b'
        if (!isValid) {
            throw 'expect "\\b'
        }
        this.offset += 3
        let val = 0
        for (let i = this.offset; i < this.buf.length; i++) {
            if (this.buf[i] == '"') {
                this.offset = i + 1;
                return val;
            }
            val = (val << 5) + (this.buf.charCodeAt(i) - SEMICOLON);
        }
        throw 'expect "'
    }

    decodeLong(type = 'b'): Long {
        let isValid = this.buf[this.offset] === '"' && this.buf[this.offset + 1] === '\\' && this.buf[this.offset + 2] === type
        if (!isValid) {
            throw 'expect "\\b'
        }
        this.offset += 3
        let val = Long.ZERO
        for (let i = this.offset; i < this.buf.length; i++) {
            if (this.buf[i] == '"') {
                this.offset = i + 1;
                return val;
            }
            val = val.shiftLeft(5).add(longFromNumber(this.buf.charCodeAt(i) - SEMICOLON));
        }
        throw 'expect "'
    }

    decodeDouble(): number {
        const longBits = this.decodeLong('f')
        var lo = longBits.low,
            hi = longBits.high;
        var sign = (hi >> 31) * 2 + 1,
            exponent = hi >>> 20 & 2047,
            mantissa = 4294967296 * (hi & 1048575) + lo;
        return exponent === 2047
            ? mantissa
                ? NaN
                : sign * Infinity
            : exponent === 0 // denormal
                ? sign * 5e-324 * mantissa
                : sign * Math.pow(2, exponent - 1075) * (mantissa + 4503599627370496);
        return 0
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
            if (c !== '\\') {
                builder[0] = str
                this.offset = i;
                return false
            }
            if (this.buf[i + 1] !== '\\') {
                throw 'expect \\'
            }
            const b1 = this.decodeByteEscaped(i)
            i += 4
            if ((b1 & 0b10000000) == 0b00000000) {
                str += String.fromCharCode(b1)
            } else if ((b1 & 0b11100000) == 0b11000000) {
                const b2 = this.decodeByteEscaped(i)
                i += 4
                const b2Invalid = (b2 & 0b11000000) != 0b10000000
                if (b2Invalid) {
                    throw new InvalidUTF8Error('second byte invalid')
                }
                str += String.fromCharCode(((b1 & 0x1f) << 6) | (b2 & 0x3f));
            } else if ((b1 & 0b11110000) == 0b11100000) {
                const isSurrogate = 0xED <= b1 && b1 <= 0xEF
                if (isSurrogate) {
                    throw new InvalidUTF8Error('surrogate should not be encoded in escaped form')
                }
                const b2 = this.decodeByteEscaped(i)
                i += 4
                const b2Invalid = (b2 & 0b11000000) != 0b10000000
                if (b2Invalid) {
                    throw new InvalidUTF8Error('second byte invalid')
                }
                const b3 = this.decodeByteEscaped(i)
                i += 4
                const b3Invalid = (b3 & 0b11000000) != 0b10000000
                if (b3Invalid) {
                    throw new InvalidUTF8Error('third byte invalid')
                }
                str += String.fromCharCode(((b1 & 0x0f) << 12)
                    | ((b2 & 0x3f) << 6)
                    | (b3 & 0x3f));
            } else {
                throw new InvalidUTF8Error('decode escaped string failed')
            }
        }
        throw 'expect closing "'
    }

    private decodeByteEscaped(i: number): number {
        if (this.buf[i] != '\\') {
            throw 'expect \\'
        }
        if (this.buf[i + 1] != '\\') {
            throw 'expect \\'
        }
        return ((this.buf.charCodeAt(i + 2) - A) << 4) + this.buf.charCodeAt(i + 3) - A
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

    decodeBytes(): Uint8Array {
        if (this.buf[this.offset] !== '"') {
            throw 'expect "'
        }
        this.offset++
        let builder = new BytesBuilder()
        for (let i = this.offset; i < this.buf.length;) {
            const c = this.buf.charCodeAt(i)
            if (c === BACKSLASH) {
                builder.append(this.decodeByteEscaped(i))
                i += 4
                continue
            }
            if (c === DOUBLE_QUOTE) {
                this.offset = i + 1
                return builder.toBytes()
            }
            i++
            if (c < 0x80) {
                builder.append(c & 0x7F)
            } else if (c < 0x800) {
                builder.append(((c >> 6) & 0x1F) | 0xC0)
                builder.append(((c & 0x3F) | 0x80))
            } else if (c < 0x10000) {
                builder.append(((c >> 12) & 0x0F) | 0xE0)
                builder.append(((c >> 6) & 0x3F) | 0x80)
                builder.append((c & 0x3F) | 0x80)
            } else {
                builder.append(((c >> 18) & 0x07) | 0xF0)
                builder.append(((c >> 12) & 0x3F) | 0x80)
                builder.append(((c >> 6) & 0x3F) | 0x80)
                builder.append((c & 0x3F) | 0x80)
            }
        }
        throw 'expect closing "'
    }
}
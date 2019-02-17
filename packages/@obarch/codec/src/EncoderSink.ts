import Long from 'long'

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
            if (this.shouldEscape(c)) {
                this.encodeByteEscaped(c)
            } else {
                this.builder += val[i]
            }
        }
        this.builder += '"'
        return this
    }

    encodeBytes(val: Uint8Array): EncoderSink {
        this.builder += '"'
        for (let i = 0; i < val.length;) {
            const b1 = val[i]
            i++
            if (this.shouldEscape(b1)) {
                this.encodeByteEscaped(b1)
                continue
            }
            if ((b1 & 0b10000000) == 0b00000000) {
                this.builder += String.fromCharCode(b1)
            } else if ((b1 & 0b11100000) == 0b11000000) {
                const b2 = val[i]
                const b2Invalid = (b2 & 0b11000000) != 0b10000000
                if (b2Invalid) {
                    this.encodeByteEscaped(b1)
                    continue
                }
                i++
                this.builder += String.fromCharCode(((b1 & 0x1f) << 6) | (b2 & 0x3f))
            } else if ((b1 & 0b11110000) == 0b11100000) {
                const isSurrogate = 0xED <= b1 && b1 <= 0xEF
                if (isSurrogate) {
                    this.encodeByteEscaped(b1)
                    continue
                }
                const b2 = val[i]
                const b2Invalid = (b2 & 0b11000000) != 0b10000000
                if (b2Invalid) {
                    this.encodeByteEscaped(b1)
                    continue
                }
                const b3 = val[i + 1]
                const b3Invalid = (b3 & 0b11000000) != 0b10000000
                if (b3Invalid) {
                    this.encodeByteEscaped(b1)
                    continue
                }
                i += 2
                this.builder += String.fromCharCode(((b1 & 0x0f) << 12)
                    | ((b2 & 0x3f) << 6)
                    | (b3 & 0x3f));
            } else {
                this.encodeByteEscaped(b1)
            }
        }
        this.builder += '"'
        return this
    }

    private shouldEscape(b: number): boolean {
        const isControlCharacter = 0 <= b && b < 0x20
        return isControlCharacter || b === SLASH || b === BACKSLASH || b === DOUBLE_QUOTE
    }

    private encodeByteEscaped(b: number): void {
        this.builder += '\\\\'
        this.builder += String.fromCharCode(A + (b >>> 4), A + (b & 0xF))
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

    encodeLong(val: Long): EncoderSink {
        this.builder += '"\\b'
        this.encodeLongBody(val)
        this.builder += '"'
        return this
    }

    private encodeLongBody(val: Long) {
        this.builder += String.fromCharCode(
            SEMICOLON + val.shiftRightUnsigned(63).and(MASK).toNumber(),
            SEMICOLON + val.shiftRightUnsigned(60).and(MASK).toNumber(),
            SEMICOLON + val.shiftRightUnsigned(55).and(MASK).toNumber(),
            SEMICOLON + val.shiftRightUnsigned(50).and(MASK).toNumber(),
            SEMICOLON + val.shiftRightUnsigned(45).and(MASK).toNumber(),
            SEMICOLON + val.shiftRightUnsigned(40).and(MASK).toNumber(),
            SEMICOLON + val.shiftRightUnsigned(35).and(MASK).toNumber(),
            SEMICOLON + val.shiftRightUnsigned(30).and(MASK).toNumber(),
            SEMICOLON + val.shiftRightUnsigned(25).and(MASK).toNumber(),
            SEMICOLON + val.shiftRightUnsigned(20).and(MASK).toNumber(),
            SEMICOLON + val.shiftRightUnsigned(15).and(MASK).toNumber(),
            SEMICOLON + val.shiftRightUnsigned(10).and(MASK).toNumber(),
            SEMICOLON + val.shiftRightUnsigned(5).and(MASK).toNumber(),
            SEMICOLON + val.and(MASK).toNumber()
        )
    }

    encodeDouble(val: number): EncoderSink {
        this.builder += '"\\f'
        const sign = val < 0 ? 1 : 0
        if (sign)
            val = -val;
        if (val === 0) {
            this.encodeLongBody(new Long(0, 1 / val > 0 ? /* positive */ 0 : /* negative 0 */ 2147483648))
        } else if (isNaN(val)) {
            this.encodeLongBody(new Long(0, 2146959360))
        } else if (val > 1.7976931348623157e+308) { // +-Infinity
            this.encodeLongBody(new Long(0, (sign << 31 | 2146435072) >>> 0))
        } else {
            var mantissa;
            if (val < 2.2250738585072014e-308) { // denormal
                mantissa = val / 5e-324;
                this.encodeLongBody(new Long(mantissa >>> 0, (sign << 31 | mantissa / 4294967296) >>> 0))
            } else {
                var exponent = Math.floor(Math.log(val) / Math.LN2);
                if (exponent === 1024)
                    exponent = 1023;
                mantissa = val * Math.pow(2, -exponent)
                this.encodeLongBody(new Long(
                    mantissa * 4503599627370496 >>> 0,
                    (sign << 31 | exponent + 1023 << 20 | mantissa * 1048576 & 1048575) >>> 0
                ))
            }
        }
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
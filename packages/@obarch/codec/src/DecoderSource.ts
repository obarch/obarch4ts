export class DecoderSource {

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
}
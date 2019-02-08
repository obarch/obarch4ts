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
}
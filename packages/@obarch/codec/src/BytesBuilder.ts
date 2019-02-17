export default class BytesBuilder {

    private buf: Uint8Array
    private offset: number

    constructor(buf: Uint8Array | null = null, len: number = 0) {
        if (buf && buf.length > 0) {
            this.buf = buf
        } else {
            this.buf = new Uint8Array(16)
        }
        this.offset = len
    }

    append(b: number) {
        this.buf[this.offset++] = b
        if (this.offset == this.buf.length) {
            const oldBuf = this.buf
            this.buf = new Uint8Array(this.buf.length * 2)
            this.buf.set(oldBuf)
        }
    }

    toBytes(): Uint8Array {
        let copy = new Uint8Array(this.offset)
        copy.set(this.buf.slice(0, this.offset))
        return copy
    }

    toArray(): number[] {
        return Array.from(this.buf.slice(0, this.offset))
    }
}
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
        this.builder += val
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
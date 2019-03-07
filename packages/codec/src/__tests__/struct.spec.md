# struct

```js
const val = JSON.parse($row.decoded)
expect(new EncoderSink().encodeValue(val).toString())
    .toEqual($row.encoded)
```

```js
const val = JSON.parse($row.decoded)
expect(new DecoderSource($row.encoded).decodeValue())
	.toEqual(val)
```

| encoded | decoded |
| ------ | ----- |
| `{}` | `{}` |
| `{"a":"b"}` | `{"a":"b"}` |

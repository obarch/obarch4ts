# array

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
| `[]` | `[]` |
| `["hello"]` | `["hello"]` |
| `["a","b"]` | `["a","b"]` |
| `["\t;;;;;;<"]` | `[1]` |
| `["\f;>ZY;;;;;;;;;;"]` | `[1.5]` |
| `[["a"],["b"]]` | `[["a"],["b"]]` |
| `[{"a":"b"}]` | `[{"a":"b"}]` |
| `[{"a":"b"},{"c":"d"}]` | `[{"a":"b"},{"c":"d"}]` |

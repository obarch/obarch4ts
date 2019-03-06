# array

```js
const val = eval($row.decoded)
expect(new EncoderSink().encodeObject(val).toString())
    .toEqual($row.encoded)
```
| encoded | decoded |
| ------ | ----- |
| `[]` | `[]` |
| `["hello"]` | `["hello"]` |
| `["a","b"]` | `["a","b"]` |
| `["\t;;;;;;<"]` | `[1]` |
| `["\f;>ZWGTNAGTNAGU"]` | `[1.1]` |
| `[["a"],["b"]]` | `[["a"],["b"]]` |
| `[{"a":"b"}]` | `[{"a":"b"}]` |
| `[{"a":"b"},{"c":"d"}]` | `[{"a":"b"},{"c":"d"}]` |

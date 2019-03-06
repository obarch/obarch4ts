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

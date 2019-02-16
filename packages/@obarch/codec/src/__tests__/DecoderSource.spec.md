# decodeNull

decode null 告诉当前位置是否是一个null。如果是则往前进，否则停留在原来的地方。

```typescript
expect(new DecoderSource($row.source).decodeNull())
    .toEqual('true' === $row.value)
```

| source | value |
| ------ | ----- |
| `null` | true  |
| `nul`  | false |
| `none` | false |


# decodeBoolean

## valid

| source | value |
| --- | --- |
| `true` | true |
| `false` | false |

## invalid

* tru
* fals
* "hello"
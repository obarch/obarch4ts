# null

## decode

```typescript
expect(new DecoderSource($row.encoded).decodeNull())
    .toEqual('true' === $row.decoded)
```

| encoded | decoded |
| ------ | ----- |
| `null` | true  |
| `nul`  | false |
| `none` | false |

## encode

```typescript
expect(new EncoderSink().encodeObject(eval($row.decoded)).toString())
    .toEqual($row.encoded)
```

| encoded | decoded |
| ------ | ----- |
| `null` | `null` |
| `null` | `undefined` |

# boolean

## valid

```typescript
expect(new DecoderSource($row.encoded).decodeBoolean())
	.toEqual('true' === $row.decoded)
```

```typescript
expect(new EncoderSink().encodeBoolean('true' === $row.decoded).toString())
    .toEqual($row.encoded)
```

| encoded  | decoded |
|:--------|:------|
| `true`  | `true`  |
| `false` | `false` |

## invalid

```typescript
expect(() => new DecoderSource($item).decodeBoolean())
	.toThrow()
```

* tru
* fals
* "hello"

# string

## valid

```typescript
expect(new DecoderSource($row.encoded).decodeString())
	.toEqual($row.decoded)
```

```typescript
expect(new EncoderSink().encodeString($row.decoded).toString())
	.toEqual($row.encoded)
```

| encoded | decoded |
| --- | --- |
| `"hello"` | hello |

## invalid


```typescript
expect(() => new DecoderSource($item).decodeString())
	.toThrow()
```

* `"hello`
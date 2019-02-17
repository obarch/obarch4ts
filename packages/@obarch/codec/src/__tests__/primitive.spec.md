# null

## decode

```typescript
const val = 'true' === $row.decoded
expect(new DecoderSource($row.encoded).decodeNull())
    .toEqual(val)
```

| encoded | decoded |
| ------ | ----- |
| `null` | true  |
| `nul`  | false |
| `none` | false |

## encode

```typescript
const val = eval($row.decoded)
expect(new EncoderSink().encodeObject(val).toString())
    .toEqual($row.encoded)
```

| encoded | decoded |
| ------ | ----- |
| `null` | `null` |
| `null` | `undefined` |

# boolean

## valid

```typescript
const val = 'true' === $row.decoded
expect(new DecoderSource($row.encoded).decodeBoolean())
	.toEqual(val)
```

```typescript
const val = 'true' === $row.decoded
expect(new EncoderSink().encodeBoolean(val).toString())
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
| `"hello"` | `hello` |
| `"中文"` | `中文` |
| `"𐐷"` | `𐐷` |
| `"𤭢"` | `𤭢` |
| `"🙏"` | `🙏` |
| `"\\CC"` | `"` |
| `"\\FM"` | `\` |
| `"\\CP"` | `/` |
| `"h\\CCe\\CCl\\CCl\\CCo"` | `h"e"l"l"o` |

## invalid

```typescript
expect(() => new DecoderSource($item).decodeString())
	.toThrow()
```

* `"hello`
* `"\"`

# integer

## decode

```typescript
const val = parseInt($row.decoded)
expect(new DecoderSource($row.encoded).decodeInteger())
	.toEqual(val)
```

| encoded | decoded |
| --- | --- |
| `"\b;;;;;;;;;;;;;Z"` | 31 |
| `"\b;;;;;;;;;;;;C;"` | 256 |
| `"\b;;;;;;;;;;;<Y;"` | 1984 |
| `"\b;;;;;;;;;;;;;;"` | 0 |
| `"\b;;;;;;;;;;;;;<"` | 1 |
| `"\b<JZZZZZZZZZZZZ"` | -1 |
| `"\b<JZZZZZZZZZZZY"` | -2 |

## encode/decode

```typescript
const val = parseInt($row.decoded)
expect(new EncoderSink().encodeInteger(val).toString())
    .toEqual($row.encoded)
```

```typescript
const val = parseInt($row.decoded)
expect(new DecoderSource($row.encoded).decodeInteger())
	.toEqual(val)
```

| encoded | decoded |
| --- | --- |
| `"\b;;;;;;Z"` | 31 |
| `"\b<ZZZZZZ"` | 2147483647 |
| `"\b=;;;;;;"` | -2147483648 |

## decode invalid

```typescript
expect(() => new DecoderSource($row.encoded).decodeInteger())
	.toThrow()
```

* `"30"`
* `"\b"`
* `"\b;`

## encode invalid

```typescript
const val = eval($item)
expect(() => new EncoderSink().encodeInteger(val))
    .toThrow()
```

* `1.1`
* `2147483648`

# long

## valid

```typescript
const val = Long.fromString($row.decoded)
expect(new EncoderSink().encodeLong(val).toString())
    .toEqual($row.encoded)
```

```typescript
const val = Long.fromString($row.decoded)
expect(new DecoderSource($row.encoded).decodeLong())
	.toEqual(val)
```

| encoded | decoded |
| --- | --- |
| `"\b;;;;;;;;;;;;;Z"` | 31 |
| `"\b;;;;;;;;;;;;C;"` | 256 |
| `"\b;;;;;;;;;;;<Y;"` | 1984 |
| `"\b;;;;;;;;;;;;;;"` | 0 |
| `"\b;;;;;;;;;;;;;<"` | 1 |
| `"\b<JZZZZZZZZZZZZ"` | -1 |
| `"\b<JZZZZZZZZZZZY"` | -2 |
| `"\b;BZZZZZZZZZZZZ"` | 9223372036854775807 |
| `"\b<C;;;;;;;;;;;;"` | -9223372036854775808 |

## decode invalid

```typescript
expect(() => new DecoderSource($row.encoded).decodeLong())
	.toThrow()
```

* `"30"`
* `"\b"`
* `"\b;`


# float

## valid

```typescript
const val = parseFloat($row.decoded)
expect(new EncoderSink().encodeFloat(val).toString())
    .toEqual($row.encoded)
```

| encoded | decoded |
| --- | --- |
| `"\f;;;;;;;;;;;;;;"` | 0.0 |

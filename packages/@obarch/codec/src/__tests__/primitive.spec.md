# null

## decode

```js
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

```js
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

```js
const val = 'true' === $row.decoded
expect(new DecoderSource($row.encoded).decodeBoolean())
	.toEqual(val)
```

```js
const val = 'true' === $row.decoded
expect(new EncoderSink().encodeBoolean(val).toString())
    .toEqual($row.encoded)
```

| encoded  | decoded |
|:--------|:------|
| `true`  | `true`  |
| `false` | `false` |

## invalid

```js
expect(() => new DecoderSource($item).decodeBoolean())
	.toThrow()
```

* tru
* fals
* "hello"

# string

## valid

```js
expect(new DecoderSource($row.encoded).decodeString())
	.toEqual($row.decoded)
```

```js
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


## decode utf8

```js
expect(new DecoderSource($row.encoded).decodeString())
	.toEqual($row.decoded)
```

| encoded | decoded |
| --- | --- |
| `"\\OE\\LI\\KN"` | `中` |
| `"\\MC\\KC"` | `¢` |

## invalid

```js
expect(() => new DecoderSource($item).decodeString())
	.toThrow()
```

* `"hello`
* `"\"`
* `"\\OE"`

## invalid utf8

```js
expect(() => new DecoderSource($item).decodeString())
	.toThrow(InvalidUTF8Error)
```

* `"\\OE\\AA\\AA"`
* `"\\MC\\AA"`

# bytes

## valid

```js
const val = ByteBuffer.wrap(eval($row.decoded))
expect(new EncoderSink().encodeBytes(val).toString())
    .toEqual($row.encoded)
```

| encoded | decoded |
| --- | --- |
| `"hello"` | `[0x68, 0x65, 0x6c, 0x6c, 0x6f]` |

# integer

## decode

```js
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

```js
const val = parseInt($row.decoded)
expect(new EncoderSink().encodeInteger(val).toString())
    .toEqual($row.encoded)
```

```js
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

```js
expect(() => new DecoderSource($item).decodeInteger(), $item)
	.toThrow()
```

* `"30"`
* `"\b`

## encode invalid

```js
const val = eval($item)
expect(() => new EncoderSink().encodeInteger(val))
    .toThrow()
```

* `1.1`
* `2147483648`

# long

## valid

```js
const val = Long.fromString($row.decoded)
expect(new EncoderSink().encodeLong(val).toString())
    .toEqual($row.encoded)
```

```js
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

```js
expect(() => new DecoderSource($item).decodeLong(), $item)
	.toThrow()
```

* `"30"`
* `"\b`

# double

## valid

```js
const val = parseFloat($row.decoded)
expect(new EncoderSink().encodeDouble(val).toString())
    .toEqual($row.encoded)
```

```js
const val = parseFloat($row.decoded)
expect(new DecoderSource($row.encoded).decodeDouble())
	.toBeCloseTo(val, 5)
```

| encoded | decoded |
| --- | --- |
| `"\f;;;;;;;;;;;;;;"` | 0.0 |
| `"\f;>ZW;;;;;;;;;;"` | 1.0 |
| `"\f;>ZWGTNAGTNAGU"` | 1.1 |

## invalid

```js
expect(() => new DecoderSource($item).decodeDouble())
	.toThrow()
```

* `"\b;;;;;;;;;;;;;;"`
* `"\f;;;;;;;;;;;;;;`
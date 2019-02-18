# 测试加法

加法的行为如下表所示：

```js
const left = eval($row.left)
const right = eval($row.right)
const result = eval($row.result)
expect(plus(left, right))
    .toEqual(result)
```

| left | right | result |
| ---- | ----- | ------ |
| 1    | 1     | 2      |
| 2    | 8     | 10     |
| -3   | -4    | -7     |
# 表格

## 获取行和列

```js
const testData = livedoc.myTestData()
const table = testData.table
expect(table.head).toEqual(['col1', 'col2'])
expect(table.body).toEqual([['1.1', '1.2'], ['2.1', '2.2']])
```

| col1 | col2 |
| --- | --- |
| 1.1 | 1.2 |
| 2.1 | 2.2 |

# one level table

| col1 | col2 |
| --- | --- |
| `1.1` | 1.2 |
| 2.1 | 2.2 |

# two level table

## leaf

| col1 | col2 |
| --- | --- |
| 1.1 | 1.2 |
| 2.1 | 2.2 |


# list

* a
* b

# code

## just one

```typescript
1+1
```
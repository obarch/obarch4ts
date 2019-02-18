# 表格

## 获取行和列

可以使用 `.head` 和 `.body` 获取所有的列和所有的行

```js
const table = livedoc.myTestData().table
expect(table.head).toEqual(['col1', 'col2'])
expect(table.body).toEqual([['1.1', '1.2'], ['2.1', '2.2']])
```

| col1 | col2 |
| --- | --- |
| 1.1 | 1.2 |
| 2.1 | 2.2 |

## 遍历

table 自身实现了 iterator 接口，可以用 `for ... of ...` 遍历

```js
const table = livedoc.myTestData().table
let rows = []
for(let row of table) {
    delete row['eval']
    rows.push(row)
}
expect(rows).toEqual([{'col1': '1.1', 'col2': '1.2'}, {'col1': '2.1', 'col2': '2.2'}])
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
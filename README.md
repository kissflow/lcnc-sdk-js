# _Kissflow LCNC JavaScript SDK_
------------------------------
>JavaScript SDK for developing over the Kissflow LCNC platform
------------------------------
### 1) Form Functions
#### 1.1) Get from field
```
lcnc.form.getField(fieldId).then((res) => {...})
or  
let value = await lcnc.form.getField(fieldId)
```

#### 1.2) Get table field
```
lcnc.form.getTableField(tableId, rowIndex, fieldId).then((res) => {...})
or  
let value = await lcnc.form.getTableField(tableId, rowIndex, fieldId)
```
#### 1.3) Update form field
```
lcnc.form.updateField({ fieldId_1: fieldValue, fieldId_2: fieldValue })
```
------------------------------
### 2) Client Functions
#### 2.1) Show Toast
```
lcnc.client.showInfo(message)
lcnc.client.showConfirm({title, content})
```
#### 2.1) Show confirm
```
lcnc.client.showConfirm({title, content})
```
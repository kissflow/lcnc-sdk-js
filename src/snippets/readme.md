## Kissflow SDK's Code Snippets 

You can use the following commands in script window, so that system will inserts the relevant code snippet in your script. 

- [1. App Commands](#app-commands)
- [2. Form Commands](#form-commands)
- [3. Common Commands](#common-commands)

<br/>

### App commands

> **get app variable**

*Description:* Get value of the global variable <br/>
*Inserts code snippet:*
```js
let variableName = await kf.app.getVariable("variableId");
```

> **set app variable** 

*Description:* Sets a new value to the global variable <br/>
*Inserts code snippet:*
```js
kf.app.setVariable("variableId", "newValue");
```

> **open or navigate page**

*Description:* Navigate to another page.<br/>
*Inserts code snippet:*
```js
kf.app.openPage("pageId", { inputParam1: "value1" });
```

> **get local variable**

*Description:* Get value of the local variable <br/>
*Inserts code snippet:*
```js
let variableName = await kf.app.page.getVariable("variableId");
```

> **set local variable**

*Description:* Sets a value to the specified local variable <br/>
*Inserts code snippet:*
```js
kf.app.page.setVariable("variableId", "newValue");
```

> **get input parameter** 

*Description:* Get specific input parameter of the page<br/>
*Inserts code snippet:*
```js
let value = await kf.app.page.getParameter("parameterId");
```

> **get all input parameters** 
    
*Description:* Get all input parameters in the page<br/>
*Inserts code snipeet:*
```js
let allParams = await kf.app.page.getAllParameters();
```

> **open a popup**

*Description:* Opens a popup in the page. <br/>
*Inserts code snippet:*
```js
kf.app.page.openPopup("popupId", { popupParam1: "value" });
```

> **get component in page**

*Description:* Get the specified component instance from the current page <br/>
*Inserts code snippet:*
```js
let componentInstance = await kf.app.page.getComponent("componentId");
```

> **refresh the component** 

*Description:* Refreshes the component<br/>
*Inserts code snippet:*
```js
componentInstance.refresh();
```

> **hide the component**

*Description:* Hides the component from page <br/>
*Inserts code snippet:*
```js
componentInstance.hide();
```

> **show the component**

*Description:* Shows the hidden component from page<br/>
*Inserts code snippet:*
```js
componentInstance.show();
```

> **set active tab**

*Description:* Sets the specified tab index as active - works only for the tab component<br/>
*Inserts code snippet:*
```js
// sets 2nd tab as active
componentInstance.setActiveTab(2);
```

> **get popup parameter**

*Description* Get specific parameter in the popup<br/>
*Inserts code snippet:*
```js
let value = await kf.app.page.popup.getParameter("parameterId");
```

> **get all popup parameters**

*Description:* Get all parameters in the popup<br/>
*Inserts code snippet:*
```js
// returns all popup parameters as object
let allParams = await kf.app.page.popup.getAllParameters();
```

> **close active popup**

*Description:* Closes the active popup in the page <br/>
*Inserts code snippet:*
```js
kf.app.page.popup.close();
```

### Form commands

> **get field value**

*Description:* Get value of a field in form<br/>
*Inserts code snippet:*
```js
let fieldValue = await kf.context.getField("fieldId");
```

> **set field value**

*Description:* Set value of a field in form<br/>
*Inserts code snippet:*
```js
kf.context.updateField({ "fieldId": "value" });
```

> **set field value - bulk**

*Description:* Set value of a field in form<br/>
*Inserts code snippet:*
```js
let payload = { fieldId: "value", fieldId2: "value2" };
kf.context.updateField(payload);
```

> **get form json**

*Description:* Returns whole data of current form in json format<br/>
*Inserts code snippet:*
```js
let formJSON = await kf.context.getJSON();
```

> **get table instance**

*Description:* Get instance of table, which can be further used to add or delete rows<br/>
*Inserts code snippet:*
```js
let tableInstance = kf.context.getTable("tableId");
```

> **add a row in table**

*Description:* Appends a row entry to table<br/>
*Inserts code snippet:*
```js
let rowDetails = { columnId1: "value1", columnId2: "value2" };
tableInstance.addRow(rowDetails);
```

> **get table row** 

*Description:* Returns all columns with values in specified row<br/>
*Inserts code snippet:*
```js
tableInstance.getRow("rowId");
```

> **get table json**

*Description:* Returns all rows & columns datainside table in json format<br/>
*Inserts code snippet:*
```js
let tableJSON = await kf.context.getJSON();
```

### Common commands

> **showinfo**

*Description:* Shows toast information<br/>
*Inserts code snippet:*
```js
kf.client.showInfo("message")
```


> **api call**

*Description:* Makes an API call to any Kissflow REST API endpoints<br/>
*Inserts code snippet:*
```js
kf.api(`/url`)
  .then((resp) => {})
  .catch((err) => {})
```

> **get account id**

*Description:* Retrieves the account ID<br/>
*Inserts code snippet:*
```js
kf.account._id
```

> **get dataform item**

*Description:* API call to get dataform item<br/>
*Inserts code snippet:*
```js
kf.api(`/form/2/${kf.account._id}/formId/instanceId`)
  .then((resp) => {})
  .catch((err) => {})
```

> **update dataform item**

*Description:* API call to update dataform item<br/>
*Inserts code snippet:*
```js
let payload = {};
kf.api(`/form/2/${kf.account._id}/formId/instanceId`, {
    method: "POST",
    body: JSON.stringify(payload)
})
   .then((resp) => {})
   .catch((err) => {})
```

> **delete dataform item**

*Description:* API call to delete dataform item<br/>
*Inserts code snippet:*
```js
let payload = {};
kf.api(`/form/2/${kf.account._id}/formId/instanceId`, {
    method: "DELETE"
})
   .then((resp) => {})
   .catch((err) => {})
```

> **create new dataform item**

*Description:* API call to create new dataform item<br/>
*Inserts code snippet:*
```js
let payload = {};
kf.api(`/form/2/${kf.account._id}/formId/`, {
    method: "POST",
    body: JSON.stringify(payload)
})
   .then((resp) => {})
   .catch((err) => {})
```

> **create new case item**

*Description:* API call to create new case item  <br/>
*Inserts code snippet:*
```js
let payload = {};
kf.api(`/case/2/${kf.account._id}/caseId/`, {
    method: "POST",
    body: JSON.stringify(payload)
})
   .then((resp) => {})
   .catch((err) => {})
```

> **create new process item**

*Description:* API call to create new process item  <br/>
*Inserts code snippet:*
```js
let payload = {};
kf.api(`/process/2/${kf.account._id}/processId/`, {
    method: "POST",
    body: JSON.stringify(payload)
})
  .then((resp) => {})
  .catch((err) => {})
```
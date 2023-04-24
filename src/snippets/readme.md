## Table of conents
- [1. App Snippets](#app-snippets)
- [2. Form Snippets](#form-snippets)
- [3. Common Snippets](#common-snippets)

<br/>

### App snippets

-   **Snippet:** get app variable <br />
    Get variable value from global app scope <br/>
    **Inserts Code:**
    ```js
    let variableName = await kf.app.getVariable("variableId");
    ```

-   **Snippet:** set app variable<br />
    Sets variable to new value in global app scope <br/>
    **Inserts Code:**
    ```js
    kf.app.setVariable("variableId", "newValue");
    ```

-   **Snippet:** open or navigate page<br />
    Navigate to another page.<br/>
    **Inserts Code:**
    ```js
    kf.app.openPage("pageId", { inputParam1: "value1" });
    ```

-   **Snippet:** get local(page) variable<br />
    Get variable value from page scope<br/>
    **Inserts Code:**
    ```js
    let variableName = await kf.app.page.getVariable("variableId");
    ```

-   **Snippet:** set local(page) variable<br />
    Sets specified variable to new value in page scope<br/>
    **Inserts Code:**
    ```js
    kf.app.page.setVariable("variableId", "newValue");
    ```

-   **Snippet:** get input parameter<br />
    Get specific input parameter of the page<br/>
    **Inserts Code:**
    ```js
    let value = await kf.app.page.getParameter("parameterId");
    ```

-   **Snippet:** get all input parameters<br />
    Get all input parameters in the page<br/>
    **Inserts Code:**
    ```js
    let allParams = await kf.app.page.getAllParameters();
    ```

-   **Snippet:** open a popup<br />
    Opens a popup in the page. <br/>
    **Inserts Code:**
    ```js
    kf.app.page.openPopup("popupId", { popupParam1: "value" });
    ```

-   **Snippet:** get component in page<br />
    Get instance of the components inside the page <br/>
    **Inserts Code:**
    ```js
    let componentInstance = await kf.app.page.getComponent("componentId");
    ```

-   **Snippet:** refresh the component<br />
    Refreshes the component<br/>
    **Inserts Code:**
    ```js
    componentInstance.refresh();
    ```

-   **Snippet:** hide the component <br />
    Hides the component from page<br/>
    **Inserts Code:**
    ```js
    componentInstance.hide();
    ```

-   **Snippet:** show the component<br />
    Shows the hidden component from page<br/>
    **Inserts Code:**
    ```js
    componentInstance.show();
    ```

-   **Snippet:** set active tab (only for tab component)<br />
    Sets the specified tab index as active<br/>
    **Inserts Code:**
    ```js
    // sets 2nd tab as active
    componentInstance.setActiveTab(2);
    ```

-   **Snippet:** get popup parameter<br />
    Get specific parameter in the popup<br/>
    **Inserts Code:**
    ```js
    let value = await kf.app.page.popup.getParameter("parameterId");
    ```

-   **Snippet:** get all popup parameters<br />
    Get all parameters in the popup<br/>
    **Inserts Code:**
    ```js
    // returns all popup parameters as object
    let allParams = await kf.app.page.popup.getAllParameters();
    ```

-   **Snippet:** close active popup<br />
    Closes the active popup in the page <br/>
    **Inserts Code:**
    ```js
    kf.app.page.popup.close();
    ```

### Form snippets

-   **Snippet:** get field value<br />
    Get value of a field in form<br/>
    **Inserts Code:**
    ```js
    let fieldValue = await kf.context.getField("fieldId");
    ```

-   **Snippet:** set field value<br />
    Set value of a field in form<br/>
    **Inserts Code:**
    ```js
    kf.context.updateField({ "fieldId": "value" });
    ```

-   **Snippet:** set field value - bulk<br />
    Set value of a field in form<br/>
    **Inserts Code:**
    ```js
    let payload = { fieldId: "value", fieldId2: "value2" };
    kf.context.updateField(payload);
    ```

-   **Snippet:** get form json<br />
    Returns whole data of current form in json format<br/>
    **Inserts Code:**
    ```js
    let formJSON = await kf.context.getJSON();
    ```

-   **Snippet:** get table instance<br />
    Get instance of table, which can be further used to add or delete rows<br/>
    **Inserts Code:**
    ```js
    let tableInstance = kf.context.getTable("tableId");
    ```

-   **Snippet:** add a row in table<br />
    Appends a row entry to table<br/>
    **Inserts Code:**
    ```js
    let rowDetails = { columnId1: "value1", columnId2: "value2" };
    tableInstance.addRow(rowDetails);
    ```

-   **Snippet:** get table row<br />
    Returns all columns with values in specified row<br/>
    **Inserts Code:**
    ```js
    tableInstance.getRow("rowId");
    ```

-   **Snippet:** get table json<br />
    Returns all rows & columns datainside table in json format<br/>
    **Inserts Code:**
    ```js
    let tableJSON = await kf.context.getJSON();
    ```

### Common snippets

-   **Snippet:** showinfo<br />
    Shows toast information<br/>
    **Inserts Code:** `kf.client.showInfo("message")`

-   **Snippet:** api call<br />
    Makes an API call to any Kissflow REST API endpoints<br/>
    **Inserts Code:**
    ```js
    kf.api(`/url`)
    .then((resp) => {})
    .catch((err) => {})
    ```

    **Snippet:** get account id<br />
    Retrieves the account ID<br/>
    **Inserts Code:** `kf.account._id`

    **Snippet:** get dataform item<br />
    API call to get dataform item<br/>
    **Inserts Code:**
    ```js
    kf.api(`/form/2/${kf.account._id}/formId/instanceId`)
    .then((resp) => {})
    .catch((err) => {})
    ```

    **Snippet:** update dataform item<br />
    API call to update dataform item<br/>
    **Inserts Code:**
    ```js
    let payload = {};
    kf.api(`/form/2/${kf.account._id}/formId/instanceId`, {
      method: "POST",
      body: JSON.stringify(payload)
    })
    .then((resp) => {})
    .catch((err) => {})
    ```

    **Snippet:** delete dataform item<br />
    API call to delete dataform item<br/>
    **Inserts Code:**
    ```js
    let payload = {};
    kf.api(`/form/2/${kf.account._id}/formId/instanceId`, {
      method: "DELETE"
    })
    .then((resp) => {})
    .catch((err) => {})
    ```

    **Snippet:** create new dataform item<br />
    API call to create new dataform item<br/>
    **Inserts Code:**
    ```js
    let payload = {};
    kf.api(`/form/2/${kf.account._id}/formId/`, {
      method: "POST",
      body: JSON.stringify(payload)
    })
    .then((resp) => {})
    .catch((err) => {})
    ```

    **Snippet:** create new case item<br />
    API call to create new case item  <br/>
    **Inserts Code:**
    ```js
    let payload = {};
    kf.api(`/case/2/${kf.account._id}/caseId/`, {
      method: "POST",
      body: JSON.stringify(payload)
    })
    .then((resp) => {})
    .catch((err) => {})
    ```

    **Snippet:** create new process item<br />
    API call to create new process item  <br/>
    **Inserts Code:**
    ```js
    let payload = {};
    kf.api(`/process/2/${kf.account._id}/processId/`, {
      method: "POST",
      body: JSON.stringify(payload)
    })
    .then((resp) => {})
    .catch((err) => {})
    ```

### App snippets

-   **Label:** get app variable <br />
    **Documentation:** Get variable value from global app scope <br/>
    **Inserts Code:**
    ```js
    let variableName = await kf.app.getVariable("variableId");
    ```

-   **Label:** set app variable<br />
    **Documentation:** Sets variable to new value in global app scope <br/>
    **Inserts Code:**
    ```js
    kf.app.setVariable("variableId", "newValue");
    ```

-   **Label:** open or navigate page<br />
    **Documentation:** Navigate to another page. Remove 2nd args if you don't have any input parameters to page.<br/>
    **Inserts Code:**
    ```js
    kf.app.openPage("pageId", { inputParam1: "value1" });
    ```

-   **Label:** get local(page) variable<br />
    **Documentation:** Get variable value from page scope<br/>
    **Inserts Code:**
    ```js
    let variableName = await kf.app.page.getVariable("variableId");
    ```

-   **Label:** set local(page) variable<br />
    **Documentation:** Sets specified variable to new value in page scope<br/>
    **Inserts Code:**
    ```js
    kf.app.page.setVariable("variableId", "newValue");
    ```

-   **Label:** get input parameter<br />
    **Documentation:** Get specific input parameter of the page<br/>
    **Inserts Code:**
    ```js
    let value = await kf.app.page.getParameter("parameterId");
    ```

-   **Label:** get all input parameters<br />
    **Documentation:** Get all input parameters in the page<br/>
    **Inserts Code:**
    ```js
    let allParams = await kf.app.page.getAllParameters();
    ```

-   **Label:** open a popup<br />
    **Documentation:** Opens a popup in the page. Remove 2nd argument if popup doesn't have any popup params. <br/>
    **Inserts Code:**
    ```js
    kf.app.page.openPopup("popupId", { popupParam1: "value" });
    ```

-   **Label:** get component in page<br />
    **Documentation:** Get instance of the components inside the page <br/>
    **Inserts Code:**
    ```js
    let componentInstance = await kf.app.page.getComponent("componentId");
    ```

-   **Label:** refresh the component<br />
    **Documentation:** Refreshes the component<br/>
    **Inserts Code:**
    ```js
    componentInstance.refresh();
    ```

-   **Label:** hide the component <br />
    **Documentation:** Hides the component from page<br/>
    **Inserts Code:**
    ```js
    componentInstance.hide();
    ```

-   **Label:** show the component<br />
    **Documentation:** Shows the hidden component from page<br/>
    **Inserts Code:**
    ```js
    componentInstance.show();
    ```

-   **Label:** set active tab (only for tab component)<br />
    **Documentation:** Sets the specified tab index as active<br/>
    **Inserts Code:**
    ```js
    // sets 2nd tab as active
    componentInstance.setActiveTab(2);
    ```

-   **Label:** get popup parameter<br />
    **Documentation:** Get specific parameter in the popup<br/>
    **Inserts Code:**
    ```js
    let value = await kf.app.page.popup.getParameter("parameterId");
    ```

-   **Label:** get all popup parameters<br />
    **Documentation:** Get all parameters in the popup<br/>
    **Inserts Code:**
    ```js
    // returns all popup parameters as object
    let allParams = await kf.app.page.popup.getAllParameters();
    ```

-   **Label:** close active popup<br />
    **Documentation:** Closes the active popup in the page <br/>
    **Inserts Code:**
    ```js
    kf.app.page.popup.close();
    ```

### Form snippets

-   **Label:** get field value<br />
    **Documentation:** Get value of a field in form<br/>
    **Inserts Code:**
    ```js
    let fieldValue = await kf.context.getField("fieldId");
    ```

-   **Label:** set field value<br />
    **Documentation:** Set value of a field in form<br/>
    **Inserts Code:**
    ```js
    kf.context.updateField({ "fieldId": "value" });
    ```

-   **Label:** set field value - bulk<br />
    **Documentation:** Set value of a field in form<br/>
    **Inserts Code:**
    ```js
    let payload = { fieldId: "value", fieldId2: "value2" };
    kf.context.updateField(payload);
    ```

-   **Label:** get form json<br />
    **Documentation:** Returns whole data of current form in json format<br/>
    **Inserts Code:**
    ```js
    let formJSON = await kf.context.getJSON();
    ```

-   **Label:** get table instance<br />
    **Documentation:** Get instance of table, which can be further used to add or delete rows<br/>
    **Inserts Code:**
    ```js
    let tableInstance = kf.context.getTable("tableId");
    ```

-   **Label:** add a row in table<br />
    **Documentation:** Appends a row entry to table<br/>
    **Inserts Code:**
    ```js
    let rowDetails = { columnId1: "value1", columnId2: "value2" };
    tableInstance.addRow(rowDetails);
    ```

-   **Label:** get table row<br />
    **Documentation:** Returns all columns with values in specified row<br/>
    **Inserts Code:**
    ```js
    tableInstance.getRow("rowId");
    ```

-   **Label:** get table json<br />
    **Documentation:** Returns all rows & columns datainside table in json format<br/>
    **Inserts Code:**
    ```js
    let tableJSON = await kf.context.getJSON();
    ```

### Common snippets

-   **Label:** showinfo<br />
    **Documentation:** Shows toast information<br/>
    **Inserts Code:** `kf.client.showInfo("message")`

-   **Label:** api call<br />
    **Documentation:** Makes an API call to any Kissflow REST API endpoints<br/>
    **Inserts Code:**
    ```js
    kf.api(`/url}`)
    .then((resp) => {})
    .catch((err) => {})
    ```

    **Label:** get account id<br />
    **Documentation:** Retrieves the account ID<br/>
    **Inserts Code:** `kf.account._id`

    **Label:** get dataform item<br />
    **Documentation:** API call to get dataform item<br/>
    **Inserts Code:**
    ```js
    kf.api(`/form/2/${kf.account._id}/formId/instanceId`)
    .then((resp) => {})
    .catch((err) => {})
    ```

    **Label:** update dataform item<br />
    **Documentation:** API call to update dataform item<br/>
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

    **Label:** delete dataform item<br />
    **Documentation:** API call to delete dataform item<br/>
    **Inserts Code:**
    ```js
    let payload = {};
    kf.api(`/form/2/${kf.account._id}/formId/instanceId`, {
      method: "DELETE"
    })
    .then((resp) => {})
    .catch((err) => {})
    ```

    **Label:** create new dataform item<br />
    **Documentation:** API call to create new dataform item<br/>
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

    **Label:** create new case item<br />
    **Documentation:** API call to create new case item  <br/>
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

    **Label:** create new process item<br />
    **Documentation:** API call to create new process item  <br/>
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

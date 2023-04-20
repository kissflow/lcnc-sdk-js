### App snippets

-   **Label:** get app variable 
    **Documentation:** Get variable value from global app scope 
    **Inserts Code:**
    ```js
    let variableName = await kf.app.getVariable("variableId");
    ```

-   **Label:** set app variable
    **Documentation:** Sets variable to new value in global app scope 
    **Inserts Code:**
    ```js
    kf.app.setVariable("variableId", "newValue");
    ```

-   **Label:** open or navigate page
    **Documentation:** Navigate to another page. Remove 2nd args if you don't have any input parameters to page.
    **Inserts Code:**
    ```js
    kf.app.openPage("pageId", { inputParam1: "value1" });
    ```

-   **Label:** get local(page) variable
    **Documentation:** Get variable value from page scope
    **Inserts Code:**
    ```js
    let variableName = await kf.app.page.getVariable("variableId");
    ```

-   **Label:** set local(page) variable
    **Documentation:** Sets specified variable to new value in page scope
    **Inserts Code:**
    ```js
    kf.app.page.setVariable("variableId", "newValue");
    ```

-   **Label:** get input parameter
    **Documentation:** Get specific input parameter of the page
    **Inserts Code:**
    ```js
    let value = await kf.app.page.getParameter("parameterId");
    ```

-   **Label:** get all input parameters
    **Documentation:** Get all input parameters in the page
    **Inserts Code:**
    ```js
    let allParams = await kf.app.page.getAllParameters();
    ```

-   **Label:** open a popup
    **Documentation:** Opens a popup in the page. Remove 2nd argument if popup doesn't have any popup params. 
    **Inserts Code:**
    ```js
    kf.app.page.openPopup("popupId", { popupParam1: "value" });
    ```

-   **Label:** get component in page
    **Documentation:** Get instance of the components inside the page 
    **Inserts Code:**
    ```js
    let componentInstance = await kf.app.page.getComponent("componentId");
    ```

-   **Label:** refresh the component
    **Documentation:** Refreshes the component
    **Inserts Code:**
    ```js
    componentInstance.refresh();
    ```

-   **Label:** hide the component 
    **Documentation:** Hides the component from page
    **Inserts Code:**
    ```js
    componentInstance.hide();
    ```

-   **Label:** show the component
    **Documentation:** Shows the hidden component from page
    **Inserts Code:**
    ```js
    componentInstance.show();
    ```

-   **Label:** set active tab (only for tab component)
    **Documentation:** Sets the specified tab index as active
    **Inserts Code:**
    ```js
    // sets 2nd tab as active
    componentInstance.setActiveTab(2);
    ```

-   **Label:** get popup parameter
    **Documentation:** Get specific parameter in the popup
    **Inserts Code:**
    ```js
    let value = await kf.app.page.popup.getParameter("parameterId");
    ```

-   **Label:** get all popup parameters
    **Documentation:** Get all parameters in the popup
    **Inserts Code:**
    ```js
    // returns all popup parameters as object
    let allParams = await kf.app.page.popup.getAllParameters();
    ```

-   **Label:** close active popup
    **Documentation:** Closes the active popup in the page 
    **Inserts Code:**
    ```js
    kf.app.page.popup.close();
    ```

### Form snippets

-   **Label:** get field value
    **Documentation:** Get value of a field in form
    **Inserts Code:**
    ```js
    let fieldValue = await kf.context.getField("fieldId");
    ```

-   **Label:** set field value
    **Documentation:** Set value of a field in form
    **Inserts Code:**
    ```js
    kf.context.updateField({ "fieldId": "value" });
    ```

-   **Label:** set field value - bulk
    **Documentation:** Set value of a field in form
    **Inserts Code:**
    ```js
    let payload = { fieldId: "value", fieldId2: "value2" };
    kf.context.updateField(payload);
    ```

-   **Label:** get form json
    **Documentation:** Returns whole data of current form in json format
    **Inserts Code:**
    ```js
    let formJSON = await kf.context.getJSON();
    ```

-   **Label:** get table instance
    **Documentation:** Get instance of table, which can be further used to add or delete rows
    **Inserts Code:**
    ```js
    let tableInstance = kf.context.getTable("tableId");
    ```

-   **Label:** add a row in table
    **Documentation:** Appends a row entry to table
    **Inserts Code:**
    ```js
    let rowDetails = { columnId1: "value1", columnId2: "value2" };
    tableInstance.addRow(rowDetails);
    ```

-   **Label:** get table row
    **Documentation:** Returns all columns with values in specified row
    **Inserts Code:**
    ```js
    tableInstance.getRow("rowId");
    ```

-   **Label:** get table json
    **Documentation:** Returns all rows & columns datainside table in json format
    **Inserts Code:**
    ```js
    let tableJSON = await kf.context.getJSON();
    ```

### Common snippets

-   **Label:** showinfo
    **Documentation:** Shows toast information
    **Inserts Code:** `kf.client.showInfo("message")`

-   **Label:** api call
    **Documentation:** Makes an API call to any Kissflow REST API endpoints
    **Inserts Code:**
    ```js
    kf.api(`/url}`)
    .then((resp) => {})
    .catch((err) => {})
    ```

    **Label:** get account id
    **Documentation:** Retrieves the account ID
    **Inserts Code:** `kf.account._id`

    **Label:** get dataform item
    **Documentation:** API call to get dataform item
    **Inserts Code:**
    ```js
    kf.api(`/form/2/${kf.account._id}/formId/instanceId`)
    .then((resp) => {})
    .catch((err) => {})
    ```

    **Label:** update dataform item
    **Documentation:** API call to update dataform item
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

    **Label:** delete dataform item
    **Documentation:** API call to delete dataform item
    **Inserts Code:**
    ```js
    let payload = {};
    kf.api(`/form/2/${kf.account._id}/formId/instanceId`, {
      method: "DELETE"
    })
    .then((resp) => {})
    .catch((err) => {})
    ```

    **Label:** create new dataform item
    **Documentation:** API call to create new dataform item
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

    **Label:** create new case item
    **Documentation:** API call to create new case item  
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

    **Label:** create new process item
    **Documentation:** API call to create new process item  
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

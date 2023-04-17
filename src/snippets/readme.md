The following are available snippets that can be used inside kissflow's code editor:

Trigger: "showinfo"
  Shows toast information
  Inserts code: 
    ```js
    kf.client.showInfo("message")
    ```
    
Trigger: "api call"
  Makes an API call to any kissflow rest api end points
  Inserts Code:
    ```js
      kf.api(`/url`)
        .then((resp) => {})
        .catch((err) => {})
    ```

  Trigger: "get app variable"
  Get variable value from global app scope
  Inserts Code:
    ```js
      let variableName = await kf.app.getVariable("variableId")
    ```

  Trigger: "set app variable"
  Sets variable to new value in global app scope
  Inserts Code:
    ```js
      kf.app.setVariable("variableId", "newValue")
    ```

  Trigger: "open or navigate page"
  Navigate to another page\nRemove 2nd args if you dont have any input parameters to page
  Inserts Code:
    ```js
      kf.app.openPage("pageId", { inputParam1: "value1" })
    ```

  Trigger: "get local(page) variable"
  Get variable value from page scope
  Inserts Code:
    ```js
      let variableName = await kf.app.page.getVariable("variableId")
    ```

  Trigger: "set local(page) variable"
  Sets specified variable to new value in page scope
  Inserts Code:
    ```js
      kf.app.page.setVariable("variableId", "newValue")
    ```

  Trigger: "get input parameter"
  Get specific input parameter of the page
  Inserts Code:
    ```js
      let value = await kf.app.page.getParameter("parameterId"); 
    ```

  Trigger: "get all input parameters"
  Get all input parameters in the page
  Inserts Code:
    ```js
      let allParams = await kf.app.page.getAllParameters();
    ```

  Trigger: "open a popup"
  Opens a popup in the page
  Inserts Code:
    ```js
      // remove 2nd argument if popup doesnt have any popup params
      kf.app.page.openPopup("popupId", { popupParam1: "value" });
    ```

  Trigger: "get component in page"
  Get instance of the components inside the page
  Inserts Code:
    ```js
      let componentInstance = await kf.app.page.getComponent("componentId")
    ```

  Trigger: "refresh the component"
  Refreshes the component
  Inserts Code:
    ```js
    componentInstance.refresh()
    ```

  Trigger: "hide the component"
  Hides the component from page
  Inserts Code:
    ```js
    componentInstance.hide()
    ```

  Trigger: "show the component"
  Shows the hidden component from page
  Inserts Code:
    ```js
    componentInstance.show()
    ```

  Trigger: "set active tab (only for tab component)"
  Sets the specified tab index as active
  Inserts Code:
    ```js
    // sets 2nd tab as active
    componentInstance.setActiveTab(2)
    ```

  Trigger: "get popup parameter": 
  Get specific parameter in the popup
  Inserts Code:
    ```js
    let value = await kf.app.page.popup.getParameter("parameterId"); 
    ```

  Trigger: "get all popup parameters"
  Get all parameters in the popup
  Inserts Code:
    ```js
    // returns all popup parameters as object
    let allParams = await kf.app.page.popup.getAllParameters();
    ```

  Trigger: "close active popup"
  Closes the active popup in the page
  Inserts Code:
    ```js
    kf.app.page.popup.close()
    ```

  Trigger: "get account id"
  Retrieves the account id
  Inserts Code:
    ```js
    kf.account._id
    ```

  Trigger: "get instance id"
  Get the instance id from event arguments
  Inserts Code:
    ```js
    kf.eventParameters._id
    ```

  Trigger: "get activity instance id"
  Get the activity instance id from event arguments
  Inserts Code:
    ```js
    kf.eventParameters._activity_instance_id
    ```

  Trigger: "get dataform item"
  API call to get dataform item
  Inserts Code:
    ```js
    kf.api(`/form/2/${kf.account._id}/formId/instanceId`)
    .then((resp) => {})
    .catch((err) => {})
    ```

  Trigger: "update dataform item"
  API call to update dataform item
  Inserts Code:
    ```js
    let payload = {};
    kf.api(`/form/2/${kf.account._id}/formId/instanceId`, {
      method: "POST",
      body: JSON.stringify(payload)
    })
    .then((resp) => {})
    .catch((err) => {})
    ```

  Trigger: "delete dataform item"
  API call to delete dataform item
  Inserts Code:
    ```js
    let payload = {};
    kf.api(`/form/2/${kf.account._id}/formId/instanceId`, { method: "DELETE" })
    .then((resp) => {})
    .catch((err) => {})
    ```

  Trigger: "create new dataform item"
  API call to create new dataform item
  Inserts Code:
    ```js
      kf.
    ```

  Trigger: "create new case item"
  API call to create new case item
  Inserts Code:
    ```js
      kf.
    ```

  Trigger: "create new process item"
  API call to create new process item
  Inserts Code:
    ```js
        kf.
    ```


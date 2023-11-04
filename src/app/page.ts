import { BaseSDK, LISTENER_CMDS } from "../core";

import { Component } from "./component";
import { Popup } from "./popup";

import { PageContext } from "../types/internal";

export class Page extends BaseSDK {
  _id: string;
  popup: Popup;
  type: string;
  constructor(props: PageContext) {
    super();
    this.type = "Page";
    this.popup = new Popup({});
    this._id = props.pageId;
  }
  getParameter(key: string) {
    return this._postMessageAsync(LISTENER_CMDS.GET_PAGE_PARAMS, {
      key,
    });
  }
  getAllParameters() {
    return this._postMessageAsync(LISTENER_CMDS.GET_ALL_PAGE_PARAMS, {
      pageId: this._id,
    });
  }
  getVariable(key: string) {
    return this._postMessageAsync(LISTENER_CMDS.GET_PAGE_VARIABLE, {
      key,
    });
  }
  setVariable(key: string, value: any) {
    return this._postMessageAsync(LISTENER_CMDS.SET_PAGE_VARIABLE, {
      key,
      value,
    });
  }
  openPopup(popupId: string, popupParams: object) {
    return this._postMessageAsync(LISTENER_CMDS.OPEN_POPUP, {
      popupId,
      popupParams,
    });
  }
  getComponent(componentId: string): Component {
    return this._postMessageAsync(
      LISTENER_CMDS.COMPONENT_GET,
      { componentId },
      true,
      (data) => new Component(data)
    );
  }
  callIntegration(integrationId: string, eventConfig: object, payload: object) {
    return this._postMessageAsync(
      LISTENER_CMDS.INTEGRATION_CALL,
      { integrationId, eventConfig, payload }
    );
  }
}

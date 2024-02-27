import { BaseSDK, LISTENER_CMDS } from "./index";
import { isObject } from "../utils";

export class CreateProxy extends BaseSDK {
  proxy: any
  scope: string
  path: string[]

  constructor(scope = "app_variable", target = {}, path = []) {
    super()
    this.scope = scope;
    this.path = path
    this.proxy = new Proxy(target, {
      get: this.get.bind(this),
      set: this.set.bind(this)
    });

    return this.proxy
  }

  get(target: object, property: string) {

    let cmd = LISTENER_CMDS[`GET_${this.scope.toUpperCase()}`];
    let args = {
      key: property,
      path: this.path
    }
    // communicate with main thread only to get parent variable
    let value = this.path.length ? target[property] : this._postMessageSync(cmd, args);

    if (isObject(value)) {
      target[property] = new CreateProxy(this.scope, value, [...this.path, property])
    }

    return Reflect.get(...arguments)
  }

  set(target: object, property: string, value: any, reciever) {

    let cmd = LISTENER_CMDS[`SET_${this.scope.toUpperCase()}`];
    let args = {
      key: property,
      value,
      path: this.path
    }

    let updatedValue = this._postMessageSync(cmd, args);

    if (isObject(updatedValue)) {
      target[property] = new CreateProxy(this.scope, updatedValue, [...this.path, property])
    }

    return Reflect.set(target, property, updatedValue, reciever)
  }
}
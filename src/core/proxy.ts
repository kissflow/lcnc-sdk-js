import { isObject } from "../utils";

export class CreateProxy {
  path: string[]
  parent: object

  constructor(parent: object, target = {}, path = []) {
    this.parent = parent;
    this.path = path;
    return new Proxy(target, this);
  }

  get(target: object, property: string) {
    let value = this.parent.get(property, this.path)

    if (isObject(value)) {
      return new CreateProxy(this.parent, value, [...this.path, property])
    }

    return value;
  }

  set(target: object, property: string, value: any, reciever) {
    let updatedValue = this.parent.set(property, value, this.path)

    if (isObject(updatedValue)) {
      return new CreateProxy(this.parent, updatedValue, [...this.path, property])
    }

    return updatedValue;
  }
}
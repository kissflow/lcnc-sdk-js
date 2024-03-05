// import { BaseSDK, LISTENER_CMDS } from "./index";
import { isObject } from "../utils";

// export class CreateProxy1 extends BaseSDK {
//   proxy: any
//   scope: string
//   path: string[]

//   constructor(scope = "app_variable", target = {}, path = []) {
//     super()
//     this.scope = scope;
//     this.path = path
//     this.proxy = new Proxy(target, {
//       get: this.get.bind(this),
//       set: this.set.bind(this)
//     });

//     return this.proxy
//   }

//   get(target: object, property: string) {

//     let cmd = LISTENER_CMDS[`GET_${this.scope.toUpperCase()}`];
//     let args = {
//       key: property,
//       path: this.path
//     }
//     // communicate with main thread only to get parent variable
//     let value = this.path.length ? target[property] : this._postMessageSync(cmd, args);

//     if (isObject(value)) {
//       target[property] = new CreateProxy(this.scope, value, [...this.path, property])
//     }

//     return Reflect.get(...arguments)
//   }

//   set(target: object, property: string, value: any, reciever) {

//     let cmd = LISTENER_CMDS[`SET_${this.scope.toUpperCase()}`];
//     let args = {
//       key: property,
//       value,
//       path: this.path
//     }

//     let updatedValue = this._postMessageSync(cmd, args);

//     if (isObject(updatedValue)) {
//       target[property] = new CreateProxy(this.scope, updatedValue, [...this.path, property])
//     }

//     return Reflect.set(target, property, updatedValue, reciever)
//   }
// }


// //Implementation - 2 for whole object 
// const PROXY_CMDS = {
//   'get.app.variable': LISTENER_CMDS.GET_APP_VARIABLE,
//   'set.app.variable': LISTENER_CMDS.SET_APP_VARIABLE
// }

// function getCommand(path) {
//   let key = Object.keys(PROXY_CMDS).find(key => path.indexOf(key) === 0)
//   return PROXY_CMDS[key]
// }


// export function createProxy(instance, target = {}, path = []) {
//   let handler = {
//     get(target: object, property: string,) {
//       // console.log('get', { ...params, path });

//       let isProxyCmd = getCommand(`get.${path.join('.')}`)

//       let value;

//       if (isProxyCmd) {
//         let args = {
//           key: property,
//           path: path
//         }
//         value = instance._postMessageSync(isProxyCmd, args);
//       } else {
//         value = [...path, property].reduce((acc, key) => acc[key], instance);
//       }
//       if (isObject(value)) {
//         return createProxy(instance, value, [...path, property])
//       }
//       return value;
//     },
//     set(target: object, property: string, value: any, reciever) {
//       console.log('set', { target, property, value, path })

//       let proxyCmd = getCommand(`get.${path.join('.')}`);

//       if (proxyCmd) {
//         let args = {
//           key: property,
//           value,
//           path: path
//         }
//         let updatedValue = instance._postMessageSync(proxyCmd, args);

//         if (isObject(updatedValue)) {
//           return createProxy(instance, updatedValue, [...path, property]);
//         }

//         return updatedValue;
//       }

//       // check is parent implementation needed since target object holds that value
//       // let parent = path.reduce((acc, key) => acc[key], instance);
//       // return parent[property] = value

//       // this will work no need of parent implementation
//       return Reflect.set(target, property, value, reciever)
//     },
//     apply(target, thisArg, args) {
//       // console.log('apply', { thisArg, path })
//       let value = path.reduce((acc, key) => acc[key], instance);
//       return value.apply(instance, args)
//     }
//   }
//   return new Proxy(target, handler)
// }



//Implementation - 3 for for particular object
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
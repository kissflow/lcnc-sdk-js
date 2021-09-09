import { BaseSDK } from "./base";
import { LISTENER_CMDS } from "./constants";

export class Formatter extends BaseSDK {
  toKfDate(date: string) {
    return this._postMessageAsync(LISTENER_CMDS.FORMAT_DATE, {
        date,
    });
  }

  toKfDateTime(date: string) {
    return this._postMessageAsync(LISTENER_CMDS.FORMAT_DATE_TIME, {
        date,
    });
  }

  toKfNumber(value: string) {
    return this._postMessageAsync(LISTENER_CMDS.FORMAT_NUMBER, {
        value,
    });
  }

  toKfCurrency(value: string, currencyCode: string) {
    return this._postMessageAsync(LISTENER_CMDS.FORMAT_CURRENCY, {
        value,
        currencyCode,
    });
  }

  toBoolean(value: string) {
    return this._postMessageAsync(LISTENER_CMDS.FORMAT_BOOLEAN, {
        value
    });
  }
}

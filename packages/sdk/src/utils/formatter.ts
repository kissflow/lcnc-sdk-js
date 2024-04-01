import { BaseSDK, LISTENER_CMDS } from "../core";

export class Formatter extends BaseSDK {
	toDate(date: string) {
		return this._postMessageAsync(LISTENER_CMDS.FORMAT_DATE, {
			date
		});
	}

	toDateTime(date: string) {
		return this._postMessageAsync(LISTENER_CMDS.FORMAT_DATE_TIME, {
			date
		});
	}

	toNumber(value: string) {
		return this._postMessageAsync(LISTENER_CMDS.FORMAT_NUMBER, {
			value
		});
	}

	toCurrency(value: string, currencyCode: string) {
		return this._postMessageAsync(LISTENER_CMDS.FORMAT_CURRENCY, {
			value,
			currencyCode
		});
	}

	toBoolean(value: string) {
		return this._postMessageAsync(LISTENER_CMDS.FORMAT_BOOLEAN, {
			value
		});
	}
}

import { EventBase } from "base";

type messageListeners = {
	[key: string]: Function[];
};
export const globalInstances = {};
export const globalMessageListeners: messageListeners = {};

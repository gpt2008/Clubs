import router from "../router";
import EventHub, { Event } from "./eventHub";
import { login } from "./router-utils";

const URL: string = process.env.PUBLIC_URL;

let history;
export function setHistory(_history: History) {
	history = _history;
}

class Rest<E, T> {
	private header: Headers;

	constructor() {
		this.header = new Headers();
		this.header.append("Accept", "application/json");
		this.header.append("Content-type", "application/json;charset=utf-8");
		this.header.append("Cache-Control", "no-cache");
		this.header.append("Access-Control-Allow-Origin", "*");
		this.header.append("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE");
		/*this.header.append('X-CURRENT', '@' + btoa(encodeURI(window.location.href)) + '!');*/
	}

	public operation(operation: E, dontMask?: boolean): Promise<T> {
		let serviceURL = "/JsonService";
		return this.fetchURL(
			serviceURL,
			{
				body: toJson(operation),
				cache: "no-cache",
				headers: this.header,
				method: "POST",
			},
			dontMask
		);
	}

	public fetchURL(url: string, config: any, dontMask?: boolean): Promise<T> {
		const urlToFetch = URL + url;

		if (!config.headers || !config.headers.has("X-XSRF-TOKEN")) {
			const xsrfCookieValue = getCookie("XSRF-TOKEN");
			if (xsrfCookieValue) {
				if (!config.headers) {
					config.headers = new Headers();
				}
				config.headers.set("X-XSRF-TOKEN", xsrfCookieValue);
			}
		}

		const promise = new Promise<T>((resolve: (f: T) => void, reject: (f: number) => void) => {
			fetch(urlToFetch, config)
				.then((Response) => {
					if (Response.status === 200 || Response.status === 0) {
						!dontMask && EventHub.trigger(Event.LOADING_OFF);
						Response.text().then((res) => {
							resolve(fromJson(res));
						});
					} else {
						!dontMask && EventHub.trigger(Event.LOADING_OFF);
						reject(Response.status);
						this.onError(Response.status);
					}
				})
				.catch((error) => {
					!dontMask && EventHub.trigger(Event.LOADING_OFF);
					reject(-1);
					if (error.response) {
						this.onError(error.response.status);
					}
				});
		});

		!dontMask && EventHub.trigger(Event.LOADING_ON);
		return promise;
	}

	private onError(status: number) {
		switch (status) {
			case 401: // login needed
			case 419: // session expired
				router.navigate(login);
				break;
			default:
			// history.push({pathname: PathComunes.ERROR, state: {from: history.location.pathname}});
		}
	}
}

/*******************************************************************************
 * toJson & fromJson
 */

function filterKeys(key: string, value: any) {
	if (key && key[0] === "$") {
		return undefined;
		/**
		 * Adjust hour in date objects so the DateAdapter in backend
		 * don't shift timezone of the parsed date object
		 */
	} else {
		return value;
	}
}

function toJson(value: any) {
	const result = JSON.stringify(value, filterKeys);
	return result;
}

// https://weblog.west-wind.com/posts/2014/jan/06/javascript-json-date-parsing-and-real-dates
const dateFormatISO =
	/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;
function dateParser(key: string, value: string) {
	if (typeof value === "string") {
		if (dateFormatISO.test(value)) {
			return new Date(value);
		}
	}
	return value;
}

function fromJson(str = "") {
	const PROTECTION_PREFIX = /^\)\]\}',?\n/;
	const result = str.replace(PROTECTION_PREFIX, "");
	return JSON.parse(result, dateParser);
}

function getCookie(cname: string) {
	const name = cname + "=";
	const ca = document.cookie.split(";");
	for (let i = 0, length = ca.length; i < length; i++) {
		let c = ca[i];
		while (c.charAt(0) === " ") {
			c = c.substring(1);
		}
		if (c.indexOf(name) === 0) {
			return c.substring(name.length, c.length);
		}
	}

	return null;
}

export default function <E, T>() {
	return new Rest<E, T>();
}

export { URL };

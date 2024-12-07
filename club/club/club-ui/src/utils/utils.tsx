import { EnumIdentificationType } from "types/enums/EnumIdentificationType";
import FormUtils from "./formUtils";
import Functions from "./functions";
import Icons from "./icons";
import Rest from "./rest";
import TableIcons from "./tableIcons";
import TableUtils from "./tableUtils";
import UserInfo from "./userInfo";

function validarEmail(valor: string) {
	return /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(
		valor.toLowerCase()
	);
}

function validateId(idType: EnumIdentificationType, idCode: string) {
	switch (idType) {
		case EnumIdentificationType.DNI:
			return /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKET]$/i.test(idCode.toUpperCase());
		case EnumIdentificationType.NIE:
			return /^[XYZ][0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKET]$/i.test(idCode.toUpperCase());
		default:
			return false;
	}
}

function getCookieContent(cookieValue?: string): any {
	let result = cookieValue;
	if (!result) {
		return undefined;
	}
	result = decodeURIComponent(result);
	if (!result) {
		return undefined;
	}
	result = JSON.parse(result);
	return result;
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
	return undefined;
}

export {
	FormUtils,
	Functions,
	getCookie,
	getCookieContent,
	Icons,
	Rest,
	TableIcons,
	TableUtils,
	UserInfo,
	validarEmail,
	validateId,
};

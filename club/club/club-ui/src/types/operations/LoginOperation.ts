import BaseOperation from "utils/baseOperation";

export default interface LoginOperation extends BaseOperation {
	login: string;
	password: string;
}

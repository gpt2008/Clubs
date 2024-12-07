import BaseOperation from "utils/baseOperation";

export default interface GetHolidaysManagementData extends BaseOperation {
	type: string;
	idLocation: number;
	date: Date;
	showPastPeriod: boolean;
}

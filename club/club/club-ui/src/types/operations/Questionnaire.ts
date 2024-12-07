import BaseOperation from "utils/baseOperation";



export interface GetQuestionnairePaged extends BaseOperation {
	offset?: number;
	limit: number;
	providerId?: number;
	dateCompletado?: Date;
	dateAppointmemt?: Date;
}
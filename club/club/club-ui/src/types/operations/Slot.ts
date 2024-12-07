import BaseOperation from "types/operations";

export interface SelectAvailabilitiesOperation extends BaseOperation {
	days: number;
	dateStart: Date;
	dateUser: Date;
	idProvider?: number;
	idLocation?: number;
	idEquivalentAppointment?: number;
}

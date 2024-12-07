export default interface PrestadorByLocation {
	idPrestador: number;
	hasPrestadorPhoto: boolean;
	namePrestador: string;
	nameSpeciality: string;
}

type PrestadorHolidaysType = {
	idProviderHoliday: number;
	idProvider: number;
	dateStart: Date;
	dateEnd: Date;
	nameHoliday: string;
	isPast: boolean;
}

export default interface PrestadorHolidays {
	idProviderHoliday: number;
	idProvider: number;
	dateStart: Date;
	dateEnd: Date;
	nameHoliday: string;
	isPast: boolean;
}

export default interface PrestadorHolidaysData {
	prestadorHolidayList: PrestadorHolidaysType[];
}

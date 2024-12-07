export default interface HolidaysPeriodLocation {
    idPeriod: number;
    idLocation: number;
    dateStart: Date;
    dateEnd: Date;
    namePeriod: string;
    isPast: boolean;
}

export default interface HolidaysManagementData {
    holidaysPeriodLocationList: HolidaysPeriodLocation[];
}
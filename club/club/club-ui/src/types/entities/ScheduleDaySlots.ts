export default interface ScheduleDaySlots {
    idScheduleDay?: number;
    day: number;
    configurationType?: number;
    copyConfigurationDay?: number;
    slots?: DaySlot[];
}

export interface DaySlot {
    idScheduleSlot?: number;
    idLocation?: number;
    location?: any;
    idPortfolio?: number;
    portfolio?: any;
    timeFrom?: string;
    valueTimeFrom?: number;
    timeTo?: string;
    valueTimeTo?: number;
    interval?: number;
    flagAllowGroupSession: boolean;
    nbrParticipants?: number;
    flagAllowOnlineCon: boolean;
    flagAllowPriorPayment: boolean;
}
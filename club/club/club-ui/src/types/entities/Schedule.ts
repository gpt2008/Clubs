export default interface Schedule {
    idSchedule: number;
    nameSchedule: string;
    typeStatus: number;
    flagPeriod: number;
    valueStartMonth: number;
    valueStartDay: number;
    valueEndMonth: number;
    valueEndDay: number;
    dateFrom?: Date;
    dateCreation: Date;
}
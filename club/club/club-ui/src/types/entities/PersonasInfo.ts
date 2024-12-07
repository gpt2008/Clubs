

export interface Personasinfo {
    push(arg0: { key: number; }): void;
    key: React.Key;
    idPropietario: number;
	namePerson: string;
	apellido1: string;
	apellido2: string;
    valuePhone: string;
    valueEmail: string;
    nuMasotas: number;
    dateAppointmentNext: Date;
    dateCreation: Date;
    mascotadata: Array<any>;
}
export type PolicyOwnerData = {
    name: string;
    surname1?: string;
    surname2?: string;
    dateCreation: Date;
    policyCode: string;
    productName: string;
    phone?: string;
    email: string;
    firstAppointmentDate: Date;
    nextAppointmentDate?: Date;
    numMascotas: number;
};
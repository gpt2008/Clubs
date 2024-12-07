export default interface Appointment {
    idAppointment: number;  
    dateAppointment: Date;
    valueTime: number;
    typeStatus: number;
    valueDuration: number;
    namePatient: string;
    nameSurname1: string;
    nameSurname2: string;
	idEspecialidad: number;
	idSubespecialidad: number;
	idActo: number;
	nameSubespecialidad: string;
	nameSpeciality: string;
	nameActo: string;
}

export default interface AppointmentAlternative {
    idAppointment: number;
    dateAvailable: Date;
    valueTimeAvailable: string;
    valueTimeMinutesAvailable: number;
    accurate: boolean;
}

export interface AppointmentInfo {
    idAppointment: number,
    idPatient: number,
    idLocation: number,
    typeStatus: number,
    nameLocation: string,
    valueAddress: string,
    idPortfolioService: number,
    nameService: string,
    idProvider: number,
    dateAppointment: Date,
    valueTime: number,
    price: number,
    idServiceReason: number,
    idPoliza: number,
    valuePhone: string,
    valueEmail: string,
    namePerson: string,
    nameSurname1: string,
    nameSurname2: string,
    dateBirth: Date,
    typeGender: number,
	idOrganization: number,
	nameOrganization: string,
	nameProvider: string,
	firstSurnameProvider: string,
	secondSurnameProvider: string,
}

export interface AppointmentHistory {
    typeStatus: number,
    nameOperator?: string,
    surnameOperator?: string,
    typeStatusDetail?: number,
    dateCreation: Date
}

export interface PersonaMascotaInfo {
	idAppointment: number;
	namePerson: string;
	apellido1: string;
	apellido2: string;
	valuePhone: string;
	valueEmail: string;
	idMascota: number;
	nameMascota: string;
	typeMascota: number;
	idRaza: number;
	nameActo: string;
	nameReason: string;
	nameRaza: string;
	nameEspecie: string;
	nameProvider: string;
	surName1Provider: string;
	surName2Provider: string;
	blobPhoto: Uint8Array;
	valueTimeAppointment: string;
	dateAppointment: Date;
	idProvider: number;
	nameDiagnostico: string;
	nameTratamiento: string;
	valueTratamiento: string;
	valueIndicaciones: string;
	valueEvaluacion: string;
	nameSpeciality: string;
	flagOnline: boolean;
	userComment: string;
	typeStatus: number;
	typeStatusDetail: number;
	appointmentHistory: AppointmentHistory[];
}
export interface AppointmentDetail {
	idAppointment: number;
	price: number;
	idPatient: number;
	namePatient: string;
	surname1Patient: string;
	surname2Patient: string;
	valuePhone: string;
	valueEmail: string;
	valuePublicUuid: string;
	idLocation: number;
	nameLocation: string;
	valueAddress: string;
	providerPhone: string;
	providerEmail: string;
	idPortfolioService: number;
	idPortfolio: number;
	codeSpeciality: string;
	nameSpeciality: string;
	nameService: string;
	idProvider: number;
	hasProviderPhoto: boolean;
	nameProvider: string;
	surname1Provider: string;
	surname2Provider: string;
	dateAppointment: Date;
	valueTime: number;
	valueDuration: number;
	typeStatus: number;
	flagOnline: number;
	valueNote: string;
	idUserManagerCreation: number;
	nameManager: string;
	surname1Manager: string;
	surname2Manager: string;
	dateCreation: Date;
	codeVideocall: string;
	valueHostKey: string;
    nameMascota: string;       
	nameProvince: string;
	namePerson: string;
	nameApellido1: string;
	PostalCodeProvider: string;
	idOrganization: number;
	nif_org: string;
}

export interface AppointmentFile {
	idFile: number;
	nameFile: string;
	typeMime: string;
	nbrSize: number;
	flagExternalStorage: number;
	blobFile?: File | Blob;
	typeFile: number;
}

export interface AppointmentDate {
	dateAppointment: Date;
	valueTimeAppointment: string;
}

export default interface AppointmentData {
    idAppointment: number;
    idPrestador: number;
    namePrestador: string;
    surname1Prestador: string;
    idLocation?: number;
    nameLocation?: string;
    dateAppointment: Date;
    valueTime: number;
    nameSpeciality: string;
    nameService: string;
    namePatient: string;
    surname1Patient?: string;
    typeStatus: number;
    allowCmbd: boolean;
}

export interface AppointmentNotificationChannel {
    idPatient?: number;
    typeChannel: number;
}

export default interface AppointmentProviderDetail {
	idAppointment: number;
	namePatient: string;
	surname1Patient?: string;
	surname2Patient?: string;
	valuePhone?: string;
	valueEmail?: string;
	idLocation?: number;
	nameLocation?: string;
	idPortfolioService: number;
	idPortfolio: string;
	codeSpeciality: string;
	nameSpeciality: string;
	nameService: string;
	idProvider: number;
	hasProviderPhoto: boolean;
	nameProvider: string;
	surname1Provider?: string;
	surname2Provider?: string;
	dateAppointment: Date;
	valueTime: number;
	valueDuration: number;
	typeStatus: number;
	typeStatusDetail: number;
	flagOnline: number;
	valueNote?: string;
	idUserManagerCreation: number;
	nameManager: string;
	surname1Manager: string;
	surname2Manager: string;
	dateCreation: Date;
	videocallUrl?: string;
	statusList: {
		typeStatus: number;
		nameOperator?: string;
		surnameOperator?: string;
		typeStatusDetail?: number;
		dateCreation: Date;
	}[];
}


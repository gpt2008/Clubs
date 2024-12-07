import AppointmentAlternative from "types/entities/Appointment";
import BaseOperation from ".";

export interface MultipleCancellationOperation extends BaseOperation {
	typeStatus: number;
	typeStatusDetail: number;
	valueStatusReason?: string;
	additionalMessage?: string;
	alternativeProposal: number;
	proposedDate?: number;
	appointments?: number[];
	alternatives?: AppointmentAlternative[];
}

export interface MultipleCancellationResponse {}

export interface GetAppointmentInfo extends BaseOperation {
	typeStatus?: number;
	idOrganization?: number;
	offset?: number;
	limit: number;
}

export interface GetAppointmentDetailInfo extends BaseOperation {
	idAppointment: number;
}

export interface SelectFilesByIdAppointmentOperation extends BaseOperation {
	idAppointment: number;
}

export interface SelectFilesByIdAppointmentResponse {
	idFile: number;
	nameFile: string;
	typeMime: string;
	nbrSize: number;
	flagExternalStorage: number;
	blobFile?: File | Blob;
	typeFile: number;
}

export interface UpdateAppointmentSlotOperation extends BaseOperation {
	idAppointment: number;
	idProvider?: number;
	dateAppointment: Date;
	valueTime: number;
}

export interface ClientAppointmentInfo {
	idAppointment: number;
	flagOnline: string;
	dateAppointment: Date;
	valueTimeAppointment: string;
	typeStatus: number;
	nameMascota: string;
	idProvider: number;
	namePerson: string;
	nameSurname1: string;
	nameSurname2: string;
	namePosition?: string;
	providerPhoto: boolean;
	nameSpeciality: string;
	valueJoinUrl: string;
	valuePublicUUID: string;

}

export interface GetLogedUserAppointmentsOperation extends BaseOperation {
	type: string;
	dateStart?: Date;
	dateEnd?: Date;
}

export interface GetLogedUserAppointmentsResponse {
	appointmentInfo: ClientAppointmentInfo;
	joinable: boolean;
	cancellable: boolean;
	editable: boolean;
}
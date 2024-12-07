import { UploadFile } from "antd/lib/upload/interface";
import { ExistingPet, NewPet } from "./Mascota";

export interface SlotStepInfo {
	idLocation: number;
	idPrestador: number;
	dateAvailability: Date;
	flagTaken: number;
	valueDayOfTheWeek: number;
	valueTime: string;
	valueTimeMinutes: number;
	flagAllowOnline: number;
	idPortfolio: number;
	idScheduleSlot: number;
}

export interface ProviderStepInfo {
	idProvider: number;
	namePerson: string;
	nameSurname1: string;
	nameSurname2?: string;
	namePosition?: string;
	hasProviderPhoto?: boolean;
	nameSpeciality?: string;
	typeProvider?: number;
}

export interface ClientStepInfo {
	nameNombre: string;
	nameApellido1: string;
	nameApellido2?: string;
	valuePhone?: string;
	valueEmail: string;
	codeIdentificacion: string;
	valuePassword: string;
	valueDataAuthorization?: boolean;
	valueThirdPartyAuthorization?: boolean;
}

export interface PetStepInfo {
	isNew: boolean;
	existingPet?: ExistingPet;
	newPet?: NewPet;
	idPortfolioService: number;
	idChannel: number;
	idReason: number;
	valueUserComment?: string;
	fileList: UploadFile[];
}

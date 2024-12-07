import { Specie } from "./Specie";

export default interface Provider {
	idProvider: number;
	hasProviderPhoto: boolean;
	typeIdentification?: number;
	codeIdentification?: string;
	namePerson: string;
	nameSurname1: string;
	nameSurname2: string;
	codeSpeciality: string;
	nameSpeciality: string;
	blobPhoto: any;
	nTodayAppointments: number;
	nTomorrowAppointments: number;
	nameHoliday: string;
	dateStartHoliday: Date;
	dateEndHoliday: Date;
	codeProfessionalCollege?: string;
	descEducation?: string;
	descCareer?: string;
	numSchedules: number;
	namePosition: string;
	nameService: string;
	NameOrganization: string;
	typeOnline?:number;
	fullNameProvider: string;
	typeProvider: number;
	value: string;
}

export default interface ProviderNameAndPhoto {
	idProvider: number;
	value: string;
	hasProviderAvatar: boolean;
}

type PetType = {
	idEspecie: number;
};

export type Language = {
	codeLanguage: string;
	idLanguage?: string;
};

export type ProviderDetails = {
	idProvider?: number;
	typeIdentification?: number;
	codeIdentification?: string;
	namePerson: string;
	nameSurname1?: string;
	nameSurname2?: string;
	valueEmail?: string;
	codeSpeciality?: string;
	nameSpeciality?: string;
	namePosition?: string;
	hasProviderPhoto: boolean;
	codeProfessionalCollege?: string;
	descEducation?: string;
	descCareer?: string;
	IdZoomUser?: string;
	species?: any[];
	languages: any[];
	speciality?: any[];
	locations: { nameLocation: string }[];
	typeOnline?:number;
};

export type ProviderPreview = {
	typeIdentification?: number;
	codeIdentification?: string;
	descEducation?: string;
	descCareer?: string;
	namePerson: string;
	nameSurname1: string;
	nameSurname2: string;
	species: any[];
	languages: any[];
	speciality: any[];
	locations: { nameLocation: string }[];
	typeOnline?:number;
};

type Speciality = {
	codeSpeciality: string;
	nameSpeciality: string;
};

export type ProviderModal = {
	providerData?: ProviderDetails;
	species?: Specie[];
	languages?: Language[];
	specialities?: Speciality[];
	locations: { nameLocation: string }[];
	typeOnline?:number;
};


export default interface ProviderPetLanguageInfo {
	providerData: ProviderDetails;
	petTypes: PetType[];
	languages: Language[];
};

export interface ProviderInfo {
	idProvider: number;
	namePerson: string;
	nameSurname1: string;
	nameSurname2: string;
	codeIdentification: string;
	blobPhoto: boolean;
}

export default interface ProviderData {
    idProvider: number;
    hasProviderPhoto: boolean;
    namePerson: string;
    nameSurname1: string;
    nameSurname2: string;
}

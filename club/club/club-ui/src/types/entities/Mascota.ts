
export interface Pet {
	idMascota: number;
    nameMascota: string;
    typeMascota: number;
    valueChip: string;
    dateNacimiento: Date;
    valueSexo: number;
    idRaza: number;
    idPatient: number;
    idPropietario: number;
    dateCreation: Date;
}

export interface PetPolicyInfo {
	idMascota: number;
	nameMascota?: string;
	typeMascota?: number;
	valueChip?: string;
	dateNacimiento?: Date;
	valueSexo?: number;
	idRaza?: number;
	flagMascotaActiva?: number;
}


export interface NewPet {
	nameMascota: string;
	typeMascota: number;
	idRaza?: number;
	chipValue?: string;
	sexMascota?: number;
	birthDate: Date;
}

export interface ExistingPet {
	idMascota: number;
	nameMascota: string;
}

export interface PetInformation extends PetPolicyInfo {
	lastDateAppointment?: Date;
	nextDateAppointment?: Date;
	dateInicio: Date;
	dateFin?: Date;
}

export interface MascotasFromPersonas {
    key: React.Key;
    idPropietario: number;
    nameMascota: string;
    nameRaza: string;
    nameEspecie: string;
    dateAppointment: String;
}
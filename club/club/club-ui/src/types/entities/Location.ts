import PrestadorByLocation from "./Prestador";

export default interface Location {
	idLocation: number;
	nameLocation: string;
}

export default interface LocationDetails {
	idLocation: number;
	nameLocation: string;
	hasLocationPhoto?: boolean;
	valueAddress: string;
	valuePhone: string;
	valueEmail: string;
    idOrganization: number;
    nameOrganization: string;
    nameProvince: string;
    services?: any[];
	prestadoresList?: PrestadorByLocation[];
	dateUltimoCambioPerfil: Date;
}


export default interface LocationInfo {
    idLocation: number;
    nameLocation: string;
    valueAddress: string;
    valueAddressDetails?: string;
    valueLong: number;
    valueLat: number;
    hasLocationPhoto?: boolean;
    descLocation?: string;
    valuePhone: string;
    valueEmail: string;
	service: string;
	schedule:string;
	idOrganization: number;
}

export default interface LocationFile {
    idFile?: number;
    nameFile: string;
    typeMime: string;
    hasFile: boolean;
    nbrSize: number;
    blobFile: File | Blob;
    typeFile: number;
    idLocationFile: number;
}

export default interface LocationIQ {
	place_id: string;
	display_name: string;
	lon: string;
	lat: string;
}

type LocationByCoordinates = {
	hasLocationPhoto: boolean;
	idLocation: number;
	nameProvince: string;
	nameLocation: string;
	postalCode: string;
	service: string;
	valueAddress: string;
	valueEmail: string;
	valuePhone: string;
	valueLat: number;
	valueLong: number;
	schedule: string;
    distance: number;
};


type Coordinates = {
	latitude: number;
	longitude: number;
};

type LocationDetailsWithAddress = {
	hasLocationPhoto: boolean;
	idLocation: number;
	nameProvince: string;
	nameLocation: string;
	postalCode: string;
	service: string;
	valueAddress: string;
	valueEmail: string;
	valuePhone: string;
	valueLat: number;
	valueLong: number;
	schedule: string;
};

export type {
    Coordinates,
    Location,
    LocationByCoordinates,
    LocationDetailsWithAddress,
};

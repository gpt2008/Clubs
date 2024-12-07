export interface Client {
	CodeIdentificacion: string;
	NameNombre: string;
	NameApellido1: string;
	NameApellido2?: string;
	valuePhone?: string;
	valueEmail: string;
	valuePassword: string;
	valueDataAuthorization?: boolean;
	valueThirdPartyAuthorization?: boolean;
}
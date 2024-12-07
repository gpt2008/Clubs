
export default interface CarterasDetails {
	idCartera: number;
	idEspecialidad: number;
	nameCartera: string;
	nameEspecialidad: string;
}

export interface CarterasServicios {

	idCartera: number;
	idEspecialidad: number;
	codeEspecialidad: string;
	nameEspecialidad: string;
	IdSubespecialidad: number;
	codeSubespecialidad: string;
	nameSubespecialidad: string;
	idActo: number;
	codeActo: string;
	nameActo: string;
}

export interface Carteras {
	idCartera: number;
	nameCartera: string;
	idEspecialidad: number;
	creationDate: Date;
	deletionDate: Date;
}

interface CarterasData {
    included: boolean;
    precio: number | null;
}

export interface ComparisonRecord {
    key: React.ReactNode;
    codeEspecialidad: string;
    nameEspecialidad: string;
    codeSubespecialidad: string;
    nameSubespecialidad: string;
    codeActo: string; 
    nameAct: string;
    carteras: {
        [key: string]: CarterasData;
    };
}
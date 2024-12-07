
export default interface PreciosDetails {
    key: React.ReactNode;
    nameGarantia: string;
	idPadre: number;
    children?: PreciosDetails[];
}

export interface Precios {
    idPrecio: number;
    namePrecio: string;
    idGarantia: number;
	idPrecioPadre: number;
}

interface PreciosData {
    included: boolean;
    precio: number | null;
    pctDescuento: number | null;
    desDescuento: string | null;
}

export interface ComparisonRecord {
    key: React.ReactNode;
    codeEspecialidad: string;
    nameEspecialidad: string;
    codeSubespecialidad: string;
    nameSubespecialidad: string;
    codeActo: string; 
    nameAct: string;
    precios: {
        [key: string]: PreciosData;
    };
}
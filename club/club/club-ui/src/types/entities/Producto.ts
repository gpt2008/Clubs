

export default interface ProductosDetails {
	idProducto: number;
    codeProducto: string;
	nameProducto: string;
}

export interface ProductoServicesAmt {
    codeEspecialidad: string;
	nameEspecialidad: string;
    codeSubespecialidad: string;
    nameSubespecialidad: string;
    codeActo: string; 
    nameActo: string;
    amtPrecioMaximo: number;
    pctDescuento?: number;
    desDescuento?: string;
    amtPrecioMaximo2: number;
    pctDescuento2?: number;
    desDescuento2?: string
}

interface ProductData {
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
    productos: {
        [key: string]: ProductData;
    };
}

export interface SimilarProducts {
    idProducto: number;
    idProductoSimilar: number;
    nameProductoSimilar: string;
    numDiferencias: number;
}

export interface ProductsPage {
    key: React.ReactNode;
	codeProducto: string;
    nameProducto: string;
	idGarantia: React.ReactNode;
	idCartera: React.ReactNode;
    nameCartera: string;
	idPrecio: React.ReactNode;
    namePrecio: string;
	idPadre: number;
	colectivos: string[];
	similarProductos: SimilarProducts[];
    children?: ProductsPage[];
}
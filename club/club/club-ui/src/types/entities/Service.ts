export default interface Service {
    idPortfolioService: number;
    codeSpeciality: string;
    nameSpeciality: string;
    nameService: string;
    valueDuration: number;
    value: string;
    label: string;
    children: Service[];
    idService: number;
    codeService: string;
}

export interface NewService {
    idCartera: number;
    idEspecialidad: number;
    nameEspecialidad: string;
    IdSubespecialidad: number;
    nameSubespecialidad: string;
    idActo: number;
    nameActo: string;
    children: NewService[];
    valueDuration: number;
    value: string;
    label: string;
}
export default interface IPatient {
    idPatient: number;

    typeIdentification: number;

    codeIdentification: string;
        
    namePatient: string;
    
    nameSurname1: string;
    
    nameSurname2: string;

    dateBirth: Date;
    
    valueContactPhone: string;
    
    valueContactEmail: string;

    dateCreation?: Date;

    valueNote?: string;
}
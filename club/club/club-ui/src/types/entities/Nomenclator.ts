
export default interface NomenclatorDetails {
    idSpeciality:number;
    codeSpeciality: number;
	nameSpeciality: string;
    idSubspeciality:number;
    codeSubspeciality: number;
	nameSubspeciality: string;
    idAct:number;
    codeAct: string;
	nameAct: string;
    valueDuration: number;
    creationDate: Date;
	deletionDate: Date;
    value: string;
    label: string;
    children: NomenclatorDetails[];
}
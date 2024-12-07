export interface QuestionnaireListInformation {
    idRespuestas: number;
    dateCompletado: Date;
    idCuestionario: number;
    dateAppointment: Date;
    namePerson: string;
    firstNameSurname: string;
    secondNameSurname: string;
    nameActo: string;
    providerName: string;
    providerFirstNameSurname: string;
    providerSecondNameSurname: string;
	valueTexto: string;
	valueRating: number;
}

export interface QuestionData {
	idPregunta: number;
	idPreguntaGrupo: number;
	valueOrder: number;
	dateDeletion: Date;
	namePregunta: string;
}

export interface QuestionGroupData {
	idPreguntaGrupo: number;
	idCuestionario: number;
	nameGrupo: string;
	valueOrder: number;
	valueTiempoEstimado: number;
	valueUnidadTiempoEstimado: number;
	dateCreation: Date;
}

export interface QuestionInputData {
	idEntradaPregunta: number;
	idPregunta: number;
	typeEntrada: number;
	typeVisualizacion: number;
	flagObligatorio: number;
	idValorEntradaObligatorio: number;
	idEntradaObligatoria: number;
	idEntradaOpcional: number;
	valueTamanio: number;
	idValorEntradaOpcional: number;
	valueOrder: number;
	dateDeletion: Date;
	nameEtiqueta: string;
}

export interface QuestionnaireData {
	key: number;
	idCuestionario: number;
	typeCuestionario: number;
	nameCuestionario: string;
	dateCreation: Date;
	numberPreguntas: number;
}

export interface QuestionnaireFormDataResponse {
	idCuestionario: number;
	typeCuestionario: number;
	nameCuestionario: string;
	descMensajeInicial: string;
	descMensajeFinal: string;
}

export interface QuestionnaireQuestionAnswer {
	idEntradaPregunta?: number;
	valueTexto?: string;
	idValorEntrada?: number;
	valueNumber?: number;
}

import { FormInstance } from "antd/lib/form";
import { Store } from "antd/lib/form/interface";
import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { QuestionInputData } from "types/entities/Questionnaire";
import valueData from "types/entities/valueData";
import FormErrorField from "utils/form/formErrorField";
import { Rest } from "utils/utils";
import View from "./QuestionInputForm";

interface IProps {
	onClose: () => void;
	idQuestion?: number;
	idQuestionInput?: number;
	visible?: boolean;
}

export interface IState {
	questionInputData?: QuestionInputData;
	loaded?: boolean;
	errorFields: FormErrorField[];
	data?: valueData[];
	previousInputs?: QuestionInputData[];
	previousInputsValues?: valueData[];
}
class QuestionInputFormContainer extends React.Component<WithTranslation & IProps, IState> {
	public state: IState = {
		loaded: false,
		errorFields: [],
		previousInputs: [],
		previousInputsValues: [],
	};

	public componentDidMount() {
		if (this.props.idQuestionInput) {
			this.loadData();
		} else {
			this.setState({ loaded: true });
		}
		this.getPreviousInputOptions();
		this.getPreviousInputValues();
	}

	public render() {
		return this.state.loaded ? (
			<View
				{...this.state}
				idQuestion={this.props.idQuestion}
				idQuestionInput={this.props.idQuestionInput}
				visible={this.props.visible}
				onCancel={() => this.props.onClose()}
				validateAndSave={this.validateAndSave}
			/>
		) : (
			<></>
		);
	}

	private loadData = () => {
		Rest<{ type: string; idEntradaPregunta: number }, valueData[]>()
			.operation({
				type: "GetValuesByEntradaPregunta",
				idEntradaPregunta: this.props.idQuestionInput!,
			})
			.then((r) => {
				r.map((value) => (value.key = "e" + value.idValorEntrada));
				this.setState({
					data: r,
				});
				Rest<{ type: string; idEntradaPregunta: number }, QuestionInputData>()
					.operation({
						type: "GetEntradaPreguntaData",
						idEntradaPregunta: this.props.idQuestionInput!,
					})
					.then((response) => {
						this.setState({
							questionInputData: response,
							loaded: true,
						});
					});
			});
	};

	private validateAndSave = (form: FormInstance, datos: valueData[]) => {
		form
			.validateFields()
			.then((values) => {
				this.setState({ data: datos });
				this.internalValidation(values, true);
			})
			.catch((info) => {
				this.internalValidation(info.values, false);
			});
	};

	private internalValidation = (values: Store, formValidationSucceded: boolean) => {
		this.validate(values)?.then((errors) => {
			if (formValidationSucceded && (!errors || errors.length === 0)) {
				this.save(values);
			} else {
				this.setState({ errorFields: errors });
			}
		});
	};

	private getPreviousInputOptions = () => {
		this.props.idQuestionInput
			? Rest<{ type: string; idPregunta: number; idEntradaPregunta: number }, QuestionInputData[]>()
					.operation({
						type: "SelectEntradasPreguntaByIdPregunta",
						idPregunta: this.props.idQuestion!,
						idEntradaPregunta: this.props.idQuestionInput!,
					})
					.then((response) => {
						response.forEach((i) => {
							this.setState({ previousInputs: this.state.previousInputs!.concat([i]) });
						});
					})
			: Rest<{ type: string; idPregunta: number }, QuestionInputData[]>()
					.operation({
						type: "SelectEntradasPreguntaByIdPregunta",
						idPregunta: this.props.idQuestion!,
					})
					.then((response) => {
						response.forEach((i) => {
							this.setState({ previousInputs: this.state.previousInputs!.concat([i]) });
						});
					});
	};
	private getPreviousInputValues = () => {
		Rest<{ type: string; idPregunta: number }, valueData[]>()
			.operation({
				type: "SelectEntradasPreguntaByIdPregunta",
				idPregunta: this.props.idQuestion!,
			})
			.then((response) => {
				response.forEach((i) => {
					this.setState({ previousInputsValues: this.state.previousInputsValues?.concat([i]) });
				});
			});
	};

	private validate = (values: Store) => {
		return new Promise((resolve: (f: FormErrorField[]) => void) => {
			let errors: FormErrorField[] = [];
			/*if (this.state.typeAccessSelected === enumAccessType.APPOINTMENT_MANAGER) {
                if (values.location === undefined && values.provider === undefined) {
                    const errorLocation = {fieldName: 'location', errorMessage: ''};
                    errors = FormUtils.addError(errors, errorLocation);

                    const errorProvider = {fieldName: 'provider', errorMessage: ''};
                    errors = FormUtils.addError(errors, errorProvider);
                }
            }*/
			resolve(errors);
		});
	};

	private save = (values: Store) => {
		let saveOperation = {};

		if (this.props.idQuestionInput) {
			saveOperation = {
				type: "EditEntradaPreguntaOperation",
				idEntradaPregunta: this.props.idQuestionInput,
				nameEtiqueta: values.inputTitle,
				typeEntrada: values.typeInput,
				typeVisualizacion: values.typeDisplay,
				flagObligatorio: values.flagMandatory,
				idValorEntradaObligatorio: values.idInputValueMandatory,
				valueTamanio: values.valueSize,
				idValorEntradaOpcional: values.idInputValueOptional,
				valueEntradas: this.state.data,
			};
		} else {
			saveOperation = {
				type: "NewEntradaPregunta",
				idPregunta: this.props.idQuestion,
				nameEtiqueta: values.inputTitle,
				typeEntrada: values.typeInput,
				typeVisualizacion: values.typeDisplay,
				flagObligatorio: values.flagMandatory,
				idValorEntradaObligatorio: values.idInputValueMandatory,
				valueTamanio: values.valueSize,
				idValorEntradaOpcional: values.idInputValueOptional,
				valueEntradas: this.state.data,
			};
		}
		Rest<{}, {}>()
			.operation(saveOperation)
			.then(() => {
				this.props.onClose();
			});
	};
}

export default withTranslation("questionnaireForm")(QuestionInputFormContainer);

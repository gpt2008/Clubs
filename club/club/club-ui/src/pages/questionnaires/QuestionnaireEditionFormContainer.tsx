import React from "react";

import { FormInstance } from "antd/lib/form";
import { Store } from "antd/lib/form/interface";
import { WithTranslation, withTranslation } from "react-i18next";
import { QuestionnaireFormDataResponse } from "types/entities/Questionnaire";
import FormErrorField from "utils/form/formErrorField";
import { Rest } from "utils/utils";
import View from "./QuestionnaireEditionForm";

interface IProps {
	onClose: (saved: boolean) => void;
	idQuestionnaire?: number;
	visible?: boolean;
}

export interface IState {
	questionnaireData?: QuestionnaireFormDataResponse;
	loaded?: boolean;
	errorFields: FormErrorField[];
}
class QuestionnaireEditionFormContainer extends React.Component<WithTranslation & IProps, IState> {
	public state: IState = {
		loaded: false,
		errorFields: [],
	};

	public componentDidMount() {
		if (this.props.idQuestionnaire) {
			this.loadData();
		} else {
			this.setState({ loaded: true });
		}
	}

	public render() {
		return this.state.loaded ? (
			<View
				{...this.state}
				idQuestionnaire={this.props.idQuestionnaire}
				visible={this.props.visible}
				onCancel={() => this.props.onClose(false)}
				validateAndSave={this.validateAndSave}
			/>
		) : (
			<></>
		);
	}

	private loadData = () => {
		Rest<{ type: string; idCuestionario: number }, QuestionnaireFormDataResponse>()
			.operation({
				type: "GetCuestionarioFormData",
				idCuestionario: this.props.idQuestionnaire!,
			})
			.then((response) => {
				this.setState({
					questionnaireData: response,
					loaded: true,
				});
			});
	};

	private validateAndSave = (form: FormInstance) => {
		form
			.validateFields()
			.then((values) => {
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

	private validate = (values: Store) => {
		return new Promise((resolve: (f: FormErrorField[]) => void) => {
			let errors: FormErrorField[] = [];

			resolve(errors);
		});
	};

	private save = (values: Store) => {
		let saveOperation = {};

		if (this.props.idQuestionnaire) {
			saveOperation = {
				type: "EditCuestionario",
				idCuestionario: this.props.idQuestionnaire,
				typeCuestionario: values.typeQuestionnaire,
				nameCuestionario: values.nameQuestionnaire,
				descMensajeInicial: values.descStartMessage,
				descMensajeFinal: values.descEndMessage,
			};
		} else {
			saveOperation = {
				type: "NewCuestionario",
				nameCuestionario: values.nameQuestionnaire,
				descMensajeInicial: values.descStartMessage,
				descMensajeFinal: values.descEndMessage,
				typeCuestionario: values.typeQuestionnaire,
			};
		}
		Rest<{}, {}>()
			.operation(saveOperation)
			.then(() => {
				this.props.onClose(true);
			});
	};
}

export default withTranslation("questionnaireForm")(QuestionnaireEditionFormContainer);

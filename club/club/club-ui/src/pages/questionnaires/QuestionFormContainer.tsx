import React from "react";

import { FormInstance } from "antd/lib/form";
import { Store } from "antd/lib/form/interface";
import { WithTranslation, withTranslation } from "react-i18next";
import { QuestionData } from "types/entities/Questionnaire";
import FormErrorField from "utils/form/formErrorField";
import { Rest } from "utils/utils";
import View from "./QuestionForm";

interface IProps {
	onClose: () => void;
	idQuestionGroup?: number;
	idQuestion?: number;
	visible?: boolean;
}

export interface IState {
	questionData?: QuestionData;
	loaded?: boolean;
	errorFields: FormErrorField[];
}
class QuestionFormContainer extends React.Component<WithTranslation & IProps, IState> {
	public state: IState = {
		loaded: false,
		errorFields: [],
	};

	public componentDidMount() {
		if (this.props.idQuestion) {
			this.loadData();
		} else {
			this.setState({ loaded: true });
		}
	}

	public render() {
		return this.state.loaded ? (
			<View
				{...this.state}
				idQuestion={this.props.idQuestion}
				visible={this.props.visible}
				onCancel={() => this.props.onClose()}
				validateAndSave={this.validateAndSave}
			/>
		) : (
			<></>
		);
	}

	private loadData = () => {
		Rest<{ type: string; idPregunta: number }, QuestionData>()
			.operation({
				type: "GetPreguntaData",
				idPregunta: this.props.idQuestion!,
			})
			.then((response) => {
				this.setState({
					questionData: response,
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

		if (this.props.idQuestion) {
			saveOperation = {
				type: "EditPregunta",
				idPregunta: this.props.idQuestion,
				namePregunta: values.questionTitle,
			};
		} else {
			saveOperation = {
				type: "NewPregunta",
				idPreguntaGrupo: this.props.idQuestionGroup,
				namePregunta: values.questionTitle,
			};
		}
		Rest<{}, {}>()
			.operation(saveOperation)
			.then(() => {
				this.props.onClose();
			});
	};
}

export default withTranslation("questionnaireForm")(QuestionFormContainer);

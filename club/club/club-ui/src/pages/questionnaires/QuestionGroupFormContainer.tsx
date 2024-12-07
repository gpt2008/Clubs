import React from "react";

import { FormInstance } from "antd/lib/form";
import { Store } from "antd/lib/form/interface";
import { WithTranslation, withTranslation } from "react-i18next";
import { QuestionGroupData } from "types/entities/Questionnaire";
import FormErrorField from "utils/form/formErrorField";
import { Rest } from "utils/utils";
import View from "./QuestionGroupForm";

interface IProps {
	onClose: () => void;
	idQuestionGroup?: number;
	idQuestionnaire?: number;
	visible?: boolean;
}

export interface IState {
	questionGroupData?: QuestionGroupData;
	loaded?: boolean;
	errorFields: FormErrorField[];
}
class QuestionGroupFormContainer extends React.Component<WithTranslation & IProps, IState> {
	public state: IState = {
		loaded: false,
		errorFields: [],
	};

	public componentDidMount() {
		if (this.props.idQuestionGroup) {
			this.loadData();
		} else {
			this.setState({ loaded: true });
		}
	}

	public render() {
		return this.state.loaded ? (
			<View
				{...this.state}
				idQuestionGroup={this.props.idQuestionGroup}
				visible={this.props.visible}
				onCancel={() => this.props.onClose()}
				validateAndSave={this.validateAndSave}
			/>
		) : (
			<></>
		);
	}

	private loadData = () => {
		Rest<{ type: string; idPreguntaGrupo: number }, QuestionGroupData>()
			.operation({
				type: "GetCuestionarioPreguntaGrupoData",
				idPreguntaGrupo: this.props.idQuestionGroup!,
			})
			.then((response) => {
				this.setState({
					questionGroupData: response,
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

		if (this.props.idQuestionGroup) {
			saveOperation = {
				type: "EditCuestionarioPreguntaGrupo",
				idPreguntaGrupo: this.props.idQuestionGroup,
				nameGrupo: values.questionGroupTitle,
				valueTiempoEstimado: values.timeToComplete,
				valueUnidadTiempoEstimado: values.timeUnits,
			};
		} else {
			saveOperation = {
				type: "NewCuestionarioPreguntaGrupo",
				idCuestionario: this.props.idQuestionnaire,
				namePreguntaGrupo: values.questionGroupTitle,
				valueTiempoEstimado: values.timeToComplete,
				valueUnidadTiempoEstimado: values.timeUnits,
			};
		}
		Rest<{}, {}>()
			.operation(saveOperation)
			.then(() => {
				this.props.onClose();
			});
	};
}

export default withTranslation("questionnaireForm")(QuestionGroupFormContainer);

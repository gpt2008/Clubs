import React from "react";

import View from "components/questionnairePreview/QuestionnaireAnswerContainer";
import { WithTranslation, withTranslation } from "react-i18next";
import { QuestionGroupData, QuestionnaireFormDataResponse } from "types/entities/Questionnaire";
import { Rest } from "utils/utils";

interface IProps {
	idQuestionnaire: number;
	onCloseModal?: () => void;
}

export interface IState {
	loaded?: boolean;
	step: number;
	answers: any[];
	groups: QuestionGroupData[];
	nameQuestionnaire?: string;
	startMessage?: string;
	endMessage?: string;
}
class QuestionnaireContainer extends React.Component<WithTranslation & IProps, IState> {
	public state: IState = {
		loaded: false,
		answers: [],
		step: 0,
		groups: [],
	};

	public componentDidMount() {
		this.loadData();
	}

	public render() {
		return this.state.loaded ? (
			<View
				groups={this.state.groups}
				idQuestionnaire={this.props.idQuestionnaire}
				//{...this.state}
				//{...this.props}
				//onNextStep={this.onNextStep}
				//onBackStep={this.onBackStep}
			/>
		) : (
			<></>
		);
	}

	private loadData = () => {
		const final: QuestionGroupData = {
			idPreguntaGrupo: 0,
			idCuestionario: 0,
			nameGrupo: "",
			valueOrder: 0,
			valueTiempoEstimado: 0,
			valueUnidadTiempoEstimado: 0,
			dateCreation: new Date(),
		};
		Rest<{ type: string; idCuestionario: number }, QuestionnaireFormDataResponse>()
			.operation({
				type: "GetCuestionarioFormData",
				idCuestionario: this.props.idQuestionnaire!,
			})
			.then((response) => {
				this.setState({
					nameQuestionnaire: response.nameCuestionario,
					startMessage: response.descMensajeInicial,
					endMessage: response.descMensajeFinal,
				});
				Rest<{ type: string; idCuestionario: number }, QuestionGroupData[]>()
					.operation({
						type: "SelectCuestionarioPreguntaGrupoByIdCuestionario",
						idCuestionario: this.props.idQuestionnaire!,
					})
					.then((response) => {
						this.setState({ groups: response.concat(final), loaded: true });
					});
			});
	};

	private onNextStep = (newAnswers?: any[]) => {
		this.setState({
			step: this.state.step! + 1,
			answers: newAnswers ? { ...this.state.answers, ...newAnswers } : { ...this.state.answers },
		});
	};

	private onBackStep = () => {
		this.setState({ step: this.state.step! - 1 });
	};
}

export default withTranslation("questionnaire")(QuestionnaireContainer);

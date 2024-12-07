import React, { Key } from "react";
import { withTranslation } from "react-i18next";
import { QuestionData, QuestionGroupData, QuestionInputData } from "types/entities/Questionnaire";
import valueData from "types/entities/valueData";
import { Rest } from "utils/utils";
import View from "./QuestionnaireTree";

interface IProps {
	visible?: boolean;
	onClose: () => void;
	idQuestionnaire?: number;
	nameQuestionnaire?: string;
	onClickEditQuestionGroup: (idQuestionGroup?: number) => void;
	onClickAddQuestion: (idQuestionGroup?: number) => void;
	onClickEditQuestion: (idQuestion?: number) => void;
	onClickAddQuestionInput: (idQuestion?: number) => void;
	onClickEditQuestionInput: (idQuestionInput?: number, idQuestion?: number) => void;
	onClickPreview: () => void;
}
export enum MoveQuestionGroup {
	UP = -1,
	DOWN = 1,
}

export interface TreeContainerState {
	loaded?: boolean;
	nameQuestionnaire?: string;
	visible?: boolean;
	onClickEditQuestionGroup?: (idQuestionGroup?: number) => void;
	questionnaireToEdit?: number;
	questionnaireTreeData?: QuestionnaireTreeData[];
	selectedKeys?: Key[];
}
export type QuestionnaireTreeData = {
	key: string;
	id: number;
	title: string;
	type: string;
	children?: QuestionsTree[];
	allowUp?: boolean;
	allowDown?: boolean;
};
export type QuestionsTree = {
	key: string;
	id: number;
	title: string;
	type: string;
	children?: InputsTree[];
	allowUp?: boolean;
	allowDown?: boolean;
};
export type InputsTree = {
	key: string;
	id: number;
	idQuestion: number;
	typeInput: number;
	valueOrder: number;
	title: string;
	type: string;
	nameLabel?: string;
	values?: string[];
	allowUp?: boolean;
	allowDown?: boolean;
};

class QuestionnaireTreeContainer extends React.Component<IProps & TreeContainerState> {
	public state: TreeContainerState = {
		loaded: false,
		questionnaireTreeData: [],
	};

	public componentDidMount() {
		if (this.props.visible) {
			this.loadData();
		}
	}
	public render() {
		return this.state.loaded ? (
			<>
				<View
					newQuestionGroup={this.props.onClickEditQuestionGroup}
					editQuestionGroup={this.props.onClickEditQuestionGroup}
					newQuestion={this.props.onClickAddQuestion}
					editQuestion={this.props.onClickEditQuestion}
					newQuestionInput={this.props.onClickAddQuestionInput}
					editQuestionInput={this.props.onClickEditQuestionInput}
					deleteQuestionGroup={this.deleteQuestionGroup}
					deleteQuestion={this.deleteQuestion}
					deleteQuestionInput={this.deleteQuestionInput}
					moveQuestionGroup={this.moveQuestionGroup}
					moveQuestion={this.moveQuestion}
					moveQuestionInput={this.moveQuestionInput}
					{...this.props}
					{...this.state}
				/>
			</>
		) : (
			<></>
		);
	}

	private moveQuestionGroup = (idQuestionGroup: number, direction: MoveQuestionGroup) => {
		Rest<
			{
				type: string;
				idPreguntaGrupo: number;
				idCuestionario: number;
				direccion: MoveQuestionGroup;
			},
			void
		>()
			.operation({
				type: "MoveCuestionarioPreguntaGrupo",
				idPreguntaGrupo: idQuestionGroup,
				idCuestionario: this.props.idQuestionnaire!,
				direccion: direction,
			})
			.then(() => {
				this.setState({ loaded: false, questionnaireTreeData: [] }, () => this.loadData());
			});
	};

	private moveQuestion = (idQuestion: number, direction: MoveQuestionGroup) => {
		Rest<{ type: string; idPregunta: number; direccion: MoveQuestionGroup }, void>()
			.operation({
				type: "MovePregunta",
				idPregunta: idQuestion,
				direccion: direction,
			})
			.then(() => {
				this.setState({ loaded: false, questionnaireTreeData: [] }, () => this.loadData());
			});
	};

	private moveQuestionInput = (idQuestionInput: number, direction: MoveQuestionGroup) => {
		Rest<{ type: string; idEntradaPregunta: number; direccion: MoveQuestionGroup }, void>()
			.operation({
				type: "MoveEntradaPregunta",
				idEntradaPregunta: idQuestionInput,
				direccion: direction,
			})
			.then(() => {
				this.setState({ loaded: false, questionnaireTreeData: [] }, () => this.loadData());
			});
	};

	private deleteQuestionGroup = (idQuestionGroup: number) => {
		Rest<{ type: string; idPreguntaGrupo: number; idCuestionario: number }, void>()
			.operation({
				type: "DeleteCuestionarioPreguntaGrupoWithOrder",
				idPreguntaGrupo: idQuestionGroup,
				idCuestionario: this.props.idQuestionnaire!,
			})
			.then(() => {
				this.setState({ loaded: false, questionnaireTreeData: [] }, () => this.loadData());
			});
	};
	private deleteQuestion = (idQuestion: number) => {
		Rest<{ type: string; idPregunta: number }, void>()
			.operation({
				type: "DeletePreguntaWithOrder",
				idPregunta: idQuestion,
			})
			.then(() => {
				this.setState({ loaded: false, questionnaireTreeData: [] }, () => this.loadData());
			});
	};
	private deleteQuestionInput = (idQuestionInput: number) => {
		Rest<{ type: string; idEntradaPregunta: number }, void>()
			.operation({
				type: "DeleteEntradaPreguntaWithOrder",
				idEntradaPregunta: idQuestionInput,
			})
			.then(() => {
				this.setState({ loaded: false, questionnaireTreeData: [] }, () => this.loadData());
			});
	};
	private loadData = () => {
		const listOfGroups: any[] = [];
		const listOfInputs: any[] = [];
		const listOfValues: any[] = [];
		Rest<{ type: string; idCuestionario: number }, QuestionGroupData[]>()
			.operation({
				type: "SelectCuestionarioPreguntaGrupoByIdCuestionario",
				idCuestionario: this.props.idQuestionnaire!,
			})
			.then((response) => {
				response.map((group) => {
					listOfGroups.push({
						idQuestionGroup: group.idPreguntaGrupo,
						nameGroup: group.nameGrupo,
						valueOrder: group.valueOrder,
					});
				});
				Rest<{ type: string; idCuestionario: number }, QuestionInputData[]>()
					.operation({
						type: "SelectCuestionarioEntradaPreguntaByCuestionario",
						idCuestionario: this.props.idQuestionnaire!,
					})
					.then((response) => {
						response.map((input) => {
							listOfInputs.push({
								idQuestionInput: input.idEntradaPregunta,
								idQuestion: input.idPregunta,
								typeInput: input.typeEntrada,
								nameLabel: input.nameEtiqueta,
								valueOrder: input.valueOrder,
							});
						});
						Rest<{ type: string; idCuestionario: number }, valueData[]>()
							.operation({
								type: "SelectValorEntradaPreguntaByCuestionario",
								idCuestionario: this.props.idQuestionnaire!,
							})
							.then((response) => {
								response.map((value) => {
									listOfValues.push({
										idQuestionInput: value.idEntradaPregunta,
										idInputValue: value.idValorEntrada,
										nameValue: value.nameValor,
										valueOrder: value.valueOrder,
										dateOfDeletion: value.dateDeletion,
									});
								});
								Rest<{ type: string; idCuestionario: number }, QuestionData[]>()
									.operation({
										type: "SelectListOfPreguntas",
										idCuestionario: this.props.idQuestionnaire!,
									})
									.then((response) => {
										listOfGroups.map((group) => {
											const children: QuestionsTree[] = [];
											const listOfQuestions: any[] = [];

											response.map((q) => {
												if (group.idQuestionGroup == q.idPreguntaGrupo) {
													listOfQuestions.push({
														idQuestion: q.idPregunta,
														idQuestionGroup: q.idPreguntaGrupo,
														nameQuestion: q.namePregunta,
														valueOrder: q.valueOrder,
													});
												}
											});

											listOfQuestions.map((q) => {
												const childrenInputs: InputsTree[] = [];
												const question: QuestionsTree = { key: "", id: 0, title: "", type: "" };
												const listOfInputsByQuestion: any[] = [];

												listOfInputs.map((i) => {
													if (q.idQuestion == i.idQuestion) {
														listOfInputsByQuestion.push(i);
													}
												});

												listOfInputsByQuestion.map((i) => {
													const input: InputsTree = {
														key: "",
														id: 0,
														idQuestion: 0,
														title: "",
														type: "",
														typeInput: 0,
														valueOrder: 0,
													};

													input.key = "i" + i.idQuestionInput;
													input.id = i.idQuestionInput;
													input.idQuestion = i.idQuestion;
													input.valueOrder = i.valueOrder;
													if (i.nameLabel) {
														input.nameLabel = i.nameLabel;
													}
													if (i.values) {
														input.values = i.values;
													}
													input.title =
														"" +
														listOfValues
															.filter((v) => {
																if (
																	v.idQuestionInput == i.idQuestionInput &&
																	v.dateOfDeletion == undefined
																) {
																	return v;
																}
															})
															.map((val) => {
																return " '" + val.nameValue + "'";
															});
													input.type = "input";
													input.typeInput = i.typeInput;

													if (i.valueOrder != 1) {
														input.allowUp = true;
													}
													if (i.valueOrder != listOfInputsByQuestion.length) {
														input.allowDown = true;
													}
													childrenInputs.push(input);
												});

												question.children = childrenInputs;
												question.key = "q" + q.idQuestion;
												question.id = q.idQuestion;
												question.type = "Question";
												question.title = q.nameQuestion;

												if (q.valueOrder != 1) {
													question.allowUp = true;
												}
												if (q.valueOrder != listOfQuestions.length) {
													question.allowDown = true;
												}
												children.push(question);
											});
											const groups: QuestionnaireTreeData = { key: "", id: 0, title: "", type: "" };
											groups.key = "qn" + group.idQuestionGroup;
											groups.id = group.idQuestionGroup;
											groups.type = "Section";
											groups.title = group.nameGroup;

											if (group.valueOrder != 1) {
												groups.allowUp = true;
											}
											if (group.valueOrder != listOfGroups.length) {
												groups.allowDown = true;
											}
											groups.children = children;
											this.setState({
												questionnaireTreeData: [...this.state.questionnaireTreeData!, groups],
											});
										});
										this.setState({ loaded: true });
									});
							});
					});
			});
	};
}
export default withTranslation("questionnaireForm")(QuestionnaireTreeContainer);

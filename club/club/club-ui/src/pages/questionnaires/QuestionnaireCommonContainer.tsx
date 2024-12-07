import { Modal } from "antd";
import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import QuestionFormContainer from "./QuestionFormContainer";
import QuestionGroupFormContainer from "./QuestionGroupFormContainer";
import QuestionInputFormContainer from "./QuestionInputFormContainer";
import QuestionnaireContainer from "./QuestionnaireContainer";
import QuestionnaireTreeContainer from "./QuestionnaireTreeContainer";

interface IProps {
	visible?: boolean;
	onClose: () => void;
	idQuestionnaire?: number;
	nameQuestionnaire?: string;
}

export interface ContainerState {
	onClose: () => void;
	loaded?: boolean;
	loadedQuestion?: boolean;
	loadedInput?: boolean;
	loadedPreview?: boolean;
	nameQuestionnaire?: string;
	QuestionnaireTreeVisible?: boolean;
	QuestionGroupFormVisible?: boolean;
	QuestionFormVisible?: boolean;
	QuestionInputFormVisible?: boolean;
	idQuestionGroupSelected?: number;
	idQuestionSelected?: number;
	idQuestionInputSelected?: number;
}

class QuestionnaireCommonContainer extends React.Component<
	WithTranslation & IProps & ContainerState
> {
	public state: ContainerState = {
		onClose: this.props.onClose,
	};
	componentDidMount = () => {
		this.setState({
			nameQuestionnaire: this.props.nameQuestionnaire,
			QuestionnaireTreeVisible: true,
		});
	};
	render = () => {
		return (
			<>
				{this.state.QuestionnaireTreeVisible && (
					<QuestionnaireTreeContainer
						{...this.props}
						onClickEditQuestionGroup={this.onClickEditQuestionGroup}
						onClickAddQuestion={this.onClickAddQuestion}
						onClickEditQuestion={this.onClickEditQuestion}
						onClickAddQuestionInput={this.onClickAddQuestionInput}
						onClickEditQuestionInput={this.onClickEditQuestionInput}
						onClickPreview={this.onClickPreview}
					/>
				)}
				{this.state.loaded ? (
					<QuestionGroupFormContainer
						onClose={this.onCloseGroupFormContainer}
						visible={this.state.QuestionGroupFormVisible}
						idQuestionGroup={this.state.idQuestionGroupSelected}
						idQuestionnaire={this.props.idQuestionnaire}
					/>
				) : (
					<></>
				)}
				{this.state.loadedQuestion ? (
					<QuestionFormContainer
						onClose={this.onCloseQuestionFormContainer}
						visible={this.state.QuestionFormVisible}
						idQuestionGroup={this.state.idQuestionGroupSelected}
						idQuestion={this.state.idQuestionSelected}
					/>
				) : (
					<></>
				)}
				{this.state.loadedInput ? (
					<QuestionInputFormContainer
						onClose={this.onCloseQuestionInputFormContainer}
						visible={this.state.QuestionInputFormVisible}
						idQuestion={this.state.idQuestionSelected}
						idQuestionInput={this.state.idQuestionInputSelected}
					/>
				) : (
					<></>
				)}
				{this.state.loadedPreview ? (
					<Modal
						title={null}
						destroyOnClose
						width="850px"
						visible={this.state.loadedPreview}
						onCancel={this.onClosePreview}
						style={{ top: "40px" }}
						footer={null}>
						<QuestionnaireContainer
							idQuestionnaire={this.props.idQuestionnaire!}
							onCloseModal={this.onCloseModal}
						/>
					</Modal>
				) : (
					<></>
				)}
			</>
		);
	};

	private onCloseModal = () => {
		this.setState({
			loadedPreview: false,
		});
	};

	private onClickEditQuestionGroup = (idQuestionGroup?: number) => {
		this.setState({
			idQuestionGroupSelected: idQuestionGroup,
			QuestionnaireTreeVisible: undefined,
			QuestionGroupFormVisible: true,
			loaded: true,
		});
	};

	private onClickAddQuestion = (idQuestionGroup?: number) => {
		this.setState({
			idQuestionGroupSelected: idQuestionGroup,
			idQuestionSelected: undefined,
			QuestionnaireTreeVisible: undefined,
			QuestionFormVisible: true,
			loadedQuestion: true,
		});
	};

	private onClickEditQuestion = (idQuestion?: number) => {
		this.setState({
			idQuestionSelected: idQuestion,
			QuestionnaireTreeVisible: undefined,
			QuestionFormVisible: true,
			loadedQuestion: true,
		});
	};

	private onClickAddQuestionInput = (idQuestion?: number) => {
		this.setState({
			idQuestionSelected: idQuestion,
			idQuestionInputSelected: undefined,
			QuestionnaireTreeVisible: undefined,
			QuestionInputFormVisible: true,
			loadedInput: true,
		});
	};

	private onClickEditQuestionInput = (idQuestionInput?: number, idQuestion?: number) => {
		this.setState({
			idQuestionSelected: idQuestion,
			idQuestionInputSelected: idQuestionInput,
			QuestionnaireTreeVisible: undefined,
			QuestionInputFormVisible: true,
			loadedInput: true,
		});
	};

	private onCloseGroupFormContainer = () => {
		this.setState({
			QuestionGroupFormVisible: false,
			QuestionnaireTreeVisible: true,
			loaded: false,
		});
	};

	private onCloseQuestionFormContainer = () => {
		this.setState({
			QuestionFormVisible: false,
			QuestionnaireTreeVisible: true,
			loadedQuestion: false,
		});
	};

	private onCloseQuestionInputFormContainer = () => {
		this.setState({
			QuestionInputFormVisible: false,
			QuestionnaireTreeVisible: true,
			loadedInput: false,
		});
	};

	private onClickPreview = () => {
		this.setState({ QuestionnaireTreeVisible: undefined, loadedPreview: true });
	};

	private onClosePreview = () => {
		this.setState({ loadedPreview: undefined, QuestionnaireTreeVisible: true, loaded: true });
	};
}
export default withTranslation("questionnaireForm")(QuestionnaireCommonContainer);

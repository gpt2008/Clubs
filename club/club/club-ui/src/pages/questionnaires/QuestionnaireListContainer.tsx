import { FormInstance } from "antd";
import _ from "lodash";
import React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { QuestionnaireData } from "types/entities/Questionnaire";
import EventHub, { Event } from "utils/eventHub";
import { MainTableBodyProps } from "utils/tableUtils";
import { Rest, TableUtils } from "utils/utils";
import QuestionnaireCommonContainer from "./QuestionnaireCommonContainer";
import QuestionnaireEditionFormContainer from "./QuestionnaireEditionFormContainer";
import View from "./QuestionnaireList";
import QuestionnaireRemoveConfirmation from "./QuestionnaireRemoveConfirmation";

interface IProps {
	limit?: number;
	page?: number;
}

export interface IState extends MainTableBodyProps {
	questionnaireList?: QuestionnaireData[];
	limit: number;
	page?: number;
	offset?: number;
	dataCount?: number;
	filtersCollapsed?: boolean;
	lastFilter?: any;
	loaded: boolean;
	filterKey?: number;
	highlightQuestionnaireName?: string;
	questionnaireNameFilter?: { value: string }[];
	idQuestionnaireSelected?: number;
	nameQuestionnaireSelected?: string;
	editQuestionnaireVisible?: boolean;
	removeQuestionnaireVisible?: boolean;
	editQuestionnaireKey?: number;
	removeQuestionnaireKey?: number;

	commonQuestionnaireKey?: number;
	commonQuestionnaireVisible?: boolean;
}

class QuestionnaireListContainer extends React.Component<IProps & WithTranslation, IState> {
	public state: IState = {
		loaded: false,
		limit: 0,
		offset: 0,
		filtersCollapsed: true,
	};

	private eventRef?: string;

	public componentDidMount() {
		this.eventRef = EventHub.on(Event.SELECTED_ORGANIZATION_CHANGED, () => {
			this.loadData();
		});
		this.setState(TableUtils.calculatePageSizeForMainTable(), () => this.loadData());
	}

	public componentWillUnmount() {
		if (this.eventRef) {
			EventHub.off(this.eventRef);
		}
	}

	private onCollapseFilters = () => {
		this.setState({ filtersCollapsed: !this.state.filtersCollapsed });
	};

	private applyFilters = (form: FormInstance) => {
		const values = form.getFieldsValue();
		this.setState({ lastFilter: values, filtersCollapsed: true }, () => this.loadData(1));
	};

	private resetFilters = () => {
		this.setState({ page: 1, lastFilter: undefined, filterKey: new Date().getTime() }, () =>
			this.loadData()
		);
	};

	private searchQuestionnaireName = _.debounce(
		(value: string) => this.doSearchQuestionnaireName(value),
		500
	);

	private doSearchQuestionnaireName(value: string) {
		if (value.length < 3) {
			return;
		}
	}

	private onChangePage = (page: number) => {
		this.loadData(page);
	};

	private onClickEditQuestionnaire = (id?: number) => {
		this.setState({
			idQuestionnaireSelected: id,
			editQuestionnaireVisible: true,
			editQuestionnaireKey: new Date().getTime(),
		});
	};

	private onCloseEditQuestionnaire = (save: boolean) => {
		this.setState(
			{ idQuestionnaireSelected: undefined, editQuestionnaireVisible: false },
			() => save && this.loadData()
		);
	};

	public render() {
		return (
			this.state.loaded && (
				<>
					<View
						{...this.state}
						onCollapseFilters={this.onCollapseFilters}
						applyFilters={this.applyFilters}
						resetFilters={this.resetFilters}
						searchQuestionnaireName={this.searchQuestionnaireName}
						onChangePage={this.onChangePage}
						onClickRefresh={this.refresh}
						onClickEditQuestionnaire={this.onClickEditQuestionnaire}
						onClickRemoveQuestionnaire={this.onClickRemoveQuestionnaire}
						onClickEditQuestions={this.onClickEditQuestions}
					/>

					<QuestionnaireEditionFormContainer
						key={this.state.editQuestionnaireKey}
						visible={this.state.editQuestionnaireVisible}
						onClose={this.onCloseEditQuestionnaire}
						idQuestionnaire={this.state.idQuestionnaireSelected}
					/>

					<QuestionnaireRemoveConfirmation
						key={this.state.removeQuestionnaireKey}
						nameQuestionnaire={this.state.nameQuestionnaireSelected}
						visible={this.state.removeQuestionnaireVisible}
						onClose={this.onCloseRemoveQuestionnaire}
						removeQuestionnaire={this.removeQuestionnaire}
					/>

					<QuestionnaireCommonContainer
						key={this.state.commonQuestionnaireKey}
						idQuestionnaire={this.state.idQuestionnaireSelected}
						nameQuestionnaire={this.state.nameQuestionnaireSelected}
						visible={this.state.commonQuestionnaireVisible}
						onClose={this.onCloseEditQuestions}
					/>
				</>
			)
		);
	}

	private loadData = (page?: number) => {
		const values = this.state.lastFilter;
		const filter = {} as any;

		if (values) {
			filter.nameCuestionario = values.questionnaireName ? values.questionnaireName : undefined;
		}

		Rest<{ type: string; limit: number; offset: number }, any>()
			.operation({
				type: "SelectListaCuestionario",
				limit: 10,
				offset: page ? ((page || 1) - 1) * this.state.limit : 0,
				...filter,
			})
			.then((response) => {
				this.setState({
					questionnaireList: response.data || [],
					dataCount: response.dataCount || 0,
					lastFilter: values,
					highlightQuestionnaireName:
						values && values.questionnaireName ? values.questionnaireName : undefined,
					page: page || 1,
					loaded: true,
					limit: response.limit,
					offset: response.offset,
				});
			});
	};

	private removeQuestionnaire = () => {
		Rest<{ type: string; idCuestionario: number }, any>()
			.operation({
				type: "DeleteCuestionario",
				idCuestionario: this.state.idQuestionnaireSelected!,
			})
			.then(() => {
				this.onCloseRemoveQuestionnaire(true);
			});
	};
	private refresh = () => {
		this.loadData();
	};

	private onClickRemoveQuestionnaire = (idQuestionnaire: number, nameQuestionnaire: string) => {
		this.setState({
			idQuestionnaireSelected: idQuestionnaire,
			nameQuestionnaireSelected: nameQuestionnaire,
			removeQuestionnaireVisible: true,
			removeQuestionnaireKey: new Date().getTime(),
		});
	};

	private onCloseRemoveQuestionnaire = (save: boolean) => {
		this.setState(
			{
				idQuestionnaireSelected: undefined,
				nameQuestionnaireSelected: undefined,
				removeQuestionnaireVisible: false,
			},
			() => save && this.loadData()
		);
	};

	private onClickEditQuestions = (idQuestionnaire: number, nameQuestionnaire: string) => {
		this.setState({
			idQuestionnaireSelected: idQuestionnaire,
			nameQuestionnaireSelected: nameQuestionnaire,
			commonQuestionnaireVisible: true,
			commonQuestionnaireKey: new Date().getTime(),
		});
	};

	private onCloseEditQuestions = () => {
		this.setState(
			{
				idQuestionnaireSelected: undefined,
				nameQuestionnaireSelected: undefined,
				commonQuestionnaireVisible: false,
			},
			() => this.loadData()
		);
	};
}

export default withTranslation("questionnaireList")(QuestionnaireListContainer);

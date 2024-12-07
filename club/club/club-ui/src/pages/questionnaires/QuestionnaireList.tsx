import { Button, Drawer, Space, Table, Tooltip } from "antd";
import { FormInstance } from "antd/lib/form";
import { AlignType } from "rc-table/lib/interface";
import Highlighter from "react-highlight-words";
import { useTranslation } from "react-i18next";
import { Functions, TableIcons } from "utils/utils";
import { IState as IStateContainer } from "./QuestionnaireListContainer";
import QuestionnaireListFilters from "./QuestionnaireListFilters";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PageOptions from "comps/PageOptions";

interface IProps {
	onCollapseFilters: () => void;
	searchQuestionnaireName: (value: string) => void;
	applyFilters: (form: FormInstance) => void;
	resetFilters: () => void;
	onChangePage: (page: number) => void;
	onClickEditQuestionnaire: (id?: number) => void;
	onClickRefresh: () => void;
	onClickRemoveQuestionnaire: (idQuestionnaire: number, nameQuestionnaire: string) => void;
	onClickEditQuestions: (idQuestionnaire: number, nameQuestionnaire: string) => void;
}

const QuestionnaireList = (props: IProps & IStateContainer) => {
	const { t } = useTranslation(["questionnaireList"]);

	const appNoAppointment = { color: "gray", fontStyle: "italic" };

	const columns = [
		{
			title: t("questionnaireName"),
			dataIndex: "nameCuestionario",
			ellipsis: true,
			align: "left" as AlignType,
			render: (nameCuestionario: string) => {
				return props.highlightQuestionnaireName ? (
					<Highlighter
						highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
						searchWords={[props.highlightQuestionnaireName]}
						autoEscape
						textToHighlight={nameCuestionario}
					/>
				) : (
					nameCuestionario
				);
			},
		},
		{
			title: t("questionnaireTypeField"),
			dataIndex: "typeCuestionario",
			ellipsis: true,
			align: "center" as AlignType,
			render: (typeCuestionario: number) => {
				return t("questionnaireType:" + typeCuestionario);
			},
		},

		{
			title: t("dateCreation"),
			dataIndex: "dateCreation",
			ellipsis: true,
			align: "center" as AlignType,
			render: (dateCreation: Date) => {
				return dateCreation && Functions.dateToString(dateCreation);
			},
		},

		{
			title: t("questions"),
			dataIndex: "numberPreguntas",
			ellipsis: true,
			align: "center" as AlignType,
		},
		{
			title: "",
			dataIndex: "idCuestionario",
			width: "9rem",
			render: (value: any, record: any) => {
				return (
					<Space size="small">
						<Tooltip title={t("questionnaireEditionButton")}>
							<Button
								type="primary"
								icon={TableIcons.getTableIcon(TableIcons.TableIcon.edit)}
								onClick={() => props.onClickEditQuestionnaire(record.idCuestionario)}
							/>
						</Tooltip>
						<Tooltip title={t("questionnaireQuestionsEditionButton")}>
							<Button
								type="primary"
								icon={TableIcons.getTableIcon(TableIcons.TableIcon.cmbd)}
								onClick={() =>
									props.onClickEditQuestions(record.idCuestionario, record.nameCuestionario)
								}
							/>
						</Tooltip>
						<Tooltip title={t("questionnaireDeleteButton")}>
							<Button
								type="primary"
								icon={TableIcons.getTableIcon(TableIcons.TableIcon.trash)}
								danger
								onClick={() =>
									props.onClickRemoveQuestionnaire(record.idCuestionario, record.nameCuestionario)
								}
							/>
						</Tooltip>
					</Space>
				);
			},
		},
	];

	return (
		<>
			{" "}
			<div className="listado_container">
				<Drawer
					className="filters-drawer"
					visible={!props.filtersCollapsed}
					onClose={props.onCollapseFilters}
					width="300px"
					placement="left"
					getContainer={false}>
					<QuestionnaireListFilters {...props} key={props.filterKey} />
				</Drawer>
				<PageOptions title={t("questionnaireTitle")} />
				<div className="table-container">
					<div className="table-container__header">
							<Space size="small" className="table-button-bar">
								<Tooltip title={t("filters")}>
									<Button
										type={props.filtersCollapsed ? "primary" : "default"}
										icon={TableIcons.getTableIcon(TableIcons.TableIcon.filter)}
										onClick={props.onCollapseFilters}
									/>
								</Tooltip>
								<Tooltip title={t("reload")}>
									<Button
										type="primary"
										onClick={() => props.onClickRefresh()}
										icon={TableIcons.getTableIcon(TableIcons.TableIcon.reload)}
									/>
								</Tooltip>
								<Tooltip title={t("newQuestionnaire")}>
									<Button
										type="primary"
										onClick={() => props.onClickEditQuestionnaire()}
										icon={TableIcons.getTableIcon(TableIcons.TableIcon.plus)}>
										&nbsp;&nbsp;{t("newQuestionnaire")}
									</Button>
								</Tooltip>
							</Space>
					</div>
					<Table
						columns={columns}
						size="small"
						dataSource={props.questionnaireList}
						pagination={{
							position: ["bottomCenter"],
							hideOnSinglePage: true,
							showSizeChanger: false,
							current: props.page,
							pageSize: props.limit,
							total: props.dataCount,
							onChange: props.onChangePage,
						}}
					/>
				</div>
			</div>
		</>
	);
};

export default QuestionnaireList;

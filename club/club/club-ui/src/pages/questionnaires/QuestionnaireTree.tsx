import {
	faEye,
	faLongArrowAltDown,
	faLongArrowAltUp,
	faPencilAlt,
	faPlus,
	faPlusCircle,
	faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Col, Modal, Popconfirm, Row, Tooltip, Tree } from "antd";
import cx from "classnames";
import React, { Key, useRef } from "react";
import { useTranslation, withTranslation } from "react-i18next";
import { MoveQuestionGroup, QuestionnaireTreeData } from "./QuestionnaireTreeContainer";

interface IProps {
	onClose: () => void;
	loaded?: boolean;
	nameQuestionnaire?: string;
	visible?: boolean;
	onClickEditQuestionGroup: (idQuestionGroup?: number) => void;
	questionnaireToEdit?: number;
	selectedKeys?: Key[];
	newQuestionGroup: (idQuestionGroup?: number) => void;
	editQuestionGroup: (idQuestionGroup: number) => void;
	deleteQuestionGroup: (idQuestionGroup: number) => void;
	moveQuestionGroup: (idQuestionGroup: number, direction: MoveQuestionGroup) => void;
	moveQuestion: (idQuestion: number, direction: MoveQuestionGroup) => void;
	questionnaireTreeData?: QuestionnaireTreeData[];
	newQuestion: (idQuestionGroup?: number) => void;
	editQuestion: (idQuestion: number) => void;
	deleteQuestion: (idQuestion: number) => void;
	newQuestionInput: (idQuestion?: number) => void;
	editQuestionInput: (idQuestionInput: number, idQuestion: number) => void;
	moveQuestionInput: (idQuestionInput: number, direction: MoveQuestionGroup) => void;
	deleteQuestionInput: (idQuestionInput: number) => void;
	onClickPreview: () => void;
}

class QuestionnaireTree extends React.Component<IProps> {
	public render() {
		return (
			<>
				<Modal
					title={this.props.nameQuestionnaire}
					destroyOnClose
					width="850px"
					visible={this.props.visible}
					onCancel={() => this.props.onClose()}
					style={{ top: "40px" }}
					footer={null}>
					<QuestionnaireTreeForm
						editQuestionGroup={this.props.editQuestionGroup}
						deleteQuestionGroup={this.props.deleteQuestionGroup}
						moveQuestionGroup={this.props.moveQuestionGroup}
						moveQuestion={this.props.moveQuestion}
						moveQuestionInput={this.props.moveQuestionInput}
						newQuestion={this.props.newQuestion}
						editQuestion={this.props.editQuestion}
						newQuestionInput={this.props.newQuestionInput}
						editQuestionInput={this.props.editQuestionInput}
						deleteQuestion={this.props.deleteQuestion}
						deleteQuestionInput={this.props.deleteQuestionInput}
						onClose={this.props.onClose}
						newQuestionGroup={this.props.newQuestionGroup}
						onClickEditQuestionGroup={this.props.onClickEditQuestionGroup}
						onClickPreview={this.props.onClickPreview}
						questionnaireTreeData={this.props.questionnaireTreeData}
					/>
				</Modal>
			</>
		);
	}
}
export default withTranslation("questionnaireForm")(QuestionnaireTree);

const QuestionnaireTreeForm = (props: IProps) => {
	const { t } = useTranslation("questionnaireTree");
	const treeRef = useRef(null);
	const renderTools = (row: any) => {
		if (row.type == "Section") {
			return (
				<>
					<FontAwesomeIcon
						icon={faPencilAlt}
						onClick={(e) => {
							e.stopPropagation();
							props.editQuestionGroup(row.id);
						}}
					/>
					<Popconfirm
						title={t("deleteConfirmation")}
						onConfirm={() => props.deleteQuestionGroup(row.id)}
						okText={t("buttons:yes")}
						cancelText={t("buttons:no")}>
						<FontAwesomeIcon icon={faTrashAlt} />
					</Popconfirm>
					<FontAwesomeIcon
						icon={faLongArrowAltUp}
						className={cx("icon-alt", { disabled: !row.allowUp })}
						onClick={() => row.allowUp && props.moveQuestionGroup(row.id, MoveQuestionGroup.UP)}
					/>
					<FontAwesomeIcon
						icon={faLongArrowAltDown}
						className={cx("icon-alt", { disabled: !row.allowDown })}
						onClick={() => row.allowDown && props.moveQuestionGroup(row.id, MoveQuestionGroup.DOWN)}
					/>
					<FontAwesomeIcon
						icon={faPlusCircle}
						onClick={(e) => {
							e.stopPropagation();
							props.newQuestion(row.id);
						}}
					/>
				</>
			);
		} else if (row.type == "Question") {
			return (
				<>
					<FontAwesomeIcon
						icon={faPencilAlt}
						onClick={(e) => {
							e.stopPropagation();
							props.editQuestion(row.id);
						}}
					/>
					<Popconfirm
						title={t("deleteConfirmation")}
						onConfirm={() => props.deleteQuestion(row.id)}
						okText={t("buttons:yes")}
						cancelText={t("buttons:no")}>
						<FontAwesomeIcon icon={faTrashAlt} />
					</Popconfirm>
					<FontAwesomeIcon
						icon={faLongArrowAltUp}
						className={cx("icon-alt", { disabled: !row.allowUp })}
						onClick={() => row.allowUp && props.moveQuestion(row.id, MoveQuestionGroup.UP)}
					/>
					<FontAwesomeIcon
						icon={faLongArrowAltDown}
						className={cx("icon-alt", { disabled: !row.allowDown })}
						onClick={() => row.allowDown && props.moveQuestion(row.id, MoveQuestionGroup.DOWN)}
					/>
					<FontAwesomeIcon
						icon={faPlusCircle}
						onClick={(e) => {
							e.stopPropagation();
							props.newQuestionInput(row.id);
						}}
					/>
				</>
			);
		} else if (row.type == "input") {
			return (
				<>
					<FontAwesomeIcon
						icon={faPencilAlt}
						onClick={(e) => {
							e.stopPropagation();
							props.editQuestionInput(row.id, row.idQuestion);
						}}
					/>
					<Popconfirm
						title={t("deleteConfirmation")}
						onConfirm={() => props.deleteQuestionInput(row.id)}
						okText={t("buttons:yes")}
						cancelText={t("buttons:no")}>
						<FontAwesomeIcon icon={faTrashAlt} />
					</Popconfirm>
					<FontAwesomeIcon
						icon={faLongArrowAltUp}
						className={cx("icon-alt", { disabled: !row.allowUp })}
						onClick={() => row.allowUp && props.moveQuestionInput(row.id, MoveQuestionGroup.UP)}
					/>
					<FontAwesomeIcon
						icon={faLongArrowAltDown}
						className={cx("icon-alt", { disabled: !row.allowDown })}
						onClick={() => row.allowDown && props.moveQuestionInput(row.id, MoveQuestionGroup.DOWN)}
					/>
				</>
			);
		}
	};
	return (
		<Row gutter={32} className="questionnaireTree">
			<Col span={props.questionnaireToEdit ? 12 : 24}>
				<div className="header-tools">
					<div className="tools">
						<Tooltip title={t("newGroupQuestions")}>
							<Button
								type="primary"
								onClick={() => props.newQuestionGroup()}
								icon={<FontAwesomeIcon icon={faPlus} />}>
								&nbsp;&nbsp;{t("newGroupQuestions")}
							</Button>
						</Tooltip>
						&nbsp;&nbsp;
						<Tooltip title={t("questionnairePreview")}>
							<Button
								type="primary"
								onClick={() => props.onClickPreview()}
								icon={<FontAwesomeIcon icon={faEye} />}>
								&nbsp;&nbsp;{t("questionnairePreview")}
							</Button>
						</Tooltip>
					</div>
				</div>
				<div className="questionnaire-tree__container">
					{props.questionnaireTreeData!.length > 0 ? (
						<Tree
							ref={treeRef}
							blockNode
							defaultExpandedKeys={props
								.questionnaireTreeData!.filter((r) => r.type == "Section")
								.map((q) => q.key)}
							height={userWindowHeight() - 300}
							//onDragEnter={this.onDragEnter}
							//onDrop={this.onDrop}
							treeData={props.questionnaireTreeData}
							selectedKeys={props.selectedKeys}
							titleRender={(row: any) => {
								let title;
								title = <>{row.title}</>;
								if (row.type == "input") {
									if (!row.nameLabel) {
										title = (
											<>
												<b>{t("typeOfInputs:" + row.typeInput) + ": "}</b>
												{row.title}
											</>
										);
									} else if (row.nameLabel) {
										title = (
											<>
												<b>{t("typeOfInputs:" + row.typeInput) + ": "}</b>
												{row.nameLabel} {row.title}
											</>
										);
									}
								} else {
									title = (
										<>
											<b>{t(row.type) + ": "}</b>
											{row.title}{" "}
											{row.type === "Section"
												? "(" +
												  row.children.length +
												  " " +
												  (row.children.length == 1 ? t("question") : t("questions")) +
												  ")"
												: ""}
										</>
									);
								}

								const tools = (
									<div className="questionnaire-tree__row">
										<div className="questionnaire__title-container">
											<span className={cx("questionnaire__title__" + row.type)}>{title}</span>
										</div>
										<div className="questionnaire__tools" onClick={(e) => e.stopPropagation()}>
											{renderTools(row)}
										</div>
									</div>
								);
								return tools;
							}}
						/>
					) : (
						<div className="questionnaire-tree--vacio">{t("noQuestionnaireGroups")}</div>
					)}
				</div>
			</Col>
		</Row>
	);
};
const userWindowHeight = () => {
	return window.innerHeight || document.documentElement.clientHeight;
};

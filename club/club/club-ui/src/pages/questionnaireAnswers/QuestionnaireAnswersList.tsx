import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Drawer, Space, Table } from "antd";
import PageOptions from "comps/PageOptions";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Provider from "types/entities/Provider";
import { QuestionnaireListInformation } from "types/entities/Questionnaire";
import QuestionnaireAnswersFilter from "./QuestionnaireAnswersFilter";
import questionnaireAnswersTableColumns from "./QuestionnaireAnswersTableColumns";

interface IProps {
	questionnaireAnswers: QuestionnaireListInformation[];
	page: number;
	loadAnswersData: (
		offset?: number,
		providerId?: number,
		dateCompletado?: Date,
		dateAppointment?: Date
	) => void;
	dataCount: number;
	providers: Provider[];
	filterProviders: (inputValue: string, idOrganization?: number) => void;
}

const QuestionnaireAnswersList = (props: IProps) => {
	//const [filters, setFilters] = useState<{ typeStatus?: number; idOrganization?: number }>();
	const [drawerIsOpen, setDrawerIsOpen] = useState(false);
	const { t } = useTranslation("questionnaireAnswers");
	const [filters, setFilters] = useState<{
		providerId?: number;
		dateCompletado?: Date;
		dateAppointment?: Date;
	}>();

	useEffect(() => {
		props.loadAnswersData(
			1,
			filters?.providerId,
			filters?.dateCompletado,
			filters?.dateAppointment
		);
	}, [filters]);

	const setFilterState = (providerId?: number, dateCompletado?: Date, dateAppointment?: Date) => {
		setFilters({
			providerId: providerId,
			dateCompletado: dateCompletado,
			dateAppointment: dateAppointment,
		});
	};

	const openDrawer = () => {
		setDrawerIsOpen(true);
	};

	const closeDrawer = () => {
		setDrawerIsOpen(false);
	};

	return (
		<>
			<div className="listado_container">
				<Drawer
					className="filters-drawer"
					open={drawerIsOpen}
					onClose={closeDrawer}
					width="300px"
					placement="left"
					getContainer={false}>
					<QuestionnaireAnswersFilter
						filterProviders={props.filterProviders}
						applyFilters={setFilterState}
						providers={props.providers}
					/>
				</Drawer>
				<PageOptions title={t("questionnaireAnswersTitle")}></PageOptions>
				<div className="table-container">
					<div className="table-container__header">
						<Space size="small" className="table-button-bar">
							<Button onClick={openDrawer} className="filter-btn">
								<FontAwesomeIcon icon={faFilter} />
							</Button>
						</Space>
					</div>
					<Table
						className="table__custom-expandable-icon"
						columns={questionnaireAnswersTableColumns(props.page, props.loadAnswersData)}
						pagination={{
							position: ["bottomCenter"],
							showSizeChanger: false,
							pageSize: 10,
							total: props.dataCount,
							current: props.page,
						}}
						onChange={(value) => {
							props.loadAnswersData(value.current);
						}}
						dataSource={props.questionnaireAnswers}
					/>
				</div>
			</div>
		</>
	);
};

export default QuestionnaireAnswersList;

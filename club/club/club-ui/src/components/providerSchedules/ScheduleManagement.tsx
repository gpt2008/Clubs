import { PlusCircleOutlined } from "@ant-design/icons";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Dropdown, Menu, Modal, Space, Table, Tooltip } from "antd";
import { AlignType } from "rc-table/lib/interface";
import { useTranslation } from "react-i18next";
import Schedule from "types/entities/Schedule";
import enumPrestadorScheduleStatus from "types/enums/EnumPrestadorScheduleStatus";
import { TableIcons } from "utils/utils";
import { IState as IStateContainer } from "./ScheduleManagementContainer";

interface IProps {
	visible?: boolean;
	nameProvider?: string;
	onChangePage: (page: number) => void;
	onClickScheduleForm: (idSchedule?: number, nameSchedule?: string) => void;
	onClickSchedulesAction: (
		idSchedule: number,
		nameSchedule: string,
		activate: boolean,
		drop: boolean
	) => void;
	onClickScheduleSlotsForm: (
		idSchedule?: number,
		nameSchedule?: string,
		cloneSchedule?: boolean
	) => void;
	onCancel: () => void;
}

const ScheduleManagement = (props: IProps & IStateContainer) => {
	const { t } = useTranslation(["scheduleManagement"]);

	const dateFromRenderer = (value: any, record: Schedule) => {
		return record.dateFrom?.toLocaleDateString();
	};

	const dateCreationRenderer = (value: any, record: Schedule) => {
		return record.dateCreation.toLocaleDateString();
	};

	const statusRenderer = (value: any, record: Schedule) => {
		let color = TableIcons.DotColor.red;

		if (record.typeStatus === enumPrestadorScheduleStatus.ACTIVE) {
			color = TableIcons.DotColor.green;
		}

		return TableIcons.getStatusTypeIcon(t("providerScheduleStatuses:" + record.typeStatus), color);
	};

	const actionRenderer = (value: any, record: Schedule) => {
		const onClick = (value: string) => {
			switch (value) {
				case "1":
					props.onClickScheduleSlotsForm(record.idSchedule, record.nameSchedule, false);
					break;
				case "2":
					props.onClickScheduleSlotsForm(record.idSchedule, record.nameSchedule, true);
					break;
				case "3":
					props.onClickSchedulesAction(record.idSchedule, record.nameSchedule, true, false);
					break;
				default:
					props.onClickSchedulesAction(record.idSchedule, record.nameSchedule, false, false);
					break;
			}
		};

		const addServicesDropdown = (
			<Menu onClick={(e: any) => onClick(e.key)}>
				<Menu.Item key="1">{t("editScheduleButton")}</Menu.Item>
				<Menu.Item key="2">{t("cloneScheduleButton")}</Menu.Item>
				{record.typeStatus === enumPrestadorScheduleStatus.INACTIVE ? (
					<Menu.Item key="3">{t("activateButton")}</Menu.Item>
				) : (
					<Menu.Item key="4">{t("deactivateButton")}</Menu.Item>
				)}
			</Menu>
		);

		return (
			<Space size="small">
				<Tooltip title={t("scheduleActionsButton")}>
					<Dropdown overlay={addServicesDropdown} trigger={["hover"]}>
						<Button type="primary" icon={TableIcons.getTableIcon(TableIcons.TableIcon.more)} />
					</Dropdown>
				</Tooltip>
				<Tooltip title={t("scheduleDeletionButton")}>
					<Button
						type="primary"
						icon={TableIcons.getTableIcon(TableIcons.TableIcon.trash)}
						danger
						onClick={() =>
							props.onClickSchedulesAction(record.idSchedule, record.nameSchedule, false, true)
						}
					/>
				</Tooltip>
			</Space>
		);
	};

	const columns = [
		{ title: t("scheduleNameColumn"), dataIndex: "nameSchedule", align: "left" as AlignType },
		{ title: t("dateFromColumn"), align: "left" as AlignType, render: dateFromRenderer },
		{ title: t("dateCreationColumn"), align: "left" as AlignType, render: dateCreationRenderer },
		{ title: t("statusColumn"), align: "left" as AlignType, render: statusRenderer },
		{ align: "right" as AlignType, width: "6rem", render: actionRenderer },
	];

	return (
		<Modal
			title={
				<>
					<FontAwesomeIcon icon={faCalendarAlt} style={{ marginRight: "0.5rem" }} />
					<span>{t("scheduleManagementTitle", { name: props.nameProvider })}</span>
				</>
			}
			style={{ top: 40 }}
			open={(props.visible && !props.scheduleModalVisible) || false}
			footer={<Button onClick={props.onCancel}>{t("buttons:close")}</Button>}
			onCancel={props.onCancel}
			destroyOnClose
			width={800}>
			<Space size="small" className="table-button-bar">
				<Button
					icon={<PlusCircleOutlined />}
					type="primary"
					onClick={() => props.onClickScheduleForm()}>
					{t("newScheduleButton")}
				</Button>
				{/*<Button icon={TableIcons.getTableIcon(TableIcons.TableIcon.link)} type='default' onClick={() => {}props.onClickConnectedCalendarForm()}>
                    {t('connectWithOtherCalendars')}
                </Button>*/}
			</Space>
			<div className="table-container">
				<Table
					columns={columns}
					dataSource={props.schedules}
					size="small"
					scroll={{ y: props.tableBodyHeight }}
					pagination={{
						position: ["bottomCenter"],
						hideOnSinglePage: true,
						showSizeChanger: false,
						current: props.page,
						pageSize: 10,
						total: props.dataCount,
						onChange: () => props.onChangePage,
					}}
				/>
			</div>
		</Modal>
	);
};

export default ScheduleManagement;

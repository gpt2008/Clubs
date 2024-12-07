import { EyeInvisibleOutlined, EyeOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button, Col, Modal, Popconfirm, Row, Table } from "antd";
import { AlignType } from "rc-table/lib/interface";
import { useTranslation } from "react-i18next";
import PersonalHoliday from "types/entities/Holidays";
import { Icons, TableIcons } from "utils/utils";
import { IState as IStateContainer } from "./ClosingPeriodFormContainer";

interface IProps {
	visible?: boolean;
	nameLocation?: string;
	onCancel: () => void;
	onChangePublicHoliday: (idZoneHoliday: number, checked: boolean) => void;
	onClickNewHolidayForm: () => void;
	onClickPastPeriod: () => void;
	deleteHolidayPeriod: (idPeriod: number) => void;
}

const ClosingPeriodForm = (props: IProps & IStateContainer) => {
	const { t } = useTranslation(["holidaysAndClosingForm"]);

	const dateRenderer = (value: boolean, record: PersonalHoliday) => {
		let date;

		if (value && record.dateStart.toLocaleDateString() === record.dateEnd.toLocaleDateString()) {
			date = record.dateStart.toLocaleDateString();
		} else {
			date = record.dateStart.toLocaleDateString() + " - " + record.dateEnd.toLocaleDateString();
		}

		return date;
	};

	const deleteRenderer = (value: boolean, record: PersonalHoliday) => {
		return (
			!record.isPast && (
				<Popconfirm
					title={t("messages:areYouSure")}
					onConfirm={() => props.deleteHolidayPeriod(record.idPeriod)}
					okText={t("buttons:yes")}
					cancelText={t("buttons:no")}>
					<Button
						type="primary"
						danger
						icon={TableIcons.getTableIcon(TableIcons.TableIcon.trash)}
					/>
				</Popconfirm>
			)
		);
	};

	const personalHolidaysColumns = [
		{
			title: t("personalHolidaysNameColumn"),
			dataIndex: "namePeriod",
			align: "left" as AlignType,
			width: "18rem",
			ellipsis: true,
		},
		{ title: t("personalHolidaysDateColumn"), render: dateRenderer, align: "left" as AlignType },
		{ width: "4rem", render: deleteRenderer, align: "center" as AlignType },
	];

	return (
		<Modal
			title={
				<>
					{Icons.getIconByCode("STOTE", { color: "inherit" })}
					<span>{t("closingPeriodsTitle", { locationName: props.nameLocation })}</span>
				</>
			}
			style={{ top: 40 }}
			onOk={undefined}
			onCancel={props.onCancel}
			open={props.visible && !props.newHolidayFormVisible}
			destroyOnClose
			width={600}
			footer={[
				<Button key="back" onClick={props.onCancel}>
					{" "}
					{t("buttons:close")}{" "}
				</Button>,
			]}>
			<Row gutter={16} style={{ paddingBottom: "0.5rem" }}>
				<Col>
					<Button
						type="primary"
						icon={<PlusCircleOutlined />}
						onClick={props.onClickNewHolidayForm}>
						{t("addClosingPeriodButton")}
					</Button>
				</Col>
				<Col>
					<Button
						icon={props.showPastPeriod ? <EyeInvisibleOutlined /> : <EyeOutlined />}
						onClick={props.onClickPastPeriod}>
						{props.showPastPeriod ? t("hidePastHolidayButton") : t("showPastHolidayButton")}
					</Button>
				</Col>
			</Row>
			<Table
				columns={personalHolidaysColumns}
				dataSource={props.holidays?.holidaysPeriodLocationList}
				size="small"
				pagination={false}
			/>
		</Modal>
	);
};

export default ClosingPeriodForm;

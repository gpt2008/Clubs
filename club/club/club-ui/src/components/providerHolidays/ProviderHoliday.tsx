import { EyeInvisibleOutlined, EyeOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button, Col, Modal, Popconfirm, Row, Table } from "antd";
import { AlignType } from "rc-table/lib/interface";
import { useTranslation } from "react-i18next";
import PrestadorHolidays from "types/entities/Prestador";
import { Icons, TableIcons } from "utils/utils";
import { IState as IStateContainer } from "./ProviderHolidayContainer";

interface IProps {
	visible?: boolean;
	nameProvider?: string;
	onCancel: () => void;
	onClickNewHolidayForm: () => void;
	onClickPastPeriod: () => void;
	deleteHolidayPeriod: (idPrestadorHoliday: number) => void;
}

const ProviderHoliday = (props: IProps & IStateContainer) => {
	const { t } = useTranslation(["providerHolidayForm"]);

	const dateRenderer = (value: boolean, record: PrestadorHolidays) => {
		let date;

		if (value && record.dateStart.toLocaleDateString() === record.dateEnd.toLocaleDateString()) {
			date = record.dateStart.toLocaleDateString();
		} else {
			date = record.dateStart.toLocaleDateString() + " - " + record.dateEnd.toLocaleDateString();
		}

		return date;
	};

	const deleteRenderer = (value: boolean, record: PrestadorHolidays) => {
		return (
			!record.isPast && (
				<Popconfirm
					title={t("messages:areYouSure")}
					onConfirm={() => props.deleteHolidayPeriod(record.idProviderHoliday)}
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

	const providerHolidaysColumns = [
		{
			title: t("nameHolidayColumn"),
			dataIndex: "nameHoliday",
			align: "left" as AlignType,
			width: "18rem",
			ellipsis: true,
		},
		{ title: t("dateFromToColumn"), render: dateRenderer, align: "left" as AlignType },
		{ width: "4rem", render: deleteRenderer, align: "center" as AlignType },
	];

	return (
		<Modal
			title={
				<>
					{Icons.getIconByCode("HOLIDAYS", { color: "inherit" })}
					<span>{t("providerHolidayTitle", { namePrestador: props.nameProvider })}</span>
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
						{t("addHolidayPeriodButton")}
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
				columns={providerHolidaysColumns}
				dataSource={props.holidayList}
				size="small"
				pagination={false}
			/>
		</Modal>
	);
};

export default ProviderHoliday;

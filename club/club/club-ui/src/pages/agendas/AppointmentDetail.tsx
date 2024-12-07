import { useEffect } from "react";

import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
	faBuilding,
	faCalendar,
	faCancel,
	faCheck,
	faChevronDown,
	faMoneyBill,
	faUserCircle,
	faVideo,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	Button,
	Cascader,
	Col,
	DatePicker,
	Dropdown,
	Form,
	Input,
	Modal,
	Row,
	Select,
	Space,
	TimePicker,
} from "antd";
import TextArea from "antd/lib/input/TextArea";
import cx from "classnames";
import dayjs from "dayjs";
import { Option } from "rc-select";
import { useTranslation } from "react-i18next";
import enumAppointmentStatusNew from "types/enums/EnumAppointmentStatusNew";
import { URL } from "utils/rest";
import "./Agendas.scss";
import { IState as IStateContainer } from "./AppointmentDetailContainer";

interface IProps {
	visible?: boolean;
	onCancel: () => void;
	onClickEditAppointmenent: (idAppointment: number, patient: string) => void;
	openCancellationDetails: () => void;
}

const AppointmentDetail = (props: IProps & IStateContainer) => {
	const { t } = useTranslation(["newAppointmentForm"]);

	const [form] = Form.useForm();

	useEffect(() => {
		form.resetFields();
	}, [props.appointment]);

	const getTime = (mins: number) => {
		const hours = Math.floor(mins / 60);
		const minutes = mins % 60;

		const time = (hours < 10 ? "0" : "") + hours + ":" + (minutes < 10 ? "0" : "") + minutes;
		return dayjs(time, "HH:mm");
	};

	const initialValues = props.appointment && {
		...props.appointment,
		dateAppointment: dayjs(props.appointment.dateAppointment),
		valueTime: getTime(props.appointment.valueTime!),
		provider: props.appointment.idProvider,
		service: [props.appointment.nameSpeciality, props.appointment.nameSubespecialidad, props.appointment.nameActo],
		patient:
			props.appointment.namePatient +
			" " +
			(props.appointment?.surname1Patient ? " " + props.appointment?.surname1Patient : "") +
			(props.appointment?.surname2Patient ? " " + props.appointment?.surname2Patient : ""),
		nameLocation: props.appointment.nameLocation
			? props.appointment.nameLocation
			: t("onlineVideocall"),
	};

	/*const nameManager =
    props.appointment?.idUserManagerCreation &&
    props.appointment.nameManager + " " + props.appointment.surname1Manager;*/

	let namePrestador = props.appointment?.nameProvider + " " + props.appointment?.surname1Provider;
	namePrestador += props.appointment?.surname2Provider
		? " " + props.appointment?.surname2Provider
		: "";

	const footer = () => {
		const patient =
			props.appointment?.namePatient +
			" " +
			(props.appointment?.surname1Patient ? " " + props.appointment?.surname1Patient : "") +
			(props.appointment?.surname2Patient ? " " + props.appointment?.surname2Patient : "");

		return (
			<Row justify="end">
				<Col>
					{props.appointment?.typeStatus !== enumAppointmentStatusNew.CANCELLED &&
						props.appointment?.typeStatus !== enumAppointmentStatusNew.DONE && (
							<Space size="small">
								<Button
									type="primary"
									icon={<EditOutlined />}
									onClick={() =>
										props.onClickEditAppointmenent(props.appointment!.idAppointment, patient)
									}>
									{t("editAppointmentButton")}
								</Button>
								<Button
									type="primary"
									danger
									icon={<DeleteOutlined />}
									onClick={props.openCancellationDetails}>
									{t("cancelAppointmentButton")}
								</Button>
								<Button type="default" onClick={props.onCancel}>
									{t("buttons:close")}
								</Button>
							</Space>
						)}
				</Col>
			</Row>
		);
	};

	const openVideocall = () => {
		if (props.appointment?.videocallUrl) {
			window.open(props.appointment?.videocallUrl, "_blank", "noreferrer");
		}
	};

	const loadStatusIcon = (typeStatus: number) => {
		switch (typeStatus) {
			case 1:
				return faCheck;
			case 3:
				return faCalendar;
			case 4:
				return faCheck;
			case 5:
				return faMoneyBill;
			default:
				return faCancel;
		}
	};

	const status = props.appointment?.statusList.find(
		(s) => s.typeStatus === props.appointment?.typeStatus
	);

	return (
		<Modal
			open={props.visible && !(props.editFormVisible || props.cancellationDetailsVisible)}
			style={{ top: 40 }}
			title={t("detailAppointmentTitle")}
			footer={[footer()]}
			onCancel={props.onCancel}
			destroyOnClose
			closable={false}
			width={700}>
			<Form
				layout="vertical"
				form={form}
				size="large"
				initialValues={initialValues}
				className="form-detail-container appointment-form__container">
				<div className="appointment_status_container">
					<Dropdown
						overlay={
							<StatusHistory
								statusHistory={props.appointment?.statusList}
								loadStatusIcon={loadStatusIcon}
							/>
						}
						trigger={["click"]}>
						<Button
							className={cx("appointment_status_button", {
								confirmed: status?.typeStatus === 1,
								cancelled: status?.typeStatus === 2,
								payment: status?.typeStatus === 5,
								proposed: status?.typeStatus === 3,
							})}>
							<div>
								<FontAwesomeIcon icon={loadStatusIcon(props.appointment?.typeStatus!)} />
								<span>
									<b>{t("appointmentStatus:" + props.appointment?.typeStatus)}</b>
									{props.appointment?.typeStatusDetail != undefined &&
										t("appointmentStatusDetail:" + props.appointment?.typeStatusDetail)}
								</span>
							</div>
							<div className="appointment_history_date">
								{dayjs(
									props.appointment?.statusList.find(
										(s) => s.typeStatus === props.appointment?.typeStatus
									)?.dateCreation
								).format("DD/MM/YYYY HH:mm")}
								<FontAwesomeIcon icon={faChevronDown} />
							</div>
						</Button>
					</Dropdown>
				</div>
				<div style={{ padding: "0 1rem" }}>
					<Row gutter={16}>
						<Col span={props.appointment?.flagOnline ? 12 : 24}>
							<Form.Item name="nameLocation" label={t("locationField")}>
								<Input
									disabled
									prefix={
										<FontAwesomeIcon
											style={{ marginRight: "0.5rem" }}
											icon={props.appointment?.flagOnline ? faVideo : faBuilding}
										/>
									}
								/>
							</Form.Item>
						</Col>
						{props.appointment?.flagOnline === 1 && (
							<Col span={12} style={{ display: "flex", alignItems: "center" }}>
								<Button
									type="primary"
									icon={<FontAwesomeIcon style={{ marginRight: "0.5rem" }} icon={faVideo} />}
									onClick={() => openVideocall()}
									disabled={!props.appointment.videocallUrl}
									block>
									{t("openVideocallWindow")}
								</Button>
							</Col>
						)}
					</Row>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item name="provider" label={t("prestadorField")}>
								<Select disabled>
									<Option
										key={props.appointment?.idProvider}
										value={props.appointment?.idProvider!}
										label={props.appointment?.nameProvider!}>
										{props.appointment?.hasProviderPhoto ? (
											<span className="loading-img loading-img--inline prestador-avatar--inline">
												<img
													alt=""
													src={URL + "/file?pa&idProvider=" + props.appointment?.idProvider}
													onLoad={(e) => {
														e.currentTarget.parentElement!.classList.remove("loading-img");
														e.currentTarget.parentElement!.style.width = "auto";
													}}
												/>
												{namePrestador}
											</span>
										) : (
											<div style={{ display: "flex" }}>
												<div
													style={{
														marginRight: "0.5rem",
														display: "flex",
														alignItems: "center",
													}}>
													<FontAwesomeIcon icon={faUserCircle} className="icon" />
												</div>
												{namePrestador}
											</div>
										)}
									</Option>
								</Select>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item name="service" label={t("serviceField")}>
							<Cascader
								options={props.services}
								placeholder={t("servicePlaceHolder")}
								disabled
							/>
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={16}>
						<Col span={8}>
							<Form.Item
								className="input-right-align"
								label={t("dateLabel")}
								name="dateAppointment">
								<DatePicker style={{ width: "100%" }} disabled />
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item className="input-right-align" label={t("timeLabel")} name="valueTime">
								<TimePicker format="HH:mm" disabled style={{ width: "100%" }} />
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item
								className="input-right-align"
								label={t("durationLabel")}
								name="valueDuration">
								<Input minLength={1} maxLength={10} suffix={"min"} disabled />
							</Form.Item>
						</Col>
					</Row>
					<Col span={24}>
						<Form.Item name="patient" label={t("patientOptionLabel")}>
							<Input disabled />
						</Form.Item>
					</Col>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item name="valuePhone" label={t("phoneLabel")}>
								<Input disabled />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item name="valueEmail" label={t("emailLabel")}>
								<Input disabled />
							</Form.Item>
						</Col>
					</Row>
					<Row>
						<Col span={24}>
							<Form.Item name="valueNote" label={t("noteLabel")}>
								<TextArea style={{ resize: "none" }} disabled rows={6} />
							</Form.Item>
						</Col>
					</Row>
				</div>
			</Form>
		</Modal>
	);
};

const StatusHistory = (props: {
	statusHistory?: {
		typeStatus: number;
		nameOperator?: string;
		surnameOperator?: string;
		typeStatusDetail?: number;
		dateCreation: Date;
	}[];
	loadStatusIcon: (status: number) => IconProp;
}) => {
	const { t } = useTranslation(["newAppointmentForm"]);

	return (
		<div className="status-history-container">
			{props.statusHistory?.map((s) => (
				<div
					key={s.typeStatus}
					className={cx("status-history", {
						confirmed: s.typeStatus === 1,
						cancelled: s.typeStatus === 2,
						payment: s.typeStatus === 5,
						proposed: s.typeStatus === 3,
					})}>
					<div>
						<FontAwesomeIcon icon={props.loadStatusIcon(s.typeStatus!)} />
						<span>
							<b>{t("appointmentStatus:" + s.typeStatus)}</b>
							{s.typeStatusDetail != undefined &&
								t("appointmentStatusDetail:" + s.typeStatusDetail)}
						</span>
					</div>
					<div className="appointment_history_date">
						{dayjs(s.dateCreation).format("DD/MM/YYYY HH:mm")}
					</div>
				</div>
			))}
		</div>
	);
};

export default AppointmentDetail;

import React, { useState } from "react";

import { faCalendarAlt, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	Button,
	Cascader,
	Checkbox,
	Col,
	DatePicker,
	Form,
	FormInstance,
	Input,
	Modal,
	Row,
	Select,
	TimePicker,
} from "antd";
import TextArea from "antd/lib/input/TextArea";
import cx from "classnames";
import dayjs from "dayjs";
import { Option } from "rc-select";
import { useTranslation } from "react-i18next";
import { URL } from "../../utils/rest";
import { Icons } from "../../utils/utils";
import { IState as IStateContainer } from "./EditAppointmentFormContainer";

interface IProps {
	visible?: boolean;
	patient?: string;
	getServices: (idPortfolio: number) => void;
	onClickCalendar: (form: FormInstance) => void;
	onCancel: (saved: boolean) => void;
	onSubmit: (form: FormInstance) => void;
	nuevaCita?: boolean;
}

const EditAppointmentForm = (props: IProps & IStateContainer) => {
	const { t } = useTranslation(["newAppointmentForm"]);

	const [form] = Form.useForm();

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
		prestador: props.appointment.idProvider,
		location: props.appointment.idLocation,
		service: [props.appointment.nameSpeciality, props.appointment.nameSubespecialidad, props.appointment.nameActo],
		flagOnline: props.appointment.flagOnline === 1 ? true : false,
	};

	const [isOnline, setIsOnline] = useState<boolean>(
		props.appointment?.flagOnline === 1 ? true : false
	);

	const onCheckOnline = () => {
		if (!isOnline) {
			form.setFieldsValue({ ...form.getFieldsValue(), location: undefined });
		}
		setIsOnline(!isOnline);
	};

	const onSelectPortfolio = () => {
		form.setFieldsValue({ ...form.getFieldsValue(), service: undefined });
		props.getServices(form.getFieldValue("portfolio"));
	};

	const onChangeService = (value: any, selectedOptions:any) => {
		if (value){
			props.services?.forEach((s) => {
				s.children.forEach((s) => {
					const service = s.children?.find(
						(s) => s.value === value[2]
					);
					if (service) {
						form.setFieldsValue({
							...form.getFieldsValue(),
							duration: service.valueDuration,
						});
					}
				});
			});
		}
	};

	const onChangeDuration = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		if (isNaN(Number(value))) {
			const duration = form.getFieldValue("duration").slice(0, -1);
			form.setFieldsValue({ ...form.getFieldsValue(), duration });
		}
	};

	const filter = (inputValue: any, path: any) => {
		return path.some(
			(option: any) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
		);
	};

	return (
		<Modal
			title={
				<>
					<FontAwesomeIcon icon={faCalendarAlt} style={{ marginRight: "0.5rem" }} />
					<span>{t("editAppointmentTitle", { patient: props.patient })}</span>
				</>
			}
			open={props.visible && !props.calendarVisible}
			onCancel={() => props.onCancel(false)}
			style={{ top: 40 }}
			cancelText={t("buttons:cancel")}
			onOk={() => props.onSubmit(form)}
			okText={t("buttons:save")}
			destroyOnClose
			width={650}>
			<Form
				layout="vertical"
				form={form}
				size="large"
				initialValues={initialValues}
				className="form-detail-container mixed">
				<Row gutter={16}>
					<Col span={12}>
						<Form.Item name="prestador" label={t("prestadorField")} rules={[{ required: true }]}>
							<Select>
								{props.providerList?.map((pr) => {
									return (
										<Option key={pr.idProvider} value={pr.idProvider} label={pr.value}>
											{pr.hasProviderAvatar ? (
												<span className="loading-img loading-img--inline prestador-avatar--inline">
													<img
														alt=""
														src={URL + "/file?pa&idProvider=" + pr.idProvider}
														onLoad={(e) => {
															e.currentTarget.parentElement!.classList.remove("loading-img");
															e.currentTarget.parentElement!.style.width = "auto";
														}}
													/>
													{pr.value}
												</span>
											) : (
												<span className="loading-img--inline">
													<FontAwesomeIcon
														icon={faUserCircle}
														className="icon"
														style={{
															fontSize: "1.75rem",
															marginRight: "0.5rem",
														}}
													/>
													{pr.value}
												</span>
											)}
										</Option>
									);
								})}
							</Select>
						</Form.Item>
					</Col>
					<Col span={12} style={{ position: "relative" }}>
						<Form.Item
							name="location"
							label={t("locationField")}
							rules={[{ required: !isOnline }]}
							className={cx({ "form-detail-disabled-item": isOnline })}
							style={{ marginBottom: "0" }}>
							<Select disabled={isOnline}>
								{props.locations?.map((loc) => {
									return (
										<Option key={loc.idLocation} value={loc.idLocation} label={loc.nameLocation}>
											{loc.nameLocation}
										</Option>
									);
								})}
							</Select>
						</Form.Item>
						<Form.Item
							name="flagOnline"
							valuePropName="checked"
							style={{ position: "absolute", top: -8, right: 0 }}>
							<Checkbox onChange={() => onCheckOnline()}>{t("flagAllowVidLabel")}</Checkbox>
						</Form.Item>
					</Col>
				</Row>
				<Row gutter={16}>
					
					<Col span={12}>
						<Form.Item
							name="service"
							label={t("serviceField")}
							rules={[{ required: true }]}
							>
							<Cascader
								options={props.services}
								placeholder={t("servicePlaceHolder")}
								showSearch={{ filter }}
								disabled={props.nuevaCita}
								onChange={onChangeService}
							/>
						</Form.Item>
					</Col>
				</Row>
				<Row gutter={16}>
					<Col span={8}>
						<Form.Item label={t("dateLabel")} name="dateAppointment" rules={[{ required: true }]}>
							<DatePicker style={{ width: "100%" }} />
						</Form.Item>
					</Col>
					<Col span={2}>
						<Button
							type="primary"
							className="button__calendar"
							onClick={() => props.onClickCalendar(form)}
							icon={
								<FontAwesomeIcon icon={faCalendarAlt} style={Icons.PRIMARY_BUTTON_ICON_STYLE} />
							}
						/>
					</Col>
					<Col span={8}>
						<Form.Item label={t("timeLabel")} name="valueTime" rules={[{ required: true }]}>
							<TimePicker
								format="HH:mm"
								style={{ width: "100%" }}
								onSelect={(time) => {
									form.setFieldsValue({
										...form.getFieldsValue(),
										valueTime: time,
									});
								}}
							/>
						</Form.Item>
					</Col>
					<Col span={6}>
						<Form.Item
							shouldUpdate
							className="input-right-align"
							label={t("durationLabel")}
							name="valueDuration"
							rules={[{ required: true }]}>
							<Input minLength={1} maxLength={10} suffix={"min"} onChange={onChangeDuration} />
						</Form.Item>
					</Col>
				</Row>

				<Form.Item label={t("noteLabel")} name="valueNote">
					<TextArea rows={3} style={{ resize: "none" }} />
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default EditAppointmentForm;

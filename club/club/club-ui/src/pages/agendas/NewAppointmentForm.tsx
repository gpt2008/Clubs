import React, { useEffect, useState } from "react";

import { faCalendarAlt, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	AutoComplete,
	Cascader,
	CascaderProps,
	Checkbox,
	Col,
	DatePicker,
	Dropdown,
	Form,
	FormInstance,
	Input,
	Modal,
	Radio,
	Row,
	Select,
	TimePicker,
} from "antd";
import { CheckboxValueType } from "antd/lib/checkbox/Group";
import TextArea from "antd/lib/input/TextArea";
import cx from "classnames";
import dayjs from "dayjs";
import { Option } from "rc-select";
import { useTranslation } from "react-i18next";
import enumTypeChannelNotification from "types/enums/EnumTypeChannelNotification";
import { URL } from "../../utils/rest";
import "./Agendas.scss";
import { IState as IStateContainer } from "./NewAppointmentFormContainer";
import { NewService } from "types/entities/Service";
import { EnumIdentificationType } from "types/enums/EnumIdentificationType";
import ProvidersDropDown from "components/filterDropdowns/providersDropdown/ProvidersDropdown";
const { Search } = Input;

interface IProps {
	visible?: boolean;
	fromSlot?: boolean;
	fromMonth?: boolean;
	date?: Date;
	getServices: (idProvider: number) => void;
	searchPatient: (value: string, form: FormInstance) => void;
	onCancel: () => void;
	onSubmit: (form: FormInstance) => void;
	onPatientSelection: (form: FormInstance, id: number) => void;
	loading: boolean;
	nuevaCita?: boolean; // Para pantalla de nueva cita
	setIdProvider: (idProvider?: number) => void;
	idService?: number[];
	service?: string[];
}

const NewAppointmentForm = (props: IProps & IStateContainer) => {
	const { t } = useTranslation(["newAppointmentForm"]);

	const [form] = Form.useForm();

	const initialValues = {
		prestador: props.provider?.idProvider,
		location: props.fromSlot ? props.locations![0].idLocation : undefined,
		date: props.date ? dayjs(props.date) : undefined,
		time: !props.fromMonth ? dayjs(props.date) : undefined,
		channelCbGroup: [],
		service: props.nuevaCita ? props.service : undefined,
		duration: props.nuevaCita ? props.idService![3] : undefined
	};

	const [grName, setStyle] = useState<string>(props.cbGroupStyle ? props.cbGroupStyle : "");
	const [isOnline, setIsOnline] = useState<boolean>(false);

	const groupChanged = (checkedValue: CheckboxValueType[]) => {
		if (checkedValue.length > 0) {
			setStyle("");
		}
	};

	useEffect(() => {
		if (props.cbGroupStyle) {
			setStyle(props.cbGroupStyle);
		}

		if (form.getFieldValue("channelCbGroup").length > 0) {
			setStyle("");
			return;
		}
	}, [props, grName, form]);

	let name = props.provider?.namePerson + " " + props.provider?.nameSurname1;
	name += props.provider?.nameSurname2 ? " " + props.provider?.nameSurname2 : "";

	const onCheckOnline = () => {
		if (!isOnline) {
			form.setFieldsValue({ ...form.getFieldsValue(), location: undefined });
		}
		setIsOnline(!isOnline);
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

	const onSelectPatient = (value: string) => {
		props.searchPatient(value, form);
	};

	const filter = (inputValue: any, path: any) => {
		return path.some(
			(option: any) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
		);
	};

	const onChangeIdProvider = (idProvider?:number) => {
		props.setIdProvider(idProvider);
		form.setFieldValue("prestador",idProvider);
	};
	
	return (
		<Modal
			title={
				<>
					<FontAwesomeIcon icon={faCalendarAlt} style={{ marginRight: "0.5rem" }} />
					<span>{t("title")}</span>
				</>
			}
			open={props.visible || false}
			onCancel={props.onCancel}
			style={{ top: 40 }}
			cancelText={t("buttons:cancel")}
			onOk={() => props.onSubmit(form)}
			okText={t("buttons:save")}
			destroyOnClose
			width={700}>
			<Form
				layout="vertical"
				form={form}
				size="large"
				initialValues={initialValues}
				className="form-detail-container mixed appointment-form__container">
				<Row gutter={16}>
					<Col span={12}>
						{props.nuevaCita ? (
							<Form.Item
								name="prestador"
								label={t("prestadorField")}
								className="form-detail-disabled-item">
								<ProvidersDropDown
									idProviderSelected={props.idProvider}
									providers={props.providers}
									selectProvider={onChangeIdProvider}
									filterProviders={() => {}}
								/>
							</Form.Item>
						) : (
							<Form.Item
								name="prestador"
								label={t("prestadorField")}
								className="form-detail-disabled-item">
								<Select disabled>
									<Option
										key={props.provider?.idProvider}
										value={props.provider?.idProvider!}
										label={props.provider?.namePerson!}>
										{props.provider?.hasProviderPhoto ? (
											<span className="loading-img loading-img--inline prestador-avatar--inline">
												<img
													alt=""
													src={URL + "/file?pa&idProvider=" + props.provider.idProvider}
													onLoad={(e) => {
														e.currentTarget.parentElement!.classList.remove("loading-img");
														e.currentTarget.parentElement!.style.width = "auto";
													}}
												/>
												{name}
											</span>
										) : (
											<div style={{ display: "flex" }}>
												<span className="loading-img--inline prestador-avatar--inline">
												<div
													style={{
														marginRight: "0.5rem",
														display: "flex",
														alignItems: "center",
													}}>
													<FontAwesomeIcon icon={faUserCircle} className="icon" /> 
												</div>
													{name}
												</span>
											</div>
										)}
									</Option>
								</Select>
							</Form.Item>
					)}
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

				<Form.Item
					name="service"
					label={t("serviceField")}
					rules={[{ required: true }]}
					className={cx({
						"form-detail-disabled-item": !props.fromSlot,
					})}>
						<Cascader
							disabled={props.nuevaCita}
							options={props.services}
							placeholder={t("servicePlaceHolder")}
							showSearch={{ filter }}
							//disabled={!form.getFieldValue("portfolio") && !props.fromSlot}
							onChange={onChangeService}
						/>
				</Form.Item>
				
				<Row gutter={16}>
					<Col span={8}>
						<Form.Item label={t("dateLabel")} name="date" className="form-detail-disabled-item">
							<DatePicker style={{ width: "100%" }} disabled />
						</Form.Item>
					</Col>
					<Col span={8}>
						<Form.Item
							label={t("timeLabel")}
							name="time"
							rules={[{ required: !props.fromSlot }]}
							className={cx({ "form-detail-disabled-item": props.fromSlot })}>
							<TimePicker format="HH:mm" disabled={props.fromSlot} style={{ width: "100%" }} />
						</Form.Item>
					</Col>
					<Col span={8}>
						<Form.Item
							shouldUpdate
							className="input-right-align"
							label={t("durationLabel")}
							name="duration"
							rules={[{ required: true }]}>
							<Input minLength={1} maxLength={10} suffix={"min"} onChange={onChangeDuration} />
						</Form.Item>
					</Col>
				</Row>
				<Form.Item
					label={t("patientLabel")}
					name="patientSelection"
					rules={[{ required: true }]}
					style={{ marginBottom: "1rem" }}>
						<Search placeholder={t("dniID")}  enterButton={t("search")} size="large" onSearch={onSelectPatient} loading={props.loading}/>
				</Form.Item>
				<Form.Item shouldUpdate noStyle>
					{() =>
						props.loadedSearch ? (
							<>
									<Row gutter={16}>
										<Col span={8}>
											<Form.Item shouldUpdate name="namePatient" rules={[{ required: true }]}>
												<Input placeholder={t("namePatientLabel")} />
											</Form.Item>
										</Col>
										<Col span={8}>
											<Form.Item shouldUpdate name="surname1" rules={[{ required: true }]}>
												<Input placeholder={t("surname1Label")} />
											</Form.Item>
										</Col>
										<Col span={8}>
											<Form.Item shouldUpdate name="surname2">
												<Input placeholder={t("surname2Label")} />
											</Form.Item>
										</Col>
									</Row>
								
								<Row gutter={16}>
									<Col span={6}>
									<Form.Item
											shouldUpdate
											name="tipo"
											label={t("tipoLabel")}
											rules={[{ required: true }]}>
												<Select>
													<Option key={EnumIdentificationType.DNI} value={EnumIdentificationType.DNI} label={t("dniID")}>
														{t("dniID")}
													</Option>
													<Option key={EnumIdentificationType.NIE} value={EnumIdentificationType.NIE} label={t("nieID")}>
														{t("nieID")}
													</Option>
													<Option key={EnumIdentificationType.NDOC} value={EnumIdentificationType.NDOC} label={t("ndoc")}>
														{t("ndoc")}
													</Option>
													<Option key={EnumIdentificationType.OTRO} value={EnumIdentificationType.OTRO} label={t("other")}>
														{t("other")}
													</Option>
												</Select>
										</Form.Item>
									</Col>
									<Col span={10}>
									<Form.Item
											shouldUpdate
											name="dni"
											label={t("ndoc")}
											rules={[{ required: true }]}>
											<Input />
										</Form.Item>
									</Col>
									<Col span={8}>
										<Form.Item label={t("datebirth")} name="dateBirth" className="form-detail-disabled-item" rules={[{ required: true }]}>
											<DatePicker style={{ width: "100%" }} />
										</Form.Item>
									</Col>
								</Row>

								<Row gutter={16}>
									<Col span={12}>
										<Form.Item
											shouldUpdate
											name="phone"
											label={t("phoneLabel")}
											rules={[{ required: true }]}>
											<Input />
										</Form.Item>
									</Col>
									<Col span={12}>
										<Form.Item shouldUpdate name="email" label={t("emailLabel")}>
											<Input />
										</Form.Item>
									</Col>
								</Row>
								{ false && (<Row gutter={16}>
									<Col span={12}>
										<span>{t("notificationForm:notificationChannelsTitle")}</span>
										<Form.Item name="channelCbGroup">
											<Checkbox.Group className={grName} onChange={groupChanged}>
												<Row>
													<Checkbox value={enumTypeChannelNotification.EMAIL}>
														{t("typeChannelNotification:" + enumTypeChannelNotification.EMAIL)}
													</Checkbox>
													<Checkbox value={enumTypeChannelNotification.SMS}>
														{t("typeChannelNotification:" + enumTypeChannelNotification.SMS)}
													</Checkbox>
													<Checkbox value={enumTypeChannelNotification.WHATSAPP}>
														{t("typeChannelNotification:" + enumTypeChannelNotification.WHATSAPP)}
													</Checkbox>
												</Row>
											</Checkbox.Group>
										</Form.Item>
									</Col>
								</Row> )}
							</>
						) : (
							<></>
						)
					}
				</Form.Item>
				<Form.Item label={t("noteLabel")} name="note">
					<TextArea rows={3} style={{ resize: "none" }} />
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default NewAppointmentForm;

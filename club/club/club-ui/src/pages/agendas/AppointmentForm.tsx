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
import { useTranslation } from "react-i18next";
import cx from "classnames";
import TextArea from "antd/lib/input/TextArea";
import enumTypeChannelNotification from "types/enums/EnumTypeChannelNotification";
import { EnumIdentificationType } from "types/enums/EnumIdentificationType";
import { NewService } from "types/entities/Service";
import { CheckboxValueType } from "antd/lib/checkbox/Group";
import { Option } from "rc-select";
const { Search } = Input;

interface IProps {
	fromSlot?: boolean;
	fromMonth?: boolean;
	date?: Date;
    services?: NewService[];
    loadedSearch?: boolean;
    grName: string;
	onSelectPatient: (value: string) => void;
    onChangeDuration: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onChangeService: (value: any, selectedOptions:any) => void;
    groupChanged: (checkedValue: CheckboxValueType[]) => void;
	loading: boolean;
}

const AppointmentForm = (props : IProps) => {
    const { t } = useTranslation(["newAppointmentForm"]);
    
    const filter = (inputValue: any, path: any) => {
		return path.some(
			(option: any) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
		);
	};

    return (
        <>
            <Form.Item
					name="service"
					label={t("serviceField")}
					rules={[{ required: true }]}
					className={cx({
						"form-detail-disabled-item": !props.fromSlot,
					})}>
						<Cascader
							options={props.services}
							placeholder={t("servicePlaceHolder")}
							showSearch={{ filter }}
							//disabled={!form.getFieldValue("portfolio") && !props.fromSlot}
							onChange={props.onChangeService}
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
							<Input minLength={1} maxLength={10} suffix={"min"} onChange={props.onChangeDuration} />
						</Form.Item>
					</Col>
				</Row>
				<Form.Item
					label={t("patientLabel")}
					name="patientSelection"
					rules={[{ required: true }]}
					style={{ marginBottom: "1rem" }}>
						<Search placeholder={t("dniID")}  enterButton={t("search")} size="large" onSearch={props.onSelectPatient} loading={props.loading}/>
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
											<Checkbox.Group className={props.grName} onChange={props.groupChanged}>
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
        </>
    );
};

export default AppointmentForm;

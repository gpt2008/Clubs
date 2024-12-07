import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Col, Form, Row, Select } from "antd";
import ProvidersDropDown from "components/filterDropdowns/providersDropdown/ProvidersDropdown";
import { Option } from "rc-select";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Organization from "types/entities/Organization";
import Provider from "types/entities/Provider";
import enumAppointmentStatusNew from "types/enums/EnumAppointmentStatusNew";

interface IProps {
	providers: Provider[];
	applyFilters: (typeStatus?: number, idOrganization?: number) => void;
	filterProviders: (inputValue: string, idOrganization?: number) => void;
}

const AppointmentsFilter = (props: IProps) => {
	const [form] = Form.useForm();

	const { t } = useTranslation("appointmentsFilter");

	const resetFilters = () => {
		form.resetFields();
		props.applyFilters!(form.getFieldValue("typeStatus"), form.getFieldValue("providers"));
	};

	const [drop, setDrop] = useState<any[]>([]);
	const [organizations, setOrganizations] = useState<Organization[]>([]);
	const [idProvider, setIdProvider] = useState<number>();

	useEffect(() => {
		const drop = organizations?.map((org) => ({
			value: org.idOrganization,
			name: org.nameOrganization,
			label: org.nameOrganization,
		}));

		setDrop(drop);
	}, [organizations]);

	/*const handleSearch = (value: string) => {
		console.log(value);
		if (value && value.length > 0) {
			Rest<{ type: string; inputValue: String }, any>()
				.operation({ type: "SelectOrganizationsByName", inputValue: value })
				.then((response) => {
					console.log(response);
					setOrganizations(response);
				});
		} else {
			setOrganizations([]);
		}
	};*/

	const selectProvider = (idProvider: number | undefined) => {
		setIdProvider(idProvider);
	};

	return (
		<>
			<Form
				size="large"
				layout="vertical"
				className="form__smaller-margin"
				form={form}
				style={{ width: "100%" }}>
				<Form.Item name="typeStatus" label={t("typeStatus")}>
					<Select placeholder={t("filterTypeStatusPlaceholder")}>
						<Option
							key={enumAppointmentStatusNew.CONFIRMED}
							value={enumAppointmentStatusNew.CONFIRMED}
							label={t("appointment:" + enumAppointmentStatusNew.CONFIRMED)}>
							<span>
								<FontAwesomeIcon
									icon={faCircle}
									className={"confirmed"}
									style={{ marginRight: "8px" }}
								/>
								{t("appointmentStatus:" + enumAppointmentStatusNew.CONFIRMED)}
							</span>
						</Option>
						<Option
							key={enumAppointmentStatusNew.CANCELLED}
							value={enumAppointmentStatusNew.CANCELLED}
							label={t("appointmentStatus:" + enumAppointmentStatusNew.CANCELLED)}>
							<span>
								<FontAwesomeIcon
									icon={faCircle}
									className={"cancelled"}
									style={{ marginRight: "8px" }}
								/>
								{t("appointmentStatus:" + enumAppointmentStatusNew.CANCELLED)}
							</span>
						</Option>
						<Option
							key={enumAppointmentStatusNew.PROPOSED}
							value={enumAppointmentStatusNew.PROPOSED}
							label={t("appointmentStatus:" + enumAppointmentStatusNew.PROPOSED)}>
							<span>
								<FontAwesomeIcon
									icon={faCircle}
									className={"proposed"}
									style={{ marginRight: "8px" }}
								/>
								{t("appointmentStatus:" + enumAppointmentStatusNew.PROPOSED)}
							</span>
						</Option>
						<Option
							key={enumAppointmentStatusNew.DONE}
							value={enumAppointmentStatusNew.DONE}
							label={t("appointmentStatus:" + enumAppointmentStatusNew.DONE)}>
							<span>
								<FontAwesomeIcon
									icon={faCircle}
									className={"other-status"}
									style={{ marginRight: "8px" }}
								/>
								{t("appointmentStatus:" + enumAppointmentStatusNew.DONE)}
							</span>
						</Option>
						<Option
							key={enumAppointmentStatusNew.PENDING_PAYMENT}
							value={enumAppointmentStatusNew.PENDING_PAYMENT}
							label={t("appointmentStatus:" + enumAppointmentStatusNew.PENDING_PAYMENT)}>
							<span>
								<FontAwesomeIcon
									icon={faCircle}
									className={"payment"}
									style={{ marginRight: "8px" }}
								/>
								{t("appointmentStatus:" + enumAppointmentStatusNew.PENDING_PAYMENT)}
							</span>
						</Option>
						<Option
							key={enumAppointmentStatusNew.EXPIRED_PROPOSAL}
							value={enumAppointmentStatusNew.EXPIRED_PROPOSAL}
							label={t("appointmentStatus:" + enumAppointmentStatusNew.EXPIRED_PROPOSAL)}>
							<span>
								<FontAwesomeIcon
									icon={faCircle}
									className={"other-status"}
									style={{ marginRight: "8px" }}
								/>
								{t("appointmentStatus:" + enumAppointmentStatusNew.EXPIRED_PROPOSAL)}
							</span>
						</Option>
						<Option
							key={enumAppointmentStatusNew.NOT_DONE}
							value={enumAppointmentStatusNew.NOT_DONE}
							label={t("appointmentStatus:" + enumAppointmentStatusNew.NOT_DONE)}>
							<span>
								<FontAwesomeIcon
									icon={faCircle}
									className={"other-status"}
									style={{ marginRight: "8px" }}
								/>
								{t("appointmentStatus:" + enumAppointmentStatusNew.NOT_DONE)}
							</span>
						</Option>
					</Select>
				</Form.Item>
				<Form.Item name="providers" label={t("providers")}>
					{
						<ProvidersDropDown
							filterProviders={props.filterProviders}
							idProviderSelected={idProvider}
							providers={props.providers}
							selectProvider={selectProvider}
						/>
						/*<Select
						placeholder={t("filterProvidersPlaceholder")}
						options={drop}
						showSearch
						defaultActiveFirstOption={false}
						allowClear
						filterOption={(inputValue, option) =>
							option!.name.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
						}
						onSearch={handleSearch}
					notFoundContent={null}></Select>*/
					}
				</Form.Item>
			</Form>
			<Row gutter={16}>
				<Col span={12}>
					<Button
						type="primary"
						block
						onClick={() =>
							props.applyFilters!(form.getFieldValue("typeStatus"), form.getFieldValue("providers"))
						}>
						{t("apply")}
					</Button>
				</Col>
				<Col span={12}>
					<Button danger block onClick={resetFilters}>
						{t("reset")}
					</Button>
				</Col>
			</Row>
		</>
	);
};

export default AppointmentsFilter;

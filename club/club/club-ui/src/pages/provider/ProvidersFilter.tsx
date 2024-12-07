import { faCircle, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Col, Form, Row, Select, SelectProps, Input } from "antd";
import { Option } from "rc-select";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Provider from "types/entities/Provider";
import cx from "classnames";
import { Rest } from "utils/utils";
import enumPrestadorScheduleStatus from "types/enums/EnumPrestadorScheduleStatus";
import _, { update } from "lodash";
import { OptionType } from "dayjs";
import "./Provider.scss";
import Organization from "types/entities/Organization";
import OrganizationsDropdown from "components/filterDropdowns/organizationsDropdown/OrganizationsDropdown";

interface IProps {
	providers: Provider[];
	idOrganization?: number;
	applyFilters: (offset?:number, typeStatus?: boolean, nameProvider?: string, idOrganization?:number) => void;
	setNameProvider: (NameProvider?: string) => void;
	setIdOrganization: (idOrganization?: number) => void;
	setTypeStatus: (typeStatus?: boolean) => void;
}

const ProvidersFilter = (props: IProps) => {
	const [form] = Form.useForm();
	const [organizations, setOrganizations] = useState<Organization[]>([]);
	const { t } = useTranslation("providerFilter");

	const resetFilters = () => {
		form.resetFields();
		apply();
	};

	const apply = () => {
		props.setNameProvider(form.getFieldValue("providers"));
		props.setTypeStatus(form.getFieldValue("typeStatus"));
		props.setIdOrganization(form.getFieldValue("organizacion"));
		props.applyFilters!(0,form.getFieldValue("typeStatus"), form.getFieldValue("providers"), props.idOrganization);
	};


	const searchFilterOrganization = _.debounce((inputValue: string) => handleSearchOrganization(inputValue), 500);

	const handleSearchOrganization = (inputValue: String) => {
		if (inputValue !== "" && inputValue.length >= 3){
			Rest<{ type: string; inputValue: String}, Organization[]>()
				.operation({ 
					type: "SelectOrganizationsByName",
					inputValue:  inputValue})
				.then((response) => {
					setOrganizations(response);
				});
		}
		
	};

	const loadOrganizations = () => {
		Rest<{ type: string }, any>()
			.operation({ type: "SelectOrganizations" })
			.then((response) => {
				setOrganizations(response);
			});
	}

	useEffect(()=>{
		loadOrganizations();
	},[props.idOrganization]);
 
	return (
		<>
			<Form
				size="large"
				layout="vertical"
				className="form__smaller-margin"
				form={form}
				style={{ width: "100%" }}>
				<Form.Item name="typeStatus" label={t("typeStatus")}>
				<Select placeholder={t("filterTypeStatusPlaceholder")} allowClear>
						<Option
							key={enumPrestadorScheduleStatus.ACTIVE}
							value={true}
							label={t("providers" + enumPrestadorScheduleStatus.ACTIVE)}>
							<span>
								<FontAwesomeIcon
									icon={faCircle}
									className={"confirmed"}
									style={{ marginRight: "8px" }}
								/>
								{t("scheduleTypeACTIVE")}
							</span>
						</Option>
						<Option
							key={enumPrestadorScheduleStatus.INACTIVE}
							value={false}
							label={t("providers" + enumPrestadorScheduleStatus.INACTIVE)}>
							<span>
								<FontAwesomeIcon
									icon={faCircle}
									className={"cancelled"}
									style={{ marginRight: "8px" }}
								/>
								{t("scheduleTypeINACTIVE")}
							</span>
						</Option>
					</Select>
				</Form.Item>
				<Form.Item name="providers" label={t("providers")}>
					<Input>
					</Input>
				</Form.Item>
				<Form.Item name="organizacion" label={t("organization")}>
					<OrganizationsDropdown
						idOrganizationSelected={props.idOrganization}
						organizations={organizations}
						onChangeSearch={props.setIdOrganization}
						filterOptions={searchFilterOrganization}
					/>
				</Form.Item>
			</Form>

			<Row gutter={16}>
				<Col span={12}>
					<Button
						type="primary"
						block
						onClick={() =>
							apply()
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

export default ProvidersFilter;
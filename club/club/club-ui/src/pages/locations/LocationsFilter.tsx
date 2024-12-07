import { Button, Col, Form, Input, Row } from "antd";
import OrganizationsDropdown from "components/filterDropdowns/organizationsDropdown/OrganizationsDropdown";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Organization from "types/entities/Organization";
import { Rest } from "utils/utils";

interface IProps {
	applyFilters: (name?: string, idOrganization?: number) => void;
	filtersLoading: boolean;
}

const LocationsFilter = (props: IProps) => {
	const [form] = Form.useForm();
	const { t } = useTranslation("locationsFilter");

	const [organizations, setOrganizations] = useState<Organization[]>();
	const [loaded, setLoaded] = useState<boolean>();
	const [idOrganizationSelected, setIdOrganizationSelected] = useState<number | undefined>(
		undefined
	);

	useEffect(() => {
		loadOrganizations();
	}, []);

	const resetFilters = () => {
		form.resetFields();
		props.applyFilters!(form.getFieldValue("name"), undefined);
	};

	const loadOrganizations = () => {
		Rest<{ type: string }, any>()
			.operation({ type: "SelectOrganizations" })
			.then((response) => {
				setOrganizations(response);
				setLoaded(true);
			});
	};

	const filterOptions = (inputValue: String) => {
		if (inputValue !== "") {
			Rest<{ type: string; inputValue: String }, any>()
				.operation({ type: "SelectOrganizationsByName", inputValue: inputValue })
				.then((response) => {
					setOrganizations(response);
				});
		} else {
			loadOrganizations();
		}
	};

	const selectOrganization = (idOrganization: number) => {
		setIdOrganizationSelected(idOrganization);
	};

	return (
		<>
			<Form
				size="large"
				layout="vertical"
				className="form__smaller-margin"
				form={form}
				style={{ width: "100%" }}>
				<Form.Item name="name" label={t("name")}>
					<Input></Input>
				</Form.Item>
				<Form.Item label={t("organization")}>
					<OrganizationsDropdown
						idOrganizationSelected={idOrganizationSelected}
						organizations={organizations}
						onChangeSearch={selectOrganization}
						filterOptions={filterOptions}
					/>
				</Form.Item>
			</Form>
			<Row gutter={16}>
				<Col span={12}>
					<Button
						type="primary"
						block
						onClick={() => {
							props.applyFilters!(form.getFieldValue("name"), idOrganizationSelected);
						}}
						loading={props.filtersLoading}>
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

export default LocationsFilter;

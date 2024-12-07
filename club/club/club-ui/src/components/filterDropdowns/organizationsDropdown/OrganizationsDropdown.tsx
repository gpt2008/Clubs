import { Select } from "antd";
import { DefaultOptionType } from "antd/es/select";
import cx from "classnames";
import _ from "lodash";
import { CSSProperties, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Organization from "types/entities/Organization";

const OrganizationsDropdown = (props: {
	idOrganizationSelected?: number;
	organizations?: Organization[];
	onChangeSearch: (idOrganization: number) => void;
	filterOptions: (inputValue: string) => void;
	defaultOrgId?: number;
	style?: CSSProperties;
}) => {
	const { t } = useTranslation(["agendasSchedule"]);

	const [drop, setDrop] = useState<DefaultOptionType[]>([]);

	useEffect(() => {
		const updated = props.organizations?.map((organization) => ({
			value: organization.idOrganization,
			name: organization.nameOrganization,
			label: (
				<div className="providers-dropdown" key={organization.idOrganization}>
					<div className="providers-dropdown-item">
						<div
							className={cx("header--providers-dropdown-selector", {
								selected: props.idOrganizationSelected === organization.idOrganization,
							})}>
							<div
								className={cx("providers-name", {
									selected: props.idOrganizationSelected === organization.idOrganization,
								})}>
								{organization.nameOrganization}
							</div>
						</div>
					</div>
				</div>
			),
		}));
		if (updated) {
			setDrop(updated);
		}
	}, [props.organizations, props.idOrganizationSelected]);

	const searchNameProvider = _.debounce((value: string) => {
		if (value){
			props.filterOptions(value);
		}
		else {
			props.filterOptions(" ");
		}
	}, 500);

	useEffect(() => {
		props.onChangeSearch(props.defaultOrgId!)
    },[]);

	return (
		<Select
			size="large"
			style={props.style}
			autoFocus
			options={drop}
			filterOption={false}
			showSearch
			allowClear
			value={props.idOrganizationSelected}
			placement="bottomLeft"
			placeholder={t("inputOrg")}
			defaultValue={props.defaultOrgId}
			onChange={(idOrganization) => {
				props.onChangeSearch(idOrganization);
			}}
			onSearch={(inputValue) => {
				searchNameProvider(inputValue);
			}}
			onClear={() => {
				searchNameProvider(" ");
			}}
		/>
	);
};

export default OrganizationsDropdown;

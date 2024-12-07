import { Select } from "antd";
import { DefaultOptionType } from "antd/es/select";
import _ from "lodash";
import { CSSProperties, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import SubspecialityDetails from "types/entities/SubEspecialidad";

const SubspecialitiesDropdown = (props: {
	idSubspecialitySelected?: number;
	subspecialities?: SubspecialityDetails[];
	idSpeciality?:number;
    filterOptions: (inputValue: string, idSpeciality?:number) => void;
	onChangeSearch: (idSubspeciality?: number) => void;
	disabled?: boolean;
	style?: CSSProperties;
}) => {
	const { t } = useTranslation(["specialityForm"]);

    const [drop, setDrop] = useState<DefaultOptionType[]>([]);

	useEffect(() => {
		const updated = props.subspecialities?.map((subspeciality) => ({
			value: subspeciality.idSubspeciality,
			name: subspeciality.nameSubspeciality,
			label: (
				<div className="providers-dropdown" key={subspeciality.idSubspeciality}>
					<div className="providers-dropdown-item">
						{subspeciality.codeSubspeciality} - {subspeciality.nameSubspeciality}
					</div>
				</div>
			),
		}));
		if (updated) {
			setDrop(updated);
		}
	}, [props.subspecialities, props.idSubspecialitySelected]);

    
    const searchNameSubspeciality = _.debounce((value: string) => {
		if (value){
			props.filterOptions(value, props.idSpeciality);
		}
		else {
			props.filterOptions("");
		}
	}, 500);

	return (
		<Select
			size="large"
			style={props.style}
			options={drop}
            filterOption={false}
			showSearch
			allowClear
			value={props.idSubspecialitySelected}
			placement="bottomLeft"
			placeholder={t("nameLabel")}
			defaultValue={props.idSubspecialitySelected}
			onChange={(idSubspeciality) => {
				props.onChangeSearch(idSubspeciality);
			}}
            onSearch={(inputValue) => {
				searchNameSubspeciality(inputValue);
			}}
			onClear={() => {
				props.onChangeSearch(undefined);
                searchNameSubspeciality("");
			}}
			disabled={props.disabled ? props.disabled : false}
		/>
	);
};

export default SubspecialitiesDropdown;

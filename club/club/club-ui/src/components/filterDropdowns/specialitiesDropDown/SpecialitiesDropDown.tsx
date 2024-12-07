import { Select } from "antd";
import { DefaultOptionType } from "antd/es/select";
import _ from "lodash";
import { CSSProperties, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import SpecialityDetails from "types/entities/Especialidad";

const SpecialitiesDropdown = (props: {
	idSpecialitySelected?: number;
	specialities?: SpecialityDetails[];
    filterOptions: (inputValue: string) => void;
	onChangeSearch: (idSpeciality?: number) => void;
	style?: CSSProperties;
}) => {
	const { t } = useTranslation(["specialityForm"]);

    const [drop, setDrop] = useState<DefaultOptionType[]>([]);

	useEffect(() => {
		const updated = props.specialities?.map((speciality) => ({
			value: speciality.idSpeciality,
			name: speciality.nameSpeciality,
			label: (
				<div className="providers-dropdown" key={speciality.idSpeciality}>
					<div className="providers-dropdown-item">
					{speciality.codeSpeciality} - {speciality.nameSpeciality}
					</div>
				</div>
			),
		}));
		if (updated) {
			setDrop(updated);
		}
	}, [props.specialities, props.idSpecialitySelected]);

    
    const searchNameSpeciality = _.debounce((value: string) => {
		if (value){
			props.filterOptions(value);
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
			value={props.idSpecialitySelected}
			placement="bottomLeft"
			placeholder={t("nameLabel")}
			defaultValue={props.idSpecialitySelected}
			onChange={(idSpeciality) => {
				props.onChangeSearch(idSpeciality);
			}}
            onSearch={(inputValue) => {
				searchNameSpeciality(inputValue);
			}}
			onClear={() => {
				props.onChangeSearch(undefined);
                searchNameSpeciality("");
			}}
		/>
	);
};

export default SpecialitiesDropdown;

import { Select } from "antd";
import { DefaultOptionType } from "antd/es/select";
import _ from "lodash";
import { CSSProperties, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ActsDetails from "types/entities/Actos";

const ActsDropdown = (props: {
	idActSelected?: number;
	acts?: ActsDetails[];
    filterOptions: (inputValue: string) => void;
	onChangeSearch: (idAct?: number) => void;
	style?: CSSProperties;
}) => {
	const { t } = useTranslation(["actsForm"]);

    const [drop, setDrop] = useState<DefaultOptionType[]>([]);

	useEffect(() => {
		const updated = props.acts?.map((act) => ({
			value: act.idAct,
			name: act.nameAct,
			label: (
				<div className="providers-dropdown" key={act.idAct}>
					<div className="providers-dropdown-item">
						{act.codeAct} - {act.nameAct}
					</div>
				</div>
			),
		}));
		if (updated) {
			setDrop(updated);
		}
	}, [props.acts, props.idActSelected]);

    
    const searchNameAct = _.debounce((value: string) => {
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
			value={props.idActSelected}
			placement="bottomLeft"
			placeholder={t("nameLabel")}
			defaultValue={props.idActSelected}
			onChange={(idActSelected) => {
				props.onChangeSearch(idActSelected);
			}}
            onSearch={(inputValue) => {
				searchNameAct(inputValue);
			}}
			onClear={() => {
				props.onChangeSearch(undefined);
                searchNameAct("");
			}}
		/>
	);
};

export default ActsDropdown;

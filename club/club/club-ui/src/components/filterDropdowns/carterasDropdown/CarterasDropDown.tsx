import { Select } from "antd";
import { DefaultOptionType } from "antd/es/select";
import _ from "lodash";
import { CSSProperties, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CarterasDetails from "types/entities/Carteras";

const CarterasDropdown = (props: {
	idCarterasSelected?: number[];
	carteras?: CarterasDetails[];
    filterOptions: (inputValue: string) => void;
	onChangeSearch: (idProduct: number[]) => void;
	style?: CSSProperties;
}) => {
	const { t } = useTranslation(["carterasList"]);

    const [drop, setDrop] = useState<DefaultOptionType[]>([]);

	useEffect(() => {
		const updated = props.carteras?.map((cartera) => ({
			value: cartera.idCartera,
			name: cartera.nameCartera,
			label: (
				<div className="providers-dropdown" key={cartera.idCartera}>
					<div style={{height: "2.2rem", flexDirection: "row", display: "flex", alignItems: "center" }}>
						{cartera.nameCartera}
					</div>
				</div>
			),
		}));
		if (updated) {
			setDrop(updated);
		}
	}, [props.carteras, props.idCarterasSelected]);

    
    const searchNameCarteras = _.debounce((value: string) => {
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
            mode="multiple"
            allowClear
            placeholder={t("nameCartera")}
			options={drop}
			showSearch
			style={props.style}
            filterOption={false}
			placement="bottomLeft"
			defaultValue={props.idCarterasSelected}
			onChange={(idCartera:number[]) => {
				props.onChangeSearch(idCartera);
			}}
            onSearch={(inputValue) => {
				searchNameCarteras(inputValue);
			}}
			onClear={() => {
                searchNameCarteras("");
			}}
		/>
	);
};

export default CarterasDropdown;

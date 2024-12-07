import { Select } from "antd";
import { DefaultOptionType } from "antd/es/select";
import _ from "lodash";
import { CSSProperties, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {Precios} from "types/entities/Precios";

const PreciosDropdown = (props: {
	idPreciosSelected?: number[];
	precios?: Precios[];
    filterOptions: (inputValue: string) => void;
	onChangeSearch: (idProduct: number[]) => void;
	style?: CSSProperties;
}) => {
	const { t } = useTranslation(["preciosList"]);

    const [drop, setDrop] = useState<DefaultOptionType[]>([]);

	useEffect(() => {
		const updated = props.precios?.map((precio) => ({
			value: precio.idPrecio,
			name: precio.namePrecio,
			label: (
				<div className="providers-dropdown" key={precio.idPrecio}>
					<div style={{height: "2.2rem", flexDirection: "row", display: "flex", alignItems: "center" }}>
						{precio.namePrecio}
					</div>
				</div>
			),
		}));
		if (updated) {
			setDrop(updated);
		}
	}, [props.precios, props.idPreciosSelected]);

    const searchNamePrecio = _.debounce((value: string) => {
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
            mode= "multiple"
            allowClear
            placeholder={t("namePrecio")}
			options={drop}
			showSearch
			style={props.style}
            filterOption={false}
			placement="bottomLeft"
			defaultValue={props.idPreciosSelected}
			onChange={(idPrecio:number[]) => {
				props.onChangeSearch(idPrecio);
			}}
            onSearch={(inputValue) => {
				searchNamePrecio(inputValue);
			}}
			onClear={() => {
                searchNamePrecio("");
			}}
		/>
	);
};

export default PreciosDropdown;

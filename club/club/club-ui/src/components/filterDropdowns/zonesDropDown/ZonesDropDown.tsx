import { Select } from "antd";
import { DefaultOptionType } from "antd/es/select";
import _ from "lodash";
import { CSSProperties, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ZonasDetails from "types/entities/Zonas";

const ZonesDropdown = (props: {
	idZoneSelected?: number;
	zones?: ZonasDetails[];
	onChangeSearch: (idZone?: number) => void;
	style?: CSSProperties;
}) => {
	const { t } = useTranslation(["productosList"]);

    const [drop, setDrop] = useState<DefaultOptionType[]>([]);

	useEffect(() => {
		const updated = props.zones?.map((zone) => ({
			value: zone.idZona,
			name: zone.nameZona,
			label: (
				<div className="providers-dropdown" key={zone.idZona}>
					<div style={{height: "2.2rem", flexDirection: "row", display: "flex", alignItems: "center" }}>
						{zone.nameZona}
					</div>
				</div>
			),
		}));
		if (updated) {
			setDrop(updated);
		}
	}, [props.zones, props.idZoneSelected]);

    
    /*const searchNameZone = _.debounce((value: string) => {
		if (value){
			props.filterOptions(value);
		}
		else {
			props.filterOptions("");
		}
	}, 500);*/

	return (
		<Select
			size="large"
            allowClear
            placeholder={t("nameZone")}
			options={drop}
			showSearch
			style={props.style}
            //filterOption={false}
			placement="bottomLeft"
			defaultValue={props.idZoneSelected}
            filterOption={(input, option) =>
                ("" + option?.label).toUpperCase().includes(input.toUpperCase())
            }
			onChange={(idZone:number) => {
				props.onChangeSearch(idZone);
			}}
            /*onSearch={(inputValue) => {
				searchNameZone(inputValue);
			}}*/
			onClear={() => {
                props.onChangeSearch(undefined);
                //searchNameZone("");
			}}
		/>
	);
};

export default ZonesDropdown;

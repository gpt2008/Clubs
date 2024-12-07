import { Select } from "antd";
import { DefaultOptionType } from "antd/es/select";
import _ from "lodash";
import { CSSProperties, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ProductosDetails from "types/entities/Producto";

const ProductsDropdown = (props: {
	idProductSelected?: number[];
	products?: ProductosDetails[];
    filterOptions: (inputValue: string) => void;
	onChangeSearch: (idProduct: number[]) => void;
	style?: CSSProperties;
}) => {
	const { t } = useTranslation(["productosList"]);

    const [drop, setDrop] = useState<DefaultOptionType[]>([]);

	useEffect(() => {
		const updated = props.products?.map((product) => ({
			value: product.idProducto,
			name: product.nameProducto,
			label: (
				<div className="providers-dropdown" key={product.idProducto}>
					<div style={{height: "2.2rem", flexDirection: "row", display: "flex", alignItems: "center" }}>
						{product.codeProducto} - {product.nameProducto}
					</div>
				</div>
			),
		}));
		if (updated) {
			setDrop(updated);
		}
	}, [props.products, props.idProductSelected]);

    
    const searchNameProduct = _.debounce((value: string) => {
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
            placeholder={t("nameProducto")}
			options={drop}
			showSearch
			style={props.style}
            filterOption={false}
			placement="bottomLeft"
			defaultValue={props.idProductSelected}
			onChange={(idProduct:number[]) => {
				props.onChangeSearch(idProduct);
			}}
            onSearch={(inputValue) => {
				searchNameProduct(inputValue);
			}}
			onClear={() => {
                searchNameProduct("");
			}}
		/>
	);
};

export default ProductsDropdown;

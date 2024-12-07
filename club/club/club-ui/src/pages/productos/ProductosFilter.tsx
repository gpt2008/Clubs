import { Button, Col, Form, Row, Input } from "antd";
import ActsDropdown from "components/filterDropdowns/actsDropdown/ActsDropDown";
import SpecialitiesDropdown from "components/filterDropdowns/specialitiesDropDown/SpecialitiesDropDown";
import SubspecialitiesDropdown from "components/filterDropdowns/subspecialitiesDropdown/SubspecialitiesDropDown";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import ActDetails from "types/entities/Actos";
import SpecialityDetails from "types/entities/Especialidad";
import SubspecialityDetails from "types/entities/SubEspecialidad";

interface IProps {
	applyFilters: (offset?:number, NameProduct?: string, idGarantias?: number[]) => void;
	setNameProduct: (NameProduct?: string) => void;
	filterComparison?:boolean;

	idSpeciality?: number;
    idSubspeciality?: number;
    idAct?: number;
    idGarantia?: number[];
	specialities?: SpecialityDetails[];
	subspecialities?: SubspecialityDetails[];
	acts?: ActDetails[];
	onfilterOptionsSpeciality?: (inputValue: string) => void;
    onChangeSpeciality?: (idSpecialitySelected?: number) => void;
    onfilterOptionsSubspeciality?: (inputValue: string) => void;
    onChangeSubspeciality?: (idSubspecialitySelected?: number) => void;
    onfilterOptionsAct?: (inputValue: string) => void;
    onChangeAct?: (idActSelected?: number) => void;
	onfilterOptionsGarantias?: (inputValue: string) => void;
    onChangeGarantias?: (idGarantiaSelected: number[]) => void;
}

const ProductosFilter = (props: IProps) => {
	const [form] = Form.useForm();
	const { t } = useTranslation("productosList");

	const resetFilters = () => {
		form.resetFields();
		props.onChangeGarantias && props.onChangeGarantias([]);
		apply([]);
	};

	const apply = (idGarantias?: number[]) => {
		props.setNameProduct(form.getFieldValue("product"));
		props.onChangeSpeciality && props.onChangeSpeciality(form.getFieldValue("nameSpeciality"));
		props.onChangeSubspeciality && props.onChangeSubspeciality(form.getFieldValue("nameSubspeciality"));
		props.onChangeAct && props.onChangeAct(form.getFieldValue("nameAct"));
		props.applyFilters!(0, form.getFieldValue("product"), idGarantias ? idGarantias : props.idGarantia);
	};

	// Si filterComparison = true, se carga el filtro con Specilaity, Subspeciality, Act
    // Si es = false | undefined se carga el filtro con nameProduct y garantia, 
	return (<> 
	 	{ props.filterComparison ? (
			<Form layout="vertical" form={form} size="large">
				<Form.Item label={t("specialityForm:nameLabel")} name="nameSpeciality">
					<SpecialitiesDropdown
						idSpecialitySelected={props.idSpeciality}
						specialities={props.specialities}
						filterOptions={props.onfilterOptionsSpeciality ? props.onfilterOptionsSpeciality : () => {}}
						onChangeSearch={props.onChangeSpeciality ? props.onChangeSpeciality : () => {}}
					/>
				</Form.Item>
				<Form.Item label={t("subspecialityForm:nameLabel")} name="nameSubspeciality" >
					<SubspecialitiesDropdown
						idSubspecialitySelected={props.idSubspeciality}
						subspecialities={props.subspecialities}
						filterOptions={props.onfilterOptionsSubspeciality ? props.onfilterOptionsSubspeciality : () => {}}
						onChangeSearch={props.onChangeSubspeciality ? props.onChangeSubspeciality : () => {}}
					/>
				</Form.Item>
				<Form.Item label={t("actsForm:nameLabel")} name="nameAct" >
					<ActsDropdown
						idActSelected={props.idAct}
						acts={props.acts}
						filterOptions={props.onfilterOptionsAct ? props.onfilterOptionsAct : () => {}}
						onChangeSearch={props.onChangeAct ? props.onChangeAct : () => {}}
					/>
				</Form.Item>
			</Form>
		) : (
			<>
				<Form
					size="large"
					layout="vertical"
					className="form__smaller-margin"
					form={form}
					style={{ width: "100%" }}>
					<Form.Item name="product" label={t("nameProducto")}>
						<Input>
						</Input>
					</Form.Item>
					<Form.Item name="garantia" label={t("nameGarantia")}>
					<SpecialitiesDropdown
						idSpecialitySelected={props.idSpeciality}
						specialities={props.specialities}
						filterOptions={props.onfilterOptionsSpeciality ? props.onfilterOptionsSpeciality : () => {}}
						onChangeSearch={props.onChangeSpeciality ? props.onChangeSpeciality : () => {}}
					/>
					</Form.Item>
				</Form>
			</>
		)}
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

export default ProductosFilter;
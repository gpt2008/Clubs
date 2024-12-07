import { Button, Col, Form, Row, Input } from "antd";
import SpecialitiesDropdown from "components/filterDropdowns/specialitiesDropDown/SpecialitiesDropDown";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import CarterasDetails from "types/entities/Carteras";
import SpecialityDetails from "types/entities/Especialidad";

interface IProps {
	carteras: CarterasDetails[];
	applyFilters: (offset?:number, NameCartera?: string, idGarantia?:number) => void;
	setNameCartera: (NameCartera?: string) => void;
    setNameGarantia: (NameGarantia?: string) => void;
	idGarantia?: number;
	speciality: SpecialityDetails[];
	filterOptions: (inputValue: string) => void;
  	onChangeSearch: (idGarantia?: number) => void;
}

const CarterasFilter = (props: IProps) => {
	const [form] = Form.useForm();
	const { t } = useTranslation("carterasFilter");

	const resetFilters = () => {
		form.resetFields();
		props.applyFilters!(0, form.getFieldValue("carteras"), undefined);
	};

	const apply = () => {
		props.setNameCartera(form.getFieldValue("carteras"));
		props.applyFilters!(0, form.getFieldValue("carteras"), props.idGarantia);
	};
	
	useEffect(()=> {props.filterOptions("")},[props.idGarantia])

	return (
		<>
			<Form
				size="large"
				layout="vertical"
				className="form__smaller-margin"
				form={form}
				style={{ width: "100%" }}>
				<Form.Item name="carteras" label={t("carteras")}>
					<Input>
					</Input>
				</Form.Item>
                <Form.Item name="garantias" label={t("garantias")}>
				<SpecialitiesDropdown
					idSpecialitySelected={props.idGarantia}
					specialities={props.speciality}
					filterOptions={props.filterOptions}
					onChangeSearch={props.onChangeSearch}
            	/>
				</Form.Item>
			</Form>
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

export default CarterasFilter;
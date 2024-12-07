import { Button, Col, Form, Row, Input } from "antd";
import { useTranslation } from "react-i18next";
import SubspecialityDetails from "types/entities/SubEspecialidad";
import SpecialitiesDropdown from "components/filterDropdowns/specialitiesDropDown/SpecialitiesDropDown";
import SpecialityDetails from "types/entities/Especialidad";
import { useEffect } from "react";

interface IProps {
	subspecialities: SubspecialityDetails[];
	applyFilters: (offset?:number, NameSubspeciality?: string, idSpeciality?: number) => void;
	setNameSubspeciality: (NameSubspeciality?: string) => void;
	idSpeciality?: number;
	specialities?: SpecialityDetails[];
  	filterOptions: (inputValue: string) => void;
	onChangeSearch: (idSpeciality?: number) => void;
}

const SubspecialityFilter = (props: IProps) => {
	const [form] = Form.useForm();
	const { t } = useTranslation("subspecialityFilter");

	const resetFilters = () => {
		form.resetFields();
		props.onChangeSearch(undefined);
		props.applyFilters!(0, form.getFieldValue("subspeciality"), undefined);
	};

	const apply = () => {
		props.setNameSubspeciality(form.getFieldValue("subspeciality"));
		props.applyFilters!(0, form.getFieldValue("subspeciality"), props.idSpeciality);
	};
	
	useEffect(()=> {props.filterOptions("")},[props.idSpeciality])

	return (
		<>
			<Form
				size="large"
				layout="vertical"
				className="form__smaller-margin"
				form={form}
				style={{ width: "100%" }}>
				<Form.Item label={t("nameSpeciality")} name="nameSpeciality">
          			<SpecialitiesDropdown
					idSpecialitySelected={props.idSpeciality}
					specialities={props.specialities}
					filterOptions={props.filterOptions}
					onChangeSearch={props.onChangeSearch}
					/>
				</Form.Item>
				<Form.Item name="subspeciality" label={t("subspeciality")}>
					<Input>
					</Input>
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

export default SubspecialityFilter;
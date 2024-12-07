import { Button, Col, Form, Row, Input } from "antd";
import { useTranslation } from "react-i18next";
import SpecialityDetails from "types/entities/Especialidad";

interface IProps {
	specialities: SpecialityDetails[];
	applyFilters: (offset?:number, NameSpeciality?: string) => void;
	setNameSpeciality: (NameSpeciality?: string) => void;
}

const SpecialityFilter = (props: IProps) => {
	const [form] = Form.useForm();
	const { t } = useTranslation("specialityFilter");

	const resetFilters = () => {
		form.resetFields();
		apply();
	};

	const apply = () => {
		props.setNameSpeciality(form.getFieldValue("speciality"));
		props.applyFilters!(0, form.getFieldValue("speciality"));
	};

	return (
		<>
			<Form
				size="large"
				layout="vertical"
				className="form__smaller-margin"
				form={form}
				style={{ width: "100%" }}>
				<Form.Item name="speciality" label={t("speciality")}>
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

export default SpecialityFilter;
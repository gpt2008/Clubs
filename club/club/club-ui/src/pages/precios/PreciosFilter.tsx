import { Button, Col, Form, Row, Input } from "antd";
import i18n from "i18n/i18n";

interface IProps {
	applyFilters: (offset?:number, NamePrecio?: string) => void;
	setNamePrecios: (NamePrecio?: string) => void;
}

const PreciosFilter = (props: IProps) => {
	const [form] = Form.useForm();

	const resetFilters = () => {
		form.resetFields();
		apply();
	};

	const apply = () => {
		props.setNamePrecios(form.getFieldValue("precio"));
		props.applyFilters!(0, form.getFieldValue("precio"));
	};
	

	return (
		<>
			<Form
				size="large"
				layout="vertical"
				className="form__smaller-margin"
				form={form}
				style={{ width: "100%" }}>
				<Form.Item name="precio" label={i18n.t("preciosList:title")}>
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
						{i18n.t("buttons:apply")}
					</Button>
				</Col>
				<Col span={12}>
					<Button danger block onClick={resetFilters}>
						{i18n.t("buttons:reestablecer")}
					</Button>
				</Col>
			</Row>
        </>
	);
};

export default PreciosFilter;
import { Button, Col, Form, Row, Input } from "antd";
import { useTranslation } from "react-i18next";
import InvoiceDetails from "types/entities/Invoice";

interface IProps {
	invoice?: InvoiceDetails[];
	applyFilters: (offset?:number, nif?: string, nameClient?: string) => void;
	setNif: (nif?: string) => void;
	setNameClient: (nameClient?: string) => void;
}

const InvoiceFilter = (props: IProps) => {
	const [form] = Form.useForm();
	const { t } = useTranslation("invoiceList");

	const resetFilters = () => {
		form.resetFields();
		apply();
	};

	const apply = () => {
		props.setNif(form.getFieldValue("nif"));
		props.setNameClient(form.getFieldValue("nameClient"));
		props.applyFilters!(0, form.getFieldValue("nif"), form.getFieldValue("nameClient"));
	};
	

	return (
		<>
			<Form
				size="large"
				layout="vertical"
				className="form__smaller-margin"
				form={form}
				style={{ width: "100%" }}>
				<Form.Item name="nif" label={t("dni")}>
					<Input>
					</Input>
				</Form.Item>
				<Form.Item name="nameClient" label={t("nameClient")}>
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
						{t("buttons:apply")}
					</Button>
				</Col>
				<Col span={12}>
					<Button danger block onClick={resetFilters}>
						{t("buttons:reestablecer")}
					</Button>
				</Col>
			</Row>
        </>
	);
};

export default InvoiceFilter;
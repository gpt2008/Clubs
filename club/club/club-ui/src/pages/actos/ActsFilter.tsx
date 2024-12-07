import { Button, Col, Form, Row, Input } from "antd";
import { useTranslation } from "react-i18next";
import ActDetails from "types/entities/Actos";

interface IProps {
	acts: ActDetails[];
	applyFilters: (offset?:number, NameAct?: string, CodeAct?: string) => void;
	setNameAct: (NameAct?: string) => void;
	setCodeAct: (CodeAct?: string) => void;
}

const ActsFilter = (props: IProps) => {
	const [form] = Form.useForm();
	const { t } = useTranslation("actsFilter");

	const resetFilters = () => {
		form.resetFields();
		apply();
	};

	const apply = () => {
		props.setNameAct(form.getFieldValue("acts"));
		props.setCodeAct(form.getFieldValue("code"));
		props.applyFilters!(0, form.getFieldValue("acts"), form.getFieldValue("code"));
	};
	

	return (
		<>
			<Form
				size="large"
				layout="vertical"
				className="form__smaller-margin"
				form={form}
				style={{ width: "100%" }}>
				<Form.Item name="code" label={t("code")}>
					<Input>
					</Input>
				</Form.Item>
				<Form.Item name="acts" label={t("acts")}>
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

export default ActsFilter;
import { Button, Col, DatePicker, Form, Row } from "antd";
import ProvidersDropDown from "components/filterDropdowns/providersDropdown/ProvidersDropdown";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Provider from "types/entities/Provider";

interface IProps {
	providers: Provider[];
	applyFilters: (providerId?: number, dateCompletado?: Date, dateAppointment?: Date) => void;
	filterProviders: (inputValue: string, idOrganization?: number) => void;
}

const QuestionnaireAnswersFilter = (props: IProps) => {
	const { t } = useTranslation("questionnaireAnswersFilter");

	const [idProvider, setIdProvider] = useState<number>();
	const selectProvider = (idProvider: number | undefined) => {
		setIdProvider(idProvider);
	};
	const [form] = Form.useForm();
	const resetFilters = () => {
		form.resetFields();
		props.applyFilters!(
			form.getFieldValue("providerId"),
			form.getFieldValue("dateCompletado"),
			form.getFieldValue("dateAppointment")
		);
	};

	return (
		<>
			<Form form={form} layout="vertical">
				<Form.Item name="providerId" label={t("provider")}>
					<ProvidersDropDown
						filterProviders={props.filterProviders}
						idProviderSelected={idProvider}
						providers={props.providers}
						selectProvider={selectProvider}
					/>
				</Form.Item>
				<Form.Item name="dateCompletado" label={t("dateCompletado")}>
					<DatePicker></DatePicker>
				</Form.Item>
				<Form.Item name="dateAppointment" label={t("dateAppointment")}>
					<DatePicker></DatePicker>
				</Form.Item>
			</Form>
			<Row gutter={16}>
				<Col span={12}>
					<Button
						type="primary"
						block
						onClick={() => {
							props.applyFilters!(
								idProvider,
								form.getFieldValue("dateCompletado"),
								form.getFieldValue("dateAppointment")
							);
						}}>
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

export default QuestionnaireAnswersFilter;

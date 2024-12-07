import { Col, Form, Input, Row, Select } from "antd";
import { FormInstance } from "antd/lib/form";
import Modal from "antd/lib/modal/Modal";
import { Option } from "rc-select";
import { useTranslation } from "react-i18next";
import enumEstimatedTimeUnits from "types/enums/enumEstimatedTimeUnits";
import { IState } from "./QuestionGroupFormContainer";

const QuestionGroupForm = (
	props: {
		idQuestionGroup?: number;
		visible?: boolean;
		onCancel: () => void;
		validateAndSave: (form: FormInstance) => void;
	} & IState
) => {
	const [form] = Form.useForm();

	const { t } = useTranslation(["questionnaireForm"]);

	const typeOptions = (type: number) => {
		return (
			<Option key={type} value={type} label={t("estimatedTimeUnits:" + type)}>
				{t("estimatedTimeUnits:" + type)}
			</Option>
		);
	};

	const initialValues = props.questionGroupData && {
		questionGroupTitle: props.questionGroupData.nameGrupo,
		timeToComplete: props.questionGroupData.valueTiempoEstimado,
		timeUnits: props.questionGroupData.valueUnidadTiempoEstimado,
	};

	return (
		<Modal
			title={
				<span>
					{props.idQuestionGroup ? t("editQuestionGroupTitle") : t("newQuestionGroupTitle")}
				</span>
			}
			style={{ top: 40 }}
			onOk={() => props.validateAndSave(form)}
			onCancel={props.onCancel}
			visible={props.visible}
			destroyOnClose
			width="30rem"
			okText={t("buttons:save")}
			cancelText={t("buttons:cancel")}>
			<Form layout="vertical" form={form} size="large" initialValues={initialValues}>
				<Row gutter={12}>
					<Col span={24}>
						<Form.Item
							label={t("questionGroupTitleField")}
							name="questionGroupTitle"
							rules={[{ required: true }]}>
							<Input maxLength={256} />
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={12}>
					<Col span={12}>
						<Form.Item
							label={t("timeToCompleteField")}
							name="timeToComplete"
							rules={[{ required: true }]}>
							<Input maxLength={256} />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item name="timeUnits" label={t("timeUnitsField")} rules={[{ required: true }]}>
							<Select
								filterOption={(input, option) =>
									("" + option?.label).toUpperCase().includes(input.toUpperCase())
								}>
								{typeOptions(enumEstimatedTimeUnits.SECONDS)}
								{typeOptions(enumEstimatedTimeUnits.MINUTES)}
								{typeOptions(enumEstimatedTimeUnits.HOURS)}
							</Select>
						</Form.Item>
					</Col>
				</Row>
			</Form>
		</Modal>
	);
};

export default QuestionGroupForm;

import { Col, Form, Input, Row, Select } from "antd";
import { FormInstance } from "antd/lib/form";
import TextArea from "antd/lib/input/TextArea";
import Modal from "antd/lib/modal/Modal";
import { Option } from "rc-select";
import { useTranslation } from "react-i18next";
import enumQuestionnaireType from "types/enums/enumQuestionnaireType";
import { IState as IStateContainer } from "./QuestionnaireEditionFormContainer";

const QuestionnaireEditionForm = (
	props: {
		idQuestionnaire?: number;
		visible?: boolean;
		onCancel: () => void;
		validateAndSave: (form: FormInstance) => void;
	} & IStateContainer
) => {
	const [form] = Form.useForm();

	const { t } = useTranslation(["questionnaireForm"]);

	const typeOptions = (type: number) => {
		return (
			<Option key={type} value={type} label={t("questionnaireType:" + type)}>
				{t("questionnaireType:" + type)}
			</Option>
		);
	};

	const initialValues = props.questionnaireData && {
		nameQuestionnaire: props.questionnaireData.nameCuestionario,
		typeQuestionnaire: props.questionnaireData.typeCuestionario,
		descStartMessage: props.questionnaireData.descMensajeInicial,
		descEndMessage: props.questionnaireData.descMensajeFinal,
	};

	return (
		<Modal
			title={
				<span>
					{props.idQuestionnaire ? t("editQuestionnaireTitle") : t("newQuestionnaireTitle")}
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
							label={t("questionnaireNameField")}
							name="nameQuestionnaire"
							rules={[{ required: true }]}>
							<Input maxLength={256} />
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={12}>
					<Col span={24}>
						<Form.Item
							name="typeQuestionnaire"
							label={t("questionnaireTypeField")}
							rules={[{ required: true }]}>
							<Select
								filterOption={(input, option) =>
									("" + option?.label).toUpperCase().includes(input.toUpperCase())
								}>
								{typeOptions(enumQuestionnaireType.INITIAL_QUESTIONNAIRE)}
								{typeOptions(enumQuestionnaireType.EVALUATION_QUESTIONNAIRE)}
								{typeOptions(enumQuestionnaireType.TASK_QUESTIONNAIRE)}
							</Select>
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={12}>
					<Col span={24}>
						<Form.Item label={t("descStartMessage")} name="descStartMessage">
							<TextArea rows={5} style={{ resize: "none" }} />
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={12}>
					<Col span={24}>
						<Form.Item label={t("descEndMessage")} name="descEndMessage">
							<TextArea rows={5} style={{ resize: "none" }} />
						</Form.Item>
					</Col>
				</Row>
			</Form>
		</Modal>
	);
};

export default QuestionnaireEditionForm;

import { Col, Form, Input, Row } from "antd";
import { FormInstance } from "antd/lib/form";
import Modal from "antd/lib/modal/Modal";
import { useTranslation } from "react-i18next";
import { IState } from "./QuestionFormContainer";

const QuestionForm = (
	props: {
		idQuestion?: number;
		visible?: boolean;
		onCancel: () => void;
		validateAndSave: (form: FormInstance) => void;
	} & IState
) => {
	const [form] = Form.useForm();

	const { t } = useTranslation(["questionnaireForm"]);

	const initialValues = props.questionData && {
		questionTitle: props.questionData.namePregunta,
	};

	return (
		<Modal
			title={<span>{props.idQuestion ? t("editQuestionTitle") : t("newQuestionTitle")}</span>}
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
							label={t("questionNameField")}
							name="questionTitle"
							rules={[{ required: true }]}>
							<Input maxLength={256} />
						</Form.Item>
					</Col>
				</Row>
			</Form>
		</Modal>
	);
};

export default QuestionForm;

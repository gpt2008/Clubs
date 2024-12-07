
import { Button, Col, Form, FormInstance, Input, Row, Space } from "antd";
import { useTranslation } from "react-i18next";
import FormUtils from "utils/formUtils";
import  FormErrorField from  "utils/form/formErrorField";

const UpdatePassewordForm = (props: {
    form: FormInstance;
    errorFields?: FormErrorField[];
    changePassword?: boolean;
    setupPassword : (form:FormInstance) => void;
}) => {

    const { t } = useTranslation(['changePassword']);

    return (
        <>
            <Form
				form={props.form}
				layout="vertical"
				size="large"
				onFinish={() => props.setupPassword(props.form)}>
                    {props.changePassword &&
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    label={t("password")}
                                    name="password"
                                    rules={[{ required: true }]}
                                    validateStatus={FormUtils.isError('password', props.errorFields) ? 'error' : undefined}
                                    help={FormUtils.getErrorMessage('password', props.errorFields)}
                                >
                                    <Input.Password />
                                </Form.Item>
                            </Col>
                        </Row>
                    }
				    <Row gutter={16}>
						<Col span={24}>
							<Form.Item
								label={t("newPasswords")}
								name="newPassword"
								rules={[{ required: true }]}
								validateStatus={FormUtils.isError('newPassword', props.errorFields) ? 'error' : undefined}
								help={FormUtils.getErrorMessage('newPassword', props.errorFields)}
							>
							    <Input.Password />
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={16}>
						<Col span={24}>
							<Form.Item
								label={t("repeatPassword")}
								name="repeatedPassword"
								rules={[{ required: true }]}
								validateStatus={FormUtils.isError('repeatedPassword', props.errorFields) ? 'error' : undefined}
								help={FormUtils.getErrorMessage('repeatedPassword', props.errorFields)}
							>
								<Input.Password />
							</Form.Item>
						</Col>
					</Row>
					<Row justify="center">
						<Col>
							<Space>
								<Button htmlType="submit" type="primary" size="middle">
									{t("createPassword")}
								</Button>
							</Space>
						</Col>
					</Row>
			</Form>
        </>
    );
};

export default UpdatePassewordForm;
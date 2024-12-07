import { Col, Form, Input, Row, Space, message } from "antd";
import { useTranslation } from "react-i18next";
import { PersonaMascotaInfo } from "types/entities/Appointment";

interface IProps {
	personaMascotaData: PersonaMascotaInfo;
	column?: boolean;
}

interface IFormFields {
	Diagnostico: string;
	Tratamiento: string;
	Seguimiento: boolean;
	Comentarios: string;
	Documentos: string;
}

function PetInfoStep(props: IProps) {
	const { t } = useTranslation("registerStep");

	const [messageApi, contextHolder] = message.useMessage();

	return (
		<>
			<Form layout="horizontal" style={{ width: "100%" }}>
				<Row gutter={32} className="form__row">
					<Col span={24}>
						<Form.Item<IFormFields> name="Diagnostico">
							<Space.Compact block>
								<Input
									className="form__row__input--label--Aux"
									defaultValue={t("diagnosis")}
									disabled
								/>
								<Input
									className="form__row__input--text--Aux"
									value={props.personaMascotaData.nameDiagnostico}
									disabled
								/>
							</Space.Compact>
						</Form.Item>
					</Col>
				</Row>
				<Row gutter={32} className="form__row">
					<Col span={24}>
						<Form.Item<IFormFields> name="Tratamiento" rules={[{ required: true }]}>
							<Space.Compact block>
								<Input
									className="form__row__input--label--Aux"
									defaultValue={t("treatment")}
									disabled
								/>
								<Input
									className="form__row__input--text--Aux"
									value={props.personaMascotaData.nameTratamiento}
									disabled
								/>
							</Space.Compact>
						</Form.Item>
					</Col>
				</Row>
				{/*<Row gutter={32} className="form__row">
          <Col span={12}>
            <Form.Item<IFormFields> name="Seguimiento">
              <Space.Compact block>
                <Input
                  className="form__row__input--label--Aux"
                  defaultValue={t("follow-up")}
                  disabled
                  hidden
                />
                <Input
                  className="form__row__input--text--Aux"
                  value={""}
                  disabled
                  hidden
                />
              </Space.Compact>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item<IFormFields> name="Documentos">
              <Space.Compact block>
                <Input
                  className="form__row__input--label--Aux"
                  defaultValue={t("documents")}
                  disabled
                  hidden
                />
                <Input
                  className="form__row__input--text--Aux"
                  value={"si/no"}
                  disabled
                  hidden
                />
              </Space.Compact>
            </Form.Item>
          </Col>
        </Row>*/}
				<Row gutter={32} className="form__row">
					<Col span={24}>
						<Form.Item<IFormFields> name="Comentarios">
							<Space.Compact block>
								<Input
									className="form__row__input--label--Aux"
									defaultValue={t("coments")}
									disabled
								/>
								<Input.TextArea
									className="form__row__input--text--Aux"
									value={props.personaMascotaData.valueIndicaciones}
									disabled
								/>
							</Space.Compact>
						</Form.Item>
					</Col>
				</Row>
			</Form>
		</>
	);
}

export default PetInfoStep;

import { Col, Form, Input, Row, Space, message } from "antd";
import { useTranslation } from "react-i18next";
import { PersonaMascotaInfo } from "types/entities/Appointment";

interface IProps {
	personaMascotaData: PersonaMascotaInfo;
	column?: boolean;
}

interface IFormFields {
	petName: string;
	petType: number;
	petBreed: number;
}

function PetInfoStep(props: IProps) {
	const { t } = useTranslation("petStep");

	const [messageApi, contextHolder] = message.useMessage();

	return !props.column ? (
		<>
			<Form layout="horizontal">
				<Row gutter={32} className="form__row">
					<Col span={8}>
						<Form.Item<IFormFields> name="petName" rules={[{ required: true }]}>
							<Space.Compact block>
								<Input className="form__row__input--label" defaultValue={t("nameLabel")} disabled />
								<Input
									className="form__row__input--text"
									value={props.personaMascotaData.nameMascota}
									disabled
								/>
							</Space.Compact>
						</Form.Item>
					</Col>
					<Col span={8}>
						<Form.Item<IFormFields> name="petType" rules={[{ required: true }]}>
							<Space.Compact block>
								<Input className="form__row__input--label" defaultValue={t("specie")} disabled />
								<Input
									className="form__row__input--text"
									value={props.personaMascotaData.nameEspecie}
									disabled
								/>
							</Space.Compact>
						</Form.Item>
					</Col>
					<Col span={8}>
						<Form.Item<IFormFields> name="petBreed">
							<Space.Compact block>
								<Input className="form__row__input--label" defaultValue={t("race")} disabled />
								<Input
									className="form__row__input--text"
									value={props.personaMascotaData.nameRaza}
									disabled
								/>
							</Space.Compact>
						</Form.Item>
					</Col>
				</Row>
			</Form>
		</>
	) : (
		<>
			<Form layout="vertical" style={{ width: "100%" }}>
				<Row gutter={32} className="form__row">
					<Col span={12}>
						<Form.Item<IFormFields> name="petName" rules={[{ required: true }]}>
							<Space.Compact block>
								<Input className="form__row__input--label" defaultValue={t("nameLabel")} disabled />
								<Input
									className="form__row__input--text"
									value={props.personaMascotaData.nameMascota}
									disabled
								/>
							</Space.Compact>
						</Form.Item>
					</Col>

					<Col span={12}>
						<Form.Item<IFormFields> name="petType" rules={[{ required: true }]}>
							<Space.Compact block>
								<Input className="form__row__input--label" defaultValue={t("specie")} disabled />
								<Input
									className="form__row__input--text"
									value={props.personaMascotaData.nameEspecie}
									disabled
								/>
							</Space.Compact>
						</Form.Item>
					</Col>
				</Row>
				<Row gutter={32} className="form__row">
					<Col span={24}>
						<Form.Item<IFormFields> name="petBreed">
							<Space.Compact block>
								<Input className="form__row__input--label" defaultValue={t("race")} disabled />
								<Input
									className="form__row__input--text"
									value={props.personaMascotaData.nameRaza}
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

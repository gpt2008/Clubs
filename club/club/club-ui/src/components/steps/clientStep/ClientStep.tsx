import { Col, Form, Input, Row, Space, message } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PersonaMascotaInfo } from "types/entities/Appointment";
import { Client } from "types/entities/Client";

interface IProps {
	personaMascotaData: PersonaMascotaInfo;
	column?: boolean;
}

interface IFormFields {
	namePerson: string;
	nameSurname1: string;
	nameSurname2: string;
	dni: string;
	phone: string;
	email: string;
	password: string;
	dataAuthorization: string;
	thirdPartyAuthorization: string;
}

function ClientStep(props: IProps) {
	const { t } = useTranslation("clientStep");

	const [messageApi, contextHolder] = message.useMessage();
	const [persona, setPersona] = useState<Client>();

	return !props.column ? (
		<>
			<Form layout="horizontal">
				<Row gutter={32} className="form__row">
					<Col span={8}>
						<Form.Item<IFormFields>
							name="namePerson"
							rules={[{ required: true, message: t("specifyName") }]}
							initialValue={props.personaMascotaData.namePerson}>
							<Space.Compact block>
								<Input className="form__row__input--label" defaultValue={t("nameLabel")} disabled />
								<Input
									className="form__row__input--text"
									value={props.personaMascotaData.namePerson}
									disabled
								/>
							</Space.Compact>
						</Form.Item>
					</Col>
					<Col span={8}>
						<Form.Item<IFormFields>
							name="nameSurname1"
							rules={[
								{
									required: true,
									message: t("specifySur"),
								},
							]}
							initialValue={props.personaMascotaData.apellido1}>
							<Space.Compact block>
								<Input
									className="form__row__input--label"
									defaultValue={t("nameSurname1Label")}
									disabled
								/>
								<Input
									className="form__row__input--text"
									value={props.personaMascotaData.apellido1}
									disabled
								/>
							</Space.Compact>
						</Form.Item>
					</Col>
					<Col span={8}>
						<Form.Item<IFormFields>
							name="nameSurname2"
							rules={[{ required: true }]}
							initialValue={props.personaMascotaData.apellido2}>
							<Space.Compact block>
								<Input
									className="form__row__input--label"
									defaultValue={t("nameSurname2Label")}
									disabled
								/>
								<Input
									className="form__row__input--text"
									value={props.personaMascotaData.apellido2}
									disabled
								/>
							</Space.Compact>
						</Form.Item>
					</Col>
				</Row>
				<Row gutter={32} className="form__row">
					<Col span={8}>
						<Form.Item<IFormFields> name="phone" initialValue={props.personaMascotaData.valuePhone}>
							<Space.Compact block>
								<Input
									className="form__row__input--label"
									defaultValue={t("phoneLabel")}
									disabled
								/>
								<Input
									className="form__row__input--text"
									value={props.personaMascotaData.valuePhone}
									disabled
								/>
							</Space.Compact>
						</Form.Item>
					</Col>
					<Col span={16}>
						<Form.Item<IFormFields>
							name="email"
							rules={[
								{
									required: true,
									message: t("specifyUser"),
								},
							]}
							initialValue={props.personaMascotaData.valueEmail}>
							<Space.Compact
								style={{
									width: "100%",
								}}
								block>
								<Input className="form__row__input--label" defaultValue={t("mail")} disabled />

								<Input
									className="form__row__input--text"
									value={props.personaMascotaData.valueEmail}
									disabled
								/>
							</Space.Compact>
						</Form.Item>
					</Col>
				</Row>
			</Form>
		</>
	) : (
		<Form layout="vertical" style={{ width: "100%" }}>
			<Row gutter={32} className="form__row">
				<Col span={12}>
					<Form.Item<IFormFields>
						name="namePerson"
						rules={[{ required: true, message: "Debe especificar un nombre" }]}
						initialValue={props.personaMascotaData.namePerson}>
						<Space.Compact block>
							<Input className="form__row__input--label" defaultValue={t("nameLabel")} disabled />
							<Input
								className="form__row__input--text"
								value={props.personaMascotaData.namePerson}
								disabled
							/>
						</Space.Compact>
					</Form.Item>
				</Col>
				<Col span={12}>
					<Form.Item<IFormFields>
						name="nameSurname1"
						rules={[
							{
								required: true,
								message: "Debe especificar el primer apellido",
							},
						]}
						initialValue={props.personaMascotaData.apellido1}>
						<Space.Compact block>
							<Input
								className="form__row__input--label"
								defaultValue={t("nameSurname1Label")}
								disabled
							/>
							<Input
								className="form__row__input--text"
								value={props.personaMascotaData.apellido1}
								disabled
							/>
						</Space.Compact>
					</Form.Item>
				</Col>
			</Row>
			<Row gutter={32} className="form__row">
				<Col span={12}>
					<Form.Item<IFormFields>
						name="nameSurname2"
						rules={[{ required: true }]}
						initialValue={props.personaMascotaData.apellido2}>
						<Space.Compact block>
							<Input
								className="form__row__input--label"
								defaultValue={t("nameSurname2Label")}
								disabled
							/>
							<Input
								className="form__row__input--text"
								value={props.personaMascotaData.apellido2}
								disabled
							/>
						</Space.Compact>
					</Form.Item>
				</Col>
				<Col span={12}>
					<Form.Item<IFormFields> name="phone" initialValue={props.personaMascotaData.valuePhone}>
						<Space.Compact block>
							<Input className="form__row__input--label" defaultValue={t("phoneLabel")} disabled />
							<Input
								className="form__row__input--text"
								value={props.personaMascotaData.valuePhone}
								disabled
							/>
						</Space.Compact>
					</Form.Item>
				</Col>
			</Row>
			<Row gutter={32} className="form__row">
				<Col span={24}>
					<Form.Item<IFormFields>
						name="email"
						rules={[
							{
								required: true,
								message: t("specifyUser"),
							},
						]}
						initialValue={props.personaMascotaData.valueEmail}>
						<Space.Compact
							style={{
								width: "100%",
							}}
							block>
							<Input className="form__row__input--label" defaultValue={t("mail")} disabled />

							<Input
								className="form__row__input--text"
								value={props.personaMascotaData.valueEmail}
								disabled
							/>
						</Space.Compact>
					</Form.Item>
				</Col>
			</Row>
		</Form>
	);
}

export default ClientStep;

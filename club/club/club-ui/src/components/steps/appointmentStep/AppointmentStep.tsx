import { Col, Form, Input, Row, Space } from "antd";
import { useTranslation } from "react-i18next";
import { PersonaMascotaInfo } from "types/entities/Appointment";

interface IProps {
	personaMascotaData: PersonaMascotaInfo;
	column?: boolean;
}

interface IFormFields {
	type: string;
	reason: string;
	channel: string;
	comment: string;
}

const AppointmentStep = (props: IProps) => {
	const { t } = useTranslation("appointmentStep");
	return !props.column ? (
		<>
			<Form layout="horizontal">
				<Row gutter={32} className="form__row">
					<Col span={12}>
						<Form.Item<IFormFields> name="type" rules={[{ required: true }]}>
							<Space.Compact block>
								<Input className="form__row__input--label" defaultValue={t("type")} disabled />
								<Input
									className="form__row__input--text"
									value={props.personaMascotaData.nameActo}
									disabled
								/>
							</Space.Compact>
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item<IFormFields> name="reason" rules={[{ required: true }]}>
							<Space.Compact block>
								<Input className="form__row__input--label" defaultValue={t("reason")} disabled />
								<Input
									className="form__row__input--text"
									value={props.personaMascotaData.nameReason}
									disabled
								/>
							</Space.Compact>
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item<IFormFields> name="channel">
							<Space.Compact block>
								<Input className="form__row__input--label" defaultValue={t("channel")} disabled />
								<Input className="form__row__input--text" value="Videoconsulta" disabled />
							</Space.Compact>
						</Form.Item>
					</Col>
				</Row>
				<Row gutter={32} className="form__row">
					<Col span={24}>
						<Form.Item<IFormFields> name="comment">
							<Space.Compact block>
								<Input
									className="form__row__input--label"
									defaultValue={t("observations")}
									disabled
								/>
								<Input
									className="form__row__input--text"
									value={props.personaMascotaData.userComment}
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
						<Form.Item<IFormFields> name="type" rules={[{ required: true }]}>
							<Space.Compact block>
								<Input className="form__row__input--label" defaultValue={t("type")} disabled />
								<Input
									className="form__row__input--text"
									value={props.personaMascotaData.nameActo}
									disabled
								/>
							</Space.Compact>
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item<IFormFields> name="reason" rules={[{ required: true }]}>
							<Space.Compact block>
								<Input className="form__row__input--label" defaultValue={t("reason")} disabled />
								<Input
									className="form__row__input--text"
									value={props.personaMascotaData.nameReason}
									disabled
								/>
							</Space.Compact>
						</Form.Item>
					</Col>
				</Row>
				<Row className="form__row">
					<Col span={24}>
						<Form.Item<IFormFields> name="channel">
							<Space.Compact block>
								<Input className="form__row__input--label" defaultValue={t("channel")} disabled />
								<Input className="form__row__input--text" value="Videoconsulta" disabled />
							</Space.Compact>
						</Form.Item>
					</Col>
				</Row>
				<Row className="form__row">
					<Col span={24}>
						<Form.Item<IFormFields> name="comment">
							<Space.Compact block>
								<Input
									className="form__row__input--label"
									defaultValue={t("observations")}
									disabled
								/>
								<Input
									className="form__row__input--text"
									value={props.personaMascotaData.userComment}
									disabled
								/>
							</Space.Compact>
						</Form.Item>
					</Col>
				</Row>
			</Form>
		</>
	);
};

export default AppointmentStep;

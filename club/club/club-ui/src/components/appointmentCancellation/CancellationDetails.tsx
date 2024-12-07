import { useState } from "react";

import {
	Button,
	Checkbox,
	Col,
	DatePicker,
	Form,
	FormInstance,
	Modal,
	Row,
	Select,
	Steps,
	Table,
} from "antd";
import TextArea from "antd/lib/input/TextArea";
import dayjs from "dayjs";
import { Option } from "rc-select";
import { AlignType } from "rc-table/lib/interface";
import { useTranslation } from "react-i18next";
import {
	default as AppointmentAlternative,
	default as AppointmentData,
} from "types/entities/Appointment";
import enumAppointmentCancellationProposal from "types/enums/EnumAppointmentCancellationProposal";
import enumAppointmentCancellationProposedDate from "types/enums/EnumAppointmentCancellationProposedDate";
import enumAppointmentCancellationReason from "types/enums/EnumAppointmentCancellationReason";
import { Functions } from "../../utils/utils";
import { IState as IStateContainer } from "./CancellationDetailsContainer";

interface IProps {
	visible?: boolean;
	appointments?: AppointmentData[];
	limit?: number;
	dateFilter?: any;
	onCancel: () => void;
	goBack: () => void;
	nextStep: (form: FormInstance) => void;
	dateRender: (record: AppointmentData) => void;
	statusRender: (typeStatus: number) => void;
	getAlternativeAppointment: (form: FormInstance) => void;
	cancelledByManager?: boolean;
}

const CancellationDetails = (props: IProps & IStateContainer) => {
	const { t } = useTranslation(["appointmentCancellation"]);

	const { Step } = Steps;

	const [form] = Form.useForm();

	const footer = (
		<>
			{props.step > 0 && <Button onClick={props.goBack}>{t("buttons:back")}</Button>}
			<Button type="primary" onClick={() => props.nextStep(form)}>
				{props.step === 0 ? t("buttons:next") : t("buttons:save")}
			</Button>
		</>
	);

	return (
		<Modal
			open={props.visible}
			onCancel={props.onCancel}
			footer={footer}
			style={{ top: 40 }}
			destroyOnClose
			width={props.step === 0 ? 700 : 1200}>
			<div>
				<Row justify="center" style={{ marginBottom: "2rem" }}>
					<div className="cancellation-steps">
						<Steps size="small" current={props.step}>
							<Step title={t("detailsStep")} />
							<Step title={t("alternativePropStep")} />
						</Steps>
					</div>
				</Row>
				<Row>
					{props.step === 0 ? (
						<FirstStep form={form} cancelledByManager={props.cancelledByManager} />
					) : (
						<SecondStep
							key={props.tableKey}
							form={form}
							appointments={props.appointments}
							limit={props.limit}
							dateFilter={props.dateFilter}
							alternatives={props.alternatives}
							dateRender={props.dateRender}
							statusRender={props.statusRender}
							getAlternativeAppointment={props.getAlternativeAppointment}
						/>
					)}
				</Row>
			</div>
		</Modal>
	);
};

const FirstStep = (props: { form: FormInstance; cancelledByManager?: boolean }) => {
	const { t } = useTranslation(["appointmentCancellation"]);

	return (
		<Form layout="vertical" form={props.form} size="large">
			<Form.Item
				label={t("cancellationReasonLabel")}
				name="cancellationReasonType"
				initialValue={
					props.cancelledByManager ? enumAppointmentCancellationReason.PROVIDER_ISSUES : undefined
				}
				rules={[{ required: true }]}>
				<Select style={{ width: "250px" }} disabled={props.cancelledByManager}>
					<Option
						key={enumAppointmentCancellationReason.CANCELLED_BY_PATIENT}
						value={enumAppointmentCancellationReason.CANCELLED_BY_PATIENT}
						label={t(
							"appointmentCancellationReasons:" +
								enumAppointmentCancellationReason.CANCELLED_BY_PATIENT
						)}>
						{t(
							"appointmentCancellationReasons:" +
								enumAppointmentCancellationReason.CANCELLED_BY_PATIENT
						)}
					</Option>
					<Option
						key={enumAppointmentCancellationReason.CANCELLED_BY_PROVIDER}
						value={enumAppointmentCancellationReason.CANCELLED_BY_PROVIDER}
						label={t(
							"appointmentCancellationReasons:" +
								enumAppointmentCancellationReason.CANCELLED_BY_PROVIDER
						)}>
						{t(
							"appointmentCancellationReasons:" +
								enumAppointmentCancellationReason.CANCELLED_BY_PROVIDER
						)}
					</Option>
					<Option
						key={enumAppointmentCancellationReason.PATIENT_DID_NOT_SHOW_UP}
						value={enumAppointmentCancellationReason.PATIENT_DID_NOT_SHOW_UP}
						label={t(
							"appointmentCancellationReasons:" +
								enumAppointmentCancellationReason.PATIENT_DID_NOT_SHOW_UP
						)}>
						{t(
							"appointmentCancellationReasons:" +
								enumAppointmentCancellationReason.PATIENT_DID_NOT_SHOW_UP
						)}
					</Option>
					<Option
						key={enumAppointmentCancellationReason.PROVIDER_ISSUES}
						value={enumAppointmentCancellationReason.PROVIDER_ISSUES}
						label={t(
							"appointmentCancellationReasons:" + enumAppointmentCancellationReason.PROVIDER_ISSUES
						)}>
						{t(
							"appointmentCancellationReasons:" + enumAppointmentCancellationReason.PROVIDER_ISSUES
						)}
					</Option>
					<Option
						key={enumAppointmentCancellationReason.PATIENT_ISSUES}
						value={enumAppointmentCancellationReason.PATIENT_ISSUES}
						label={t(
							"appointmentCancellationReasons:" + enumAppointmentCancellationReason.PATIENT_ISSUES
						)}>
						{t(
							"appointmentCancellationReasons:" + enumAppointmentCancellationReason.PATIENT_ISSUES
						)}
					</Option>
					<Option
						key={enumAppointmentCancellationReason.OTHER}
						value={enumAppointmentCancellationReason.OTHER}
						label={t("appointmentCancellationReasons:" + enumAppointmentCancellationReason.OTHER)}>
						{t("appointmentCancellationReasons:" + enumAppointmentCancellationReason.OTHER)}
					</Option>
				</Select>
			</Form.Item>
			<Form.Item label={t("detailedReasonLabel")} name="cancellationReasonValue">
				<TextArea rows={4} style={{ resize: "none" }} />
			</Form.Item>
			<div style={{ marginBottom: "1rem" }}>{t("additionalInfo")}</div>
			<Form.Item valuePropName="checked" name="isAdditionalMessage" noStyle>
				<Checkbox>{t("additionalMessageLabel")}</Checkbox>
			</Form.Item>
			<Form.Item shouldUpdate noStyle>
				{() => (
					<Form.Item
						name="additionalMessage"
						noStyle
						hidden={!props.form.getFieldValue("isAdditionalMessage")}>
						<TextArea rows={4} style={{ resize: "none", marginTop: "1rem" }} />
					</Form.Item>
				)}
			</Form.Item>
		</Form>
	);
};

const SecondStep = (props: {
	form: FormInstance;
	appointments?: AppointmentData[];
	limit?: number;
	dateFilter?: any;
	alternatives?: AppointmentAlternative[];
	dateRender: (record: AppointmentData) => void;
	statusRender: (typeStatus: number) => void;
	getAlternativeAppointment: (form: FormInstance) => void;
}) => {
	const { t } = useTranslation(["oaAppointmentList"]);

	const oneAlternative =
		props.form.getFieldValue("alternativeProposal") ===
			enumAppointmentCancellationProposal.EARLIER_ALTERNATIVE ||
		props.form.getFieldValue("alternativeProposal") ===
			enumAppointmentCancellationProposal.ACCURATE_ALTERNATIVE;

	const twoAlternatives =
		props.form.getFieldValue("alternativeProposal") ===
		enumAppointmentCancellationProposal.BOTH_ALTERNATIVES;

	const columns: any[] = [
		{
			title: t("providerLocationColumn"),
			dataIndex: "namePrestador",
			ellipsis: true,
			align: "left" as AlignType,
			render: (namePrestador: string, record: AppointmentData) => {
				return namePrestador + " " + record.surname1Prestador + " / " + record.nameLocation;
			},
		},
		//{ title: t('locationColumn'), dataIndex: 'nameLocation', ellipsis: true, align: 'left' as AlignType},
		{
			title: t("dateColumn"),
			dataIndex: "dateAppointment",
			align: "left" as AlignType,
			width: "10rem",
			render: (dateAppointment: Date, record: AppointmentData) => props.dateRender(record),
		},
		{
			title: t("serviceColumn"),
			dataIndex: "nameSpeciality",
			ellipsis: true,
			align: "left" as AlignType,
			width: twoAlternatives ? "12rem" : "16rem",
			render: (nameSpeciality: string, record: AppointmentData) => {
				return nameSpeciality + " / " + record.nameService;
			},
		},
		{
			title: t("patientColumn"),
			dataIndex: "namePatient",
			ellipsis: true,
			width: twoAlternatives ? "10rem" : "12rem",
			align: "left" as AlignType,
			render: (namePatient: string, record: AppointmentData) => {
				return namePatient + " " + record.surname1Patient;
			},
		},
		{
			title: t("statusColumn"),
			dataIndex: "typeStatus",
			width: "8rem",
			align: "left" as AlignType,
			render: props.statusRender,
		},
	];

	if (oneAlternative) {
		columns.push({
			title: t("alternativeColumn"),
			ellipsis: true,
			align: "left" as AlignType,
			width: "10rem",
			render: (value: any, record: AppointmentData) =>
				alternativeRenderer(
					record,
					props.form.getFieldValue("alternativeProposal") ===
						enumAppointmentCancellationProposal.ACCURATE_ALTERNATIVE
				),
		});
	}

	if (twoAlternatives) {
		columns.push({
			title: t("alternative1Column"),
			ellipsis: true,
			align: "left" as AlignType,
			width: "10rem",
			render: (value: any, record: AppointmentData) => alternativeRenderer(record, false),
		});
		columns.push({
			title: t("alternative2Column"),
			ellipsis: true,
			align: "left" as AlignType,
			width: "10rem",
			render: (value: any, record: AppointmentData) => alternativeRenderer(record, true),
		});
	}

	const [page, setPage] = useState<number>();

	const onChangePage = (page: number) => {
		setPage(page);
	};

	const alternativeRenderer = (record: AppointmentData, accurate: boolean) => {
		const alternative = props.alternatives?.find(
			(alt) => alt.idAppointment === record.idAppointment && alt.accurate === accurate
		);
		if (!alternative?.dateAvailable) {
			return (
				<div className="not-available-date">{t("appointmentCancellation:dateNotAvailable")}</div>
			);
		}
		return (
			Functions.dateToString(alternative.dateAvailable) + ", " + alternative.valueTimeAvailable
		);
	};

	const initialValues = {
		alternativeProposal: enumAppointmentCancellationProposal.NO_PROPOSITION,
		proposedDateFrom: props.dateFilter || dayjs().add(1, "days"),
		proposedDate: 24,
	};

	const onChangeDate = (value: any) => {
		if (value) {
			props.getAlternativeAppointment(props.form);
		}
	};

	return (
		<div>
			<Form layout="vertical" form={props.form} size="large" initialValues={initialValues}>
				<Row gutter={8}>
					<Col span={8}>
						<Form.Item
							label={t("appointmentCancellation:alternativeProposalLabel")}
							name="alternativeProposal"
							rules={[{ required: true }]}>
							<Select onChange={() => props.getAlternativeAppointment(props.form)}>
								<Option
									key={enumAppointmentCancellationProposal.NO_PROPOSITION}
									value={enumAppointmentCancellationProposal.NO_PROPOSITION}>
									{t(
										"appointmentCancellationProposals:" +
											enumAppointmentCancellationProposal.NO_PROPOSITION
									)}
								</Option>
								<Option
									key={enumAppointmentCancellationProposal.EARLIER_ALTERNATIVE}
									value={enumAppointmentCancellationProposal.EARLIER_ALTERNATIVE}>
									{t(
										"appointmentCancellationProposals:" +
											enumAppointmentCancellationProposal.EARLIER_ALTERNATIVE
									)}
								</Option>
								<Option
									key={enumAppointmentCancellationProposal.ACCURATE_ALTERNATIVE}
									value={enumAppointmentCancellationProposal.ACCURATE_ALTERNATIVE}>
									{t(
										"appointmentCancellationProposals:" +
											enumAppointmentCancellationProposal.ACCURATE_ALTERNATIVE
									)}
								</Option>
								<Option
									key={enumAppointmentCancellationProposal.BOTH_ALTERNATIVES}
									value={enumAppointmentCancellationProposal.BOTH_ALTERNATIVES}>
									{t(
										"appointmentCancellationProposals:" +
											enumAppointmentCancellationProposal.BOTH_ALTERNATIVES
									)}
								</Option>
							</Select>
						</Form.Item>
					</Col>
					<Form.Item shouldUpdate noStyle>
						{() =>
							props.form.getFieldValue("alternativeProposal") &&
							props.form.getFieldValue("alternativeProposal") !==
								enumAppointmentCancellationProposal.NO_PROPOSITION && (
								<>
									<Col span={5}>
										<Form.Item
											label={t("appointmentCancellation:alternativeProposalDateLabel")}
											name="proposedDateFrom"
											rules={[{ required: true }]}>
											<DatePicker
												style={{ width: "100%" }}
												onChange={onChangeDate}
												disabledDate={(date) => date <= dayjs()}
											/>
										</Form.Item>
									</Col>
									<Col span={5}>
										<Form.Item
											label={t("appointmentCancellation:proposedDatedLabel")}
											name="proposedDate"
											rules={[{ required: true }]}>
											<Select>
												<Option key={enumAppointmentCancellationProposedDate.HOURS_24} value={24}>
													{t(
														"appointmentCancellationProposedDates:" +
															enumAppointmentCancellationProposedDate.HOURS_24
													)}
												</Option>
												<Option key={enumAppointmentCancellationProposedDate.HOURS_48} value={48}>
													{t(
														"appointmentCancellationProposedDates:" +
															enumAppointmentCancellationProposedDate.HOURS_48
													)}
												</Option>
												<Option key={enumAppointmentCancellationProposedDate.HOURS_72} value={72}>
													{t(
														"appointmentCancellationProposedDates:" +
															enumAppointmentCancellationProposedDate.HOURS_72
													)}
												</Option>
											</Select>
										</Form.Item>
									</Col>
								</>
							)
						}
					</Form.Item>
				</Row>
			</Form>
			<div className="table-container">
				<Table
					columns={columns}
					size="small"
					dataSource={props.appointments}
					rowKey="idAppointment"
					pagination={
						(props.appointments || []).length <= (props.limit || 0)
							? false
							: {
									hideOnSinglePage: true,
									position: ["bottomCenter"],
									current: page,
									pageSize: props.limit,
									total: props.appointments?.length,
									onChange: onChangePage,
							  }
					}
				/>
			</div>
		</div>
	);
};

export default CancellationDetails;

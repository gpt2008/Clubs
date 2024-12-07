import React from "react";

import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { faCalendarAlt, faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	Button,
	Checkbox,
	Col,
	DatePicker,
	Divider,
	Empty,
	Form,
	FormInstance,
	Input,
	Modal,
	Radio,
	Row,
	Select,
	Steps,
	TimePicker,
} from "antd";
import cx from "classnames";
import dayjs from "dayjs";
import { Option } from "rc-select";
import { useTranslation } from "react-i18next";
import ScheduleDaySlots, { DaySlot } from "types/entities/ScheduleDaySlots";
import enumPrestadorScheduleSlotConfigurationType from "types/enums/EnumPrestadorScheduleSlotConfigurationType";
import enumWeekDay from "types/enums/EnumWeekDay";
import { IState as IStateContainer } from "./ScheduleFormContainer";

interface IProps {
	visible?: boolean;
	nameProvider?: string;
	nameSchedule?: string;
	goBack: () => void;
	goNext: () => void;
	onChangeNameSchedule: (value?: string) => void;
	onChangeDateFrom: (date?: Date, dateString?: string) => void;
	onChangeCheckbox: (value: number, checked: boolean) => void;
	onChangeConfiguration: (value: number) => void;
	selectCopyConfiguration: (value: number) => void;
	addSlot: () => void;
	deleteSlot: (index: number) => void;
	onChangeSelects: (index: number, location?: number, portfolio?: number) => void;
	onChangeTimes: (index: number, date: string, timeFrom: boolean) => void;
	onChangeInterval: (index: number, value: number) => void;
	onChangeFlags: (index: number, flagGroup?: boolean, flagCon?: boolean, flagPay?: boolean) => void;
	onChangeParticipants: (index: number, value: number) => void;
	onCancel: () => void;
}

const ScheduleForm = (props: IProps & IStateContainer) => {
	const { t } = useTranslation(["scheduleForm"]);

	const [form] = Form.useForm();

	const { Step } = Steps;

	const footer = (
		<>
			{props.step > 0 && <Button onClick={props.goBack}>{t("buttons:back")}</Button>}
			<Button type="primary" onClick={props.goNext}>
				{t(
					props.step === 1 && props.subStep === props.slotsDays.length
						? "buttons:save"
						: "buttons:next"
				)}
			</Button>
		</>
	);

	return (
		<Modal
			title={
				<>
					<FontAwesomeIcon icon={faCalendarAlt} style={{ marginRight: "0.5rem" }} />
					<span>
						{t(props.nameSchedule ? "editScheduleTitle" : "newScheduleTitle", {
							nameProvider: props.nameProvider,
							scheduleName: props.nameSchedule,
						})}
					</span>
				</>
			}
			open={props.visible || false}
			footer={footer}
			onCancel={props.onCancel}
			destroyOnClose
			style={{ top: 40 }}
			width={700}>
			<Form layout="vertical" form={form} size="large" className="schedule-form__container">
				<Row>
					<Col span={7}>
						<Steps direction="vertical" size="small" current={props.step}>
							<Step title={t("dayStep")} />
							<Step
								title={t("slotStep")}
								description={
									<SecondStepDescription
										slotsDays={props.slotsDays}
										step={props.step}
										subStep={props.subStep}
									/>
								}
							/>
						</Steps>
					</Col>
					<Col span={17}>
						{props.step === 0 ? (
							<FirstStep
								form={form}
								slotsDays={props.slotsDays}
								nameSchedule={props.nameSchedule}
								dateFrom={props.dateFrom}
								errorNameSchedule={props.nameScheduleError}
								errorDateFrom={props.dateFromError}
								dateAlreadyUsedError={props.dateAlreadyUsedError}
								error={props.daySelectionError}
								onChangeNameSchedule={props.onChangeNameSchedule}
								onChangeDateFrom={props.onChangeDateFrom}
								onChangeCheckbox={props.onChangeCheckbox}
							/>
						) : (
							<SecondStep
								slotsDays={props.slotsDays}
								errors={props.errors}
								daySlots={props.slotsDays[props.subStep - 1]}
								selectedDays={props.slotsDays
									.filter(
										(sd) =>
											sd.configurationType === enumPrestadorScheduleSlotConfigurationType.CUSTOM
									)
									.map((sd) => sd.day)}
								locations={props.locations}
								portfolios={props.portfolios}
								subStep={props.subStep}
								onChangeConfiguration={props.onChangeConfiguration}
								selectCopyConfiguration={props.selectCopyConfiguration}
								addSlot={props.addSlot}
								deleteSlot={props.deleteSlot}
								onChangeSelects={props.onChangeSelects}
								onChangeTimes={props.onChangeTimes}
								onChangeInterval={props.onChangeInterval}
								onChangeFlags={props.onChangeFlags}
								onChangeParticipants={props.onChangeParticipants}
							/>
						)}
					</Col>
				</Row>
			</Form>
		</Modal>
	);
};

const FirstStep = (props: {
	form: FormInstance;
	slotsDays: ScheduleDaySlots[];
	nameSchedule?: string;
	dateFrom?: Date;
	errorNameSchedule: boolean;
	errorDateFrom: boolean;
	dateAlreadyUsedError: boolean;
	error: boolean;
	onChangeNameSchedule: (value?: string) => void;
	onChangeDateFrom: (date?: Date, dateString?: string) => void;
	onChangeCheckbox: (value: number, checked: boolean) => void;
}) => {
	const { t } = useTranslation(["scheduleForm"]);

	const disabledDateFrom = (current: any) => {
		return current.valueOf() < Date.now();
	};

	const onChangeNameSchedule = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		props.onChangeNameSchedule(value);
	};

	return (
		<>
			<div style={{ paddingBottom: "1rem" }}>
				<b>{t("daysSelectionTitle")}</b>
			</div>
			<Form.Item
				name="nameSchedule"
				label={t("nameScheduleField")}
				rules={[{ required: true }]}
				initialValue={props.nameSchedule}
				validateStatus={props.errorNameSchedule ? "error" : undefined}>
				<Input minLength={1} maxLength={256} onChange={onChangeNameSchedule} />
			</Form.Item>
			<Form.Item
				name="dateFrom"
				label={t("dateFromField")}
				rules={[{ required: true }]}
				initialValue={props.dateFrom ? dayjs(props.dateFrom) : undefined}
				validateStatus={props.errorDateFrom ? "error" : undefined}
				help={props.dateAlreadyUsedError ? t("dateAlreadyUsedError") : null}>
				<DatePicker
					disabledDate={disabledDateFrom}
					format="DD/MM/YYYY"
					style={{ width: "100%" }}
					onChange={(dayjs, dateString) =>
						props.onChangeDateFrom(dayjs?.toDate(), dateString.toString())
					}
				/>
			</Form.Item>
			<Form.Item
				name="days"
				style={{ marginBottom: "0" }}
				initialValue={props.slotsDays.map((sl) => sl.day)}
				validateStatus={props.error ? "error" : undefined}>
				<Checkbox.Group style={{ width: "100%" }}>
					<Row gutter={32} className="form__row">
						<Col span={32}>
							<WeekDays slotsDays={props.slotsDays} onChangeCheckbox={props.onChangeCheckbox} />
						</Col>
					</Row>
				</Checkbox.Group>
			</Form.Item>
		</>
	);
};

const WeekDays = (props: {
	slotsDays: ScheduleDaySlots[];
	onChangeCheckbox: (value: number, checked: boolean) => void;
}) => {
	const { t } = useTranslation(["scheduleForm"]);

	const days = [
		enumWeekDay.MONDAY,
		enumWeekDay.TUESDAY,
		enumWeekDay.WEDNESDAY,
		enumWeekDay.THURSDAY,
		enumWeekDay.FRIDAY,
		enumWeekDay.SATURDAY,
		enumWeekDay.SUNDAY,
	];

	const checkBoxes = days.map((day) => {
		return (
			<Row gutter={8} style={{ paddingTop: day !== enumWeekDay.MONDAY ? "0.5rem" : "" }}>
				<Checkbox value={day} onChange={(e: any) => props.onChangeCheckbox(day, e.target.checked)}>
					<span
						className={cx("slots-day-edition", {
							selected: props.slotsDays.some((sd) => sd.day === day),
						})}>
						{t("weekDays:" + day)}
					</span>
				</Checkbox>
			</Row>
		);
	});
	return <>{checkBoxes}</>;
};

const SecondStepDescription = (props: {
	step: number;
	subStep: number;
	slotsDays: ScheduleDaySlots[];
}) => {
	const { t } = useTranslation(["scheduleForm"]);

	return (
		<div className="substeps">
			{props.slotsDays.map((sd) => {
				const stepDay = props.step === 1 ? props.slotsDays[props.subStep - 1].day : 0;
				return (
					<div
						className={cx("substeps__substep", {
							done: stepDay > sd.day,
							current: stepDay === sd.day,
							pending: stepDay < sd.day,
						})}>
						<FontAwesomeIcon icon={faCircle} />
						{t("weekDays:" + sd.day)}
					</div>
				);
			})}
		</div>
	);
};

const SecondStep = (props: {
	slotsDays: ScheduleDaySlots[];
	errors: string[];
	daySlots: ScheduleDaySlots;
	selectedDays: number[];
	locations?: { idLocation: number; nameLocation: string }[];
	portfolios?: { idPortfolio: number; namePortfolio: string }[];
	subStep: number;
	onChangeConfiguration: (value: number) => void;
	selectCopyConfiguration: (value: number) => void;
	addSlot: () => void;
	deleteSlot: (index: number) => void;
	onChangeSelects: (index: number, location?: any, portfolio?: any) => void;
	onChangeTimes: (index: number, date: string, timeFrom: boolean) => void;
	onChangeInterval: (index: number, value: number) => void;
	onChangeFlags: (index: number, flagGroup?: boolean, flagCon?: boolean, flagPay?: boolean) => void;
	onChangeParticipants: (index: number, value: number) => void;
}) => {
	const { t } = useTranslation(["scheduleForm"]);

	return props.slotsDays.length === 0 ? (
		<Empty
			image={Empty.PRESENTED_IMAGE_SIMPLE}
			description={
				<>
					<div>{t("emptySlots1")}</div>
					<div>{t("emptySlots2")}</div>
				</>
			}
		/>
	) : (
		<DaySlots
			key={props.slotsDays[props.subStep - 1]!.day}
			daySlots={props.daySlots}
			selectedDays={props.slotsDays
				.filter(
					(sd) =>
						sd.configurationType === enumPrestadorScheduleSlotConfigurationType.CUSTOM &&
						sd.day < props.slotsDays[props.subStep - 1]!.day
				)
				.map((sd) => sd.day)}
			locations={props.locations}
			portfolios={props.portfolios}
			errors={props.errors}
			subStep={props.subStep}
			onChangeConfiguration={props.onChangeConfiguration}
			selectCopyConfiguration={props.selectCopyConfiguration}
			addSlot={props.addSlot}
			deleteSlot={props.deleteSlot}
			onChangeSelects={props.onChangeSelects}
			onChangeTimes={props.onChangeTimes}
			onChangeInterval={props.onChangeInterval}
			onChangeFlags={props.onChangeFlags}
			onChangeParticipants={props.onChangeParticipants}
		/>
	);
};

const DaySlots = (props: {
	daySlots: ScheduleDaySlots;
	selectedDays: number[];
	locations?: { idLocation: number; nameLocation: string }[];
	portfolios?: { idPortfolio: number; namePortfolio: string }[];
	errors?: string[];
	subStep: number;
	onChangeConfiguration: (value: number) => void;
	selectCopyConfiguration: (value: number) => void;
	addSlot: () => void;
	deleteSlot: (index: number) => void;
	onChangeSelects: (index: number, location?: any, portfolio?: any) => void;
	onChangeTimes: (index: number, date: string, timeFrom: boolean) => void;
	onChangeInterval: (index: number, value: number) => void;
	onChangeParticipants: (index: number, value: number) => void;
	onChangeFlags: (index: number, flagGroup?: boolean, flagCon?: boolean, flagPay?: boolean) => void;
}) => {
	const { t } = useTranslation(["scheduleForm"]);

	const days = props.selectedDays
		.filter((day) => day !== props.daySlots.day)
		.map((day) => (
			<Option key={day} value={day}>
				{t("weekDays:" + day)}
			</Option>
		));

	const [form] = Form.useForm();

	const onChangeConfiguration = (value: number) => {
		props.onChangeConfiguration(value);
		form.setFieldsValue({
			configurationCopy: undefined,
			copyConfigurationDay: undefined,
			["flagAllowGroupSession" + props.subStep]: false,
			["flagAllowPriorPayment" + props.subStep]: false,
			["flagAllowOnlineCon" + props.subStep]: false,
			["interval" + props.subStep]: undefined,
			["location" + props.subStep]: undefined,
			["portfolio" + props.subStep]: undefined,
			["timeFrom" + props.subStep]: undefined,
			["timeTo" + props.subStep]: undefined,
		});
	};

	const addSlot = () => {
		form.validateFields().then(() => props.addSlot());
	};

	const addSlotDisabled =
		props.subStep === 1
			? false
			: props.daySlots.configurationType !== enumPrestadorScheduleSlotConfigurationType.CUSTOM;

	return (
		<div key={new Date().getTime()}>
			<b>{t("slotsTitle", { day: t("weekDays:" + props.daySlots.day) })}</b>
			<Form layout="vertical" form={form} size="large" style={{ marginTop: "0.5rem" }}>
				{props.subStep !== 1 && (
					<Form.Item
						shouldUpdate
						name="configurationType"
						rules={[{ required: true }]}
						style={{ marginBottom: "0" }}
						initialValue={props.daySlots.configurationType}
						validateStatus={
							props.errors?.some((err) => err === "configurationType") ? "error" : undefined
						}>
						<Radio.Group
							name="configurationType"
							onChange={(e: any) => onChangeConfiguration(e.target.value)}>
							<Row gutter={8}>
								<Col span={10}>
									<Radio value={enumPrestadorScheduleSlotConfigurationType.CUSTOM}>
										{t("customConfigurationLabel")}
									</Radio>
								</Col>
								<Col span={14}>
									<Radio value={enumPrestadorScheduleSlotConfigurationType.COPY}>
										{t("copyConfigurationLabel")}
									</Radio>
								</Col>
							</Row>
						</Radio.Group>
					</Form.Item>
				)}
				<Row gutter={8} style={{ marginBottom: "1rem" }}>
					<Col span={10}>
						<Button
							icon={<PlusOutlined />}
							type="primary"
							disabled={addSlotDisabled}
							onClick={addSlot}>
							{t("addSlotButton")}
						</Button>
					</Col>
					{props.subStep !== 1 && (
						<Col span={14}>
							<Form.Item
								name="copyConfigurationDay"
								initialValue={props.daySlots.copyConfigurationDay}
								validateStatus={
									props.errors?.some((err) => err === "copyConfigurationDay") ? "error" : undefined
								}
								noStyle>
								<Select
									style={{ width: "100%" }}
									placeholder={t("copyConfigurationSelect")}
									disabled={
										props.daySlots.configurationType !==
										enumPrestadorScheduleSlotConfigurationType.COPY
									}
									onSelect={(value: number) => props.selectCopyConfiguration(value)}>
									{days}
								</Select>
							</Form.Item>
						</Col>
					)}
				</Row>
				{props.daySlots.configurationType === enumPrestadorScheduleSlotConfigurationType.CUSTOM &&
					props.daySlots.slots?.map((slot, i) => {
						return (
							<Slot
								index={i + 1}
								form={form}
								slot={slot}
								locations={props.locations}
								portfolios={props.portfolios}
								errors={props.errors}
								deleteSlot={props.deleteSlot}
								onChangeSelects={props.onChangeSelects}
								onChangeTimes={props.onChangeTimes}
								onChangeInterval={props.onChangeInterval}
								onChangeFlags={props.onChangeFlags}
								onChangeParticipants={props.onChangeParticipants}
							/>
						);
					})}
			</Form>
		</div>
	);
};

const Slot = (props: {
	index: number;
	slot: DaySlot;
	form: FormInstance;
	deleteSlot: (index: number) => void;
	locations?: { idLocation: number; nameLocation: string }[];
	portfolios?: { idPortfolio: number; namePortfolio: string }[];
	errors?: string[];
	onChangeSelects: (index: number, location?: any, portfolio?: any) => void;
	onChangeTimes: (index: number, date: string, timeFrom: boolean) => void;
	onChangeInterval: (index: number, value: number) => void;
	onChangeParticipants: (index: number, value: number) => void;
	onChangeFlags: (index: number, flagGroup?: boolean, flagCon?: boolean, flagPay?: boolean) => void;
}) => {
	const { t } = useTranslation(["scheduleForm"]);

	const format = "HH:mm";

	const onChangeInterval = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		if (isNaN(Number(value))) {
			const interval = props.form.getFieldValue("interval" + props.index).slice(0, -1);
			props.form.setFieldsValue({
				...props.form.getFieldsValue(),
				["interval" + props.index]: interval,
			});
		}
	};

	const onChangeParticipants = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		if (isNaN(Number(value))) {
			const participants = props.form.getFieldValue("participants" + props.index).slice(0, -1);
			props.form.setFieldsValue({
				...props.form.getFieldsValue(),
				["participants" + props.index]: participants,
			});
		}
	};

	const onBlurInterval = () => {
		props.onChangeInterval(props.index, props.form.getFieldValue("interval" + props.index));
	};

	const onBlurParticipants = () => {
		props.onChangeParticipants(props.index, props.form.getFieldValue("participants" + props.index));
	};

	const deleteSlot = () => {
		props.deleteSlot(props.index);
		props.form.setFieldsValue({
			["flagAllowGroupSession" + props.index]: false,
			["flagAllowPriorPayment" + props.index]: false,
			["flagAllowOnlineCon" + props.index]: false,
			["interval" + props.index]: undefined,
			["location" + props.index]: undefined,
			["portfolio" + props.index]: undefined,
			["timeFrom" + props.index]: undefined,
			["timeTo" + props.index]: undefined,
		});
	};

	return (
		<div className="schedule-form-slot__container">
			<Row gutter={16} align="middle">
				<Col span={props.index > 1 ? 22 : 24}>
					<Divider orientation="left">{t("slot", { index: props.index })}</Divider>
				</Col>
				{props.index > 1 && (
					<Col span={2}>
						<Button
							icon={<DeleteOutlined style={{ color: "#000" }} />}
							type="link"
							onClick={deleteSlot}
						/>
					</Col>
				)}
			</Row>
			<Form.Item
				label={t("locationLabel")}
				name={"location" + props.index}
				rules={[{ required: false }]}
				initialValue={props.slot.location}
				validateStatus={
					props.errors?.some((err) => err === "location" + props.index) ? "error" : undefined
				}>
				<Select
					labelInValue
					showSearch
					notFoundContent={false}
					onSelect={(value: number) => props.onChangeSelects(props.index, value)}>
					{props.locations?.map((loc) => {
						return (
							<Option key={loc.idLocation} value={loc.idLocation} label={loc.nameLocation}>
								{loc.nameLocation}
							</Option>
						);
					})}
				</Select>
			</Form.Item>
			<Form.Item
				label={t("portfolioLabel")}
				name={"portfolio" + props.index}
				rules={[{ required: false }]}
				initialValue={props.slot.portfolio}
				validateStatus={
					props.errors?.some((err) => err === "portfolio" + props.index) ? "error" : undefined
				}>
				<Select
					labelInValue
					showSearch
					notFoundContent={false}
					onSelect={(value: number) => props.onChangeSelects(props.index, undefined, value)}>
					{props.portfolios?.map((por) => {
						return (
							<Option key={por.idPortfolio} value={por.idPortfolio} label={por.idPortfolio}>
								{por.namePortfolio}
							</Option>
						);
					})}
				</Select>
			</Form.Item>
			<Row gutter={16}>
				<Col span={8}>
					<Form.Item
						label={t("timeFrom")}
						name={"timeFrom" + props.index}
						rules={[{ required: true }]}
						initialValue={props.slot.timeFrom && dayjs(props.slot.timeFrom, format)}
						validateStatus={
							props.errors?.some(
								(err) => err === "timeFrom" + props.index || err === "valTimeFrom" + props.index
							)
								? "error"
								: undefined
						}>
						<TimePicker
							format={format}
							onChange={(value, date) => props.onChangeTimes(props.index, date.toString(), true)}
						/>
					</Form.Item>
				</Col>

				<Col span={8}>
					<Form.Item
						label={t("timeTo")}
						name={"timeTo" + props.index}
						rules={[{ required: true }]}
						initialValue={props.slot.timeTo && dayjs(props.slot.timeTo, format)}
						validateStatus={
							props.errors?.some(
								(err) => err === "timeTo" + props.index || err === "valTimeTo" + props.index
							)
								? "error"
								: undefined
						}>
						<TimePicker
							format={format}
							onChange={(value, date) => props.onChangeTimes(props.index, date.toString(), false)}
						/>
					</Form.Item>
				</Col>

				<Col span={8}>
					<Form.Item
						className="input-right-align"
						label={t("interval")}
						name={"interval" + props.index}
						rules={[{ required: true }]}
						initialValue={props.slot.interval}
						validateStatus={
							props.errors?.some((err) => err === "interval" + props.index) ? "error" : undefined
						}>
						<Input
							minLength={1}
							maxLength={10}
							suffix={"min"}
							onChange={onChangeInterval}
							onBlur={onBlurInterval}
						/>
					</Form.Item>
				</Col>
			</Row>

			<Row gutter={16}>
				<Col span={8}>
					<Form.Item
						name={"flagAllowGroupSession" + props.index}
						style={{ marginBottom: "0" }}
						initialValue={props.slot.flagAllowGroupSession}>
						<Checkbox
							onChange={(e) =>
								props.onChangeFlags(props.index, e.target.checked, undefined, undefined)
							}
							checked={props.slot.flagAllowGroupSession}>
							{t("allowGroupSession")}
						</Checkbox>
					</Form.Item>
				</Col>
				<Col span={16}>
					{props.slot.flagAllowGroupSession && (
						<Form.Item
							className="input-right-align"
							name={"participants" + props.index}
							rules={[{ required: props.slot.flagAllowGroupSession }]}
							initialValue={props.slot.nbrParticipants}
							validateStatus={
								props.errors?.some((err) => err === "participants" + props.index)
									? "error"
									: undefined
							}>
							<Input
								minLength={1}
								maxLength={4}
								suffix={t("participants")}
								onChange={onChangeParticipants}
								onBlur={onBlurParticipants}
							/>
						</Form.Item>
					)}
				</Col>
			</Row>

			<Form.Item
				name={"flagAlowOnlineCon" + props.index}
				style={{ marginBottom: "0" }}
				initialValue={props.slot.flagAllowOnlineCon}>
				<Checkbox
					onChange={(e) => props.onChangeFlags(props.index, undefined, e.target.checked, undefined)}
					checked={props.slot.flagAllowOnlineCon}>
					{t("allowOnlineConLabel")}
				</Checkbox>
			</Form.Item>
			<Form.Item
				name={"flagAllowPriorPayment" + props.index}
				style={{ marginBottom: "0" }}
				initialValue={props.slot.flagAllowPriorPayment}>
				<Checkbox
					onChange={(e) => props.onChangeFlags(props.index, undefined, undefined, e.target.checked)}
					checked={props.slot.flagAllowPriorPayment}>
					{t("allowPriorPaymentLabel")}
				</Checkbox>
			</Form.Item>
		</div>
	);
};

export default ScheduleForm;

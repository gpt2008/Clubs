import React from "react";

import { Col, DatePicker, Form, FormInstance, Input, Modal, Radio, Row } from "antd";
import { useTranslation } from "react-i18next";
import enumClosingPeriodDateType from "types/enums/EnumClosingPeriodDateType";
import formUtils from "utils/formUtils";
import { IState as IStateContainer } from "./NewProviderHolidaysModalContainer";

interface IProps {
	visible?: boolean;
	onClose: (saved: boolean) => void;
	onSubmit: (form: FormInstance) => void;
}

const NewProviderHolidaysModal = (props: IProps & IStateContainer) => {
	const [form] = Form.useForm();
	const { t } = useTranslation(["providerHolidayForm"]);

	const [value, setValue] = React.useState(1);
	const onChange = (e: any) => {
		setValue(e.target.value);
	};

	return (
		<Modal
			style={{ top: 40 }}
			onOk={() => props.onSubmit(form)}
			onCancel={() => props.onClose(false)}
			open={props.visible}
			destroyOnClose
			width={456}
			okText={t("buttons:save")}
			cancelText={t("buttons:cancel")}>
			<Form form={form} layout="vertical" size="large">
				<Row gutter={16}>
					<Col span={24}>
						<Form.Item
							label={t("nameHolidayField")}
							name="nameHoliday"
							rules={[{ required: true }]}>
							<Input maxLength={256} />
						</Form.Item>
					</Col>
				</Row>
				<Form.Item
					name="periodType"
					rules={[{ required: true }]}
					className="periods__field"
					initialValue={enumClosingPeriodDateType.ONE_DAY}>
					<Radio.Group className="radio-group--expanded" buttonStyle="solid" onChange={onChange}>
						<Radio value={enumClosingPeriodDateType.ONE_DAY}>
							{t("closingPeriodDateType:" + enumClosingPeriodDateType.ONE_DAY)}
						</Radio>
						<Radio value={enumClosingPeriodDateType.PERIOD}>
							{t("closingPeriodDateType:" + enumClosingPeriodDateType.PERIOD)}
						</Radio>
					</Radio.Group>
				</Form.Item>
				<Row gutter={16}>
					<Col span={12}>
						<Form.Item
							label={
								value === enumClosingPeriodDateType.ONE_DAY ? t("dateField") : t("dateFromField")
							}
							name="dateFrom"
							rules={[{ required: true }]}
							validateStatus={
								formUtils.isError("dateFrom", props.errorFields) ? "error" : undefined
							}>
							<DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
						</Form.Item>
					</Col>
					{value === enumClosingPeriodDateType.PERIOD ? (
						<Col span={12}>
							<Form.Item
								label={t("dateToField")}
								name="dateTo"
								rules={[{ required: true }]}
								validateStatus={
									formUtils.isError("dateFrom", props.errorFields) ? "error" : undefined
								}>
								<DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
							</Form.Item>
						</Col>
					) : null}
				</Row>
			</Form>
		</Modal>
	);
};

export default NewProviderHolidaysModal;

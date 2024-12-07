import React from "react";

import { Col, Form, Input, Modal, Row, Select, Switch, Upload } from "antd";
import ImgCrop from "antd-img-crop";
import { FormInstance } from "antd/es/form/Form";
import { UploadFile } from "antd/lib/upload/interface";
import { Option } from "rc-select";
import { useTranslation } from "react-i18next";
import { URL } from "utils/rest";
import { IState as IStateContainer } from "./ServiceFormContainer";

interface IProps {
	visible?: boolean;
	namePortfolio?: string;
	edit?: boolean;
	onCancel: () => void;
	onSubmit: (form: FormInstance) => void;
	handlePreview: (file: UploadFile<any>) => void;
	handleCancel: (e: React.MouseEvent<HTMLElement>) => void;
}

const ServiceForm = (props: IProps & IStateContainer) => {
	const { t } = useTranslation(["serviceForm"]);

	const [form] = Form.useForm();

	const { previewVisible, previewImage, previewTitle } = props;

	const onChangePrice = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		if (isNaN(Number(value))) {
			const amtPrice = form.getFieldValue("amtPrice").slice(0, -1);
			form.setFieldsValue({ ...form.getFieldsValue(), amtPrice });
		}
	};

	const onChangeSpeciality = (value: any) => {
		form.setFieldsValue({ ...form.getFieldsValue(), act: undefined });
	};

	const durationOptions = () => {
		let minutes = 0;
		const options = [];
		while (minutes !== 120) {
			minutes += 5;
			options.push(
				<Option key={minutes} value={minutes}>
					{minutes + " mins"}
				</Option>
			);
		}
		return options;
	};

	const onChangeSwitch = (nameFlag: string, value: boolean) => {
		form.setFieldsValue({ ...form.getFieldsValue(), [nameFlag]: value });
	};

	const initialValues = {
		...props.service,
		speciality: props.service?.codeSpeciality && {
			key: props.service?.codeSpeciality,
			label: props.service?.codeSpeciality + " - " + props.service?.nameSpeciality,
		},
		files: props.service?.hasServicePhoto
			? [
					{
						uid: "-1",
						name: t("mainImage"),
						status: "done",
						url: URL + "/file?psl&idPortfolioService=" + props.service.idPortfolioService,
					},
			  ]
			: null,
	};

	return (
		<Modal
			title={
				props.edit
					? t("editServiceTitle", { namePortfolio: props.namePortfolio })
					: t("newServiceTitle", { namePortfolio: props.namePortfolio })
			}
			open={props.visible || false}
			style={{ top: 40 }}
			onCancel={props.onCancel}
			cancelText={t("buttons:cancel")}
			onOk={() => props.onSubmit(form)}
			okText={t("buttons:save")}
			destroyOnClose
			width={600}>
			<Form layout="vertical" form={form} size="large" initialValues={initialValues}>
				<Row gutter={12}>
					<Col span={8}>
						<Form.Item
							label={t("mainImageLabel")}
							name="files"
							className="service-form__uploadImage">
							<UploadWithCrop handlePreview={props.handlePreview} />
						</Form.Item>
					</Col>
					<Col span={16}>
						<Form.Item name="speciality" label={t("specialityLabel")} rules={[{ required: true }]}>
							<Select
								labelInValue
								showSearch
								notFoundContent={false}
								filterOption={(input, option) =>
									("" + option?.label).toUpperCase().includes(input.toUpperCase())
								}
								onChange={onChangeSpeciality}
								disabled={props.edit}>
								{props.specialities?.map((sp) => {
									return (
										<Option
											key={sp.codeSpeciality}
											value={sp.codeSpeciality}
											label={sp.codeSpeciality + " - " + sp.nameSpeciality}>
											{sp.codeSpeciality + " - " + sp.nameSpeciality}
										</Option>
									);
								})}
							</Select>
						</Form.Item>
						<Form.Item
							label={t("nameServiceLabel")}
							name="nameService"
							rules={[{ required: true }]}>
							<Input maxLength={256} disabled={props.edit} />
						</Form.Item>
					</Col>
				</Row>
				<Row gutter={12}>
					<Col span={6}>
						<Form.Item name="valueDuration" label={t("durationLabel")} rules={[{ required: true }]}>
							<Select>{durationOptions()}</Select>
						</Form.Item>
					</Col>
					<Col span={18}>
						<Form.Item className="input-right-align" label={t("priceLabel")} name="amtPrice">
							<Input onChange={onChangePrice} suffix={"€"} />
						</Form.Item>
					</Col>
				</Row>
				<Form.Item
					name="flagAllowOnlineRes"
					style={{ marginBottom: "0.5rem" }}
					valuePropName="checked">
					<Switch
						onChange={(value) => onChangeSwitch("flagAllowOnlineRes", value)}
						defaultChecked={props.service?.flagAllowOnlineRes}
					/>
					<span style={{ paddingLeft: "1rem" }}>{t("flagAllowOnlineResLabel")}</span>
				</Form.Item>
				<Form.Item
					name="flagAllowOnlineVid"
					style={{ marginBottom: "0.5rem" }}
					valuePropName="checked">
					<Switch
						onChange={(value) => onChangeSwitch("flagAllowOnlineVid", value)}
						defaultChecked={props.service?.flagAllowOnlineVid}
					/>
					<span style={{ paddingLeft: "1rem" }}>{t("flagAllowOnlineVidLabel")}</span>
				</Form.Item>
				<Form.Item name="flagShowPrice" style={{ marginBottom: "0.5rem" }} valuePropName="checked">
					<Switch
						onChange={(value) => onChangeSwitch("flagShowPrice", value)}
						defaultChecked={props.service?.flagShowPrice}
					/>
					<span style={{ paddingLeft: "1rem" }}>{t("flagShowPriceLabel")}</span>
				</Form.Item>
				<Form.Item
					name="flagAllowPriorPayment"
					style={{ marginBottom: "0.5rem" }}
					valuePropName="checked">
					<Switch
						onChange={(value) => onChangeSwitch("flagAllowPriorPayment", value)}
						defaultChecked={props.service?.flagAllowPriorPayment}
					/>
					<span style={{ paddingLeft: "1rem" }}>{t("flagAllowPriorPaymentLabel")}</span>
				</Form.Item>
			</Form>
			<Modal
				open={previewVisible}
				title={previewTitle}
				footer={null}
				style={{ top: 40 }}
				onCancel={props.handleCancel}
				onOk={() => props.onSubmit(form)}>
				<img alt="" style={{ width: "100%" }} src={previewImage} />
			</Modal>
		</Modal>
	);
};

const UploadWithCrop = (props: {
	value?: UploadFile[];
	onChange?: (value: UploadFile[]) => void;
	handlePreview: (file: UploadFile) => void;
}) => {
	return (
		<ImgCrop aspect={3 / 2}>
			<Upload
				listType="picture-card"
				name="files"
				customRequest={(option: any) => option.onSuccess("ok")}
				onPreview={(file) => props.handlePreview(file)}
				fileList={props.value}
				onChange={(info) => props.onChange && props.onChange(info.fileList)}>
				{(!props.value || props.value.length === 0) && "+ Upload"}
			</Upload>
		</ImgCrop>
	);
};

export default ServiceForm;

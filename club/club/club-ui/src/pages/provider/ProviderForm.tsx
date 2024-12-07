import React, { useState } from "react";

import { Button, Col, Form, FormInstance, Input, Modal, Row, Select, SelectProps, Upload } from "antd";
import ImgCrop from "antd-img-crop";
import TextArea from "antd/lib/input/TextArea";
import { UploadFile } from "antd/lib/upload/interface";
import { Option } from "rc-select";
import { useTranslation } from "react-i18next";
import { EnumIdentificationType } from "types/enums/EnumIdentificationType";
import FormUtils from "utils/formUtils";
import { URL } from "utils/rest";
import "./Provider.scss";
import { IState as IStateContainer } from "./ProviderFormContainer";
import i18n from "i18n/i18n";
import { ProviderPreview } from "types/entities/Provider";

interface IProps {
	visible?: boolean;
	nameProvider?: string;
	handlePreview: (file: UploadFile<any>) => void;
	handleCancel: (e: React.MouseEvent<HTMLElement>) => void;
	onCancel: () => void;
	handlePreviewProfile: (values?: ProviderPreview) => void;
	onSubmit: (form: FormInstance) => void;
}

const ProviderForm = (props: IProps & IStateContainer) => {
	const { t } = useTranslation(["providerForm"]);

	const [form] = Form.useForm();

	const { previewVisible, previewImage, previewTitle } = props;

	const [currentValues, setCurrentValues] = useState<ProviderPreview>()

	const specieOptions: SelectProps['options'] = [];

	const languageOptions: SelectProps['options'] = [];


	props.languages?.forEach(language => {
		languageOptions.push({
			label: i18n.t("languageCodes:" + language.codeLanguage),
			value: language.idLanguage
		})
	})

	const specialitiesOptions: SelectProps['options'] = [];

	props.specialities?.forEach(specialities => {
		specialitiesOptions.push({
			label: specialities.nameSpeciality,
			value: specialities.codeSpeciality
		})
	})

	const initialValues = {
		...props.provider,
		speciality: {
			key: props.provider?.codeSpeciality,
			label: props.provider?.nameSpeciality,
		},
		files: props.provider?.hasProviderPhoto
			? [
					{
						uid: "-1",
						name: "providerImage.png",
						status: "done",
						url: URL + "/file?pa&idProvider=" + props.provider?.idProvider,
					},
			  ]
			: [],
		originFileObj: props.provider?.blobPhoto,
		languages: props.selectedLanguages?.map(language => language.idLanguage)
	};

	const handleFormChange = () => {
		const currentValues = {
			...form.getFieldsValue(),
			files: props.provider?.hasProviderPhoto
			? [
					{
						uid: "-1",
						name: "providerImage.png",
						status: "done",
						url: URL + "/file?pa&idProvider=" + props.provider?.idProvider,
					},
			  ]
			: [],
			originFileObj: props.provider?.blobPhoto,
		} 
		setCurrentValues(currentValues);
	  };

	return (
		<Modal
			title={
				props.nameProvider
					? t("editProviderTitle", { nameProvider: props.nameProvider })
					: t("newProviderTitle")
			}
			open={props.visible || false}
			onCancel={props.onCancel}
			onOk={() => props.onSubmit(form)}
			/*cancelText={t("buttons:cancel")}
			okText={t("buttons:save")}*/
			footer={[
				<Button key="cancel" onClick={props.onCancel}>
				  {t("buttons:cancel")}
				</Button>,
				<Button type="primary" key="PreviewProfile" onClick={() => props.handlePreviewProfile(currentValues)}>
				  {t("PreviewProfile")}
				</Button>,
				<Button key="save" type="primary" onClick={() => props.onSubmit(form)}>
				  {t("buttons:save")}
				</Button>,
			  ]}
			style={{ top: 40 }}
			destroyOnClose
			>
			<Form
				layout="vertical"
				form={form}
				size="large"
				initialValues={initialValues}
				onValuesChange={handleFormChange}
				className="form__smaller-margin">
				<Row gutter={12}>
					<Col span={8}>
						<Form.Item label={t("pictureLabel")} name="files" className="avatar-crop">
							<UploadWithCrop handlePreview={props.handlePreview} />
						</Form.Item>
					</Col>
					<Col span={16}>
						<Row gutter={12}>
							<Col span={24}>
								<Row gutter={12}>
									<Col span={8}>
										<Form.Item label={t("typeIdLabel")} name="typeIdentification">
											<Select>
												<Option
													key={EnumIdentificationType.DNI}
													value={EnumIdentificationType.DNI}
													label={t("idTypes:DNI")}>
													{t("idTypes:DNI")}
												</Option>
												<Option
													key={EnumIdentificationType.NIE}
													value={EnumIdentificationType.NIE}
													label={t("idtypes:NIE")}>
													{t("idTypes:NIE")}
												</Option>
											</Select>
										</Form.Item>
									</Col>
									<Col span={16}>
										<Form.Item
											label={t("identificationLabel")}
											name="codeIdentification"
											validateStatus={
												FormUtils.isError("codeIdentification", props.errorFields)
													? "error"
													: undefined
											}
											help={FormUtils.getErrorMessage("codeIdentification", props.errorFields)}>
											<Input maxLength={32} />
										</Form.Item>
									</Col>
								</Row>
							</Col>
							<Col span={24}>
								<Form.Item label={t("nameLabel")} name="namePerson" rules={[{ required: true }]}>
									<Input maxLength={256} />
								</Form.Item>
							</Col>
						</Row>
					</Col>
				</Row>
				<Row gutter={12}>
					<Col span={12}>
						<Form.Item label={t("surname1Label")} name="nameSurname1" rules={[{ required: true }]}>
							<Input maxLength={256} />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item label={t("surname2Label")} name="nameSurname2">
							<Input maxLength={256} />
						</Form.Item>
					</Col>
				</Row>

				{/*<Row gutter={12}>
					<Col span={12}>
						<Form.Item label={t("specialityLabel")} name="speciality">
							
							<Select 
								showSearch
								notFoundContent={false}
								filterOption={(input, option) =>
									("" + option?.label).toUpperCase().includes(input.toUpperCase())
								} 
								mode="multiple" 
								placeholder={t("selectSpeciality")} options={specialitiesOptions} />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item label={t("professionalCollegeField")} name="codeProfessionalCollege">
							<Input maxLength={64} />
						</Form.Item>
					</Col>
				</Row>*/}

				<Row gutter={12}>
					{/*<Col span={12}>
						<Form.Item label={t("species")} name="species">
							<Select mode="multiple" placeholder={t("selectSpecie")}options={specieOptions}/>
						</Form.Item>
					</Col>*/}
					<Col span={12}>
						<Form.Item label={t("languages")} name="languages">
							<Select mode="multiple" placeholder={t("selectLanguage")} options={languageOptions} />
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={12}>
					{/*<Col span={12}>
						<Form.Item label={t("namePositionLabel")} name="namePosition">
							<Input maxLength={256} />
						</Form.Item>
					</Col>*/}
					<Col span={12}>
						<Form.Item label={t("professionalCollegeField")} name="codeProfessionalCollege">
							<Input maxLength={64} />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item label={t("typeOnline")} name="typeOnline">
							<Select>
								<Option
									key={0}
									value={0}
									label={t("presencial")}>
									{t("presencial")}
								</Option>
								<Option
									key={1}
									value={1}
									label={t("videoconsulta")}>
									{t("videoconsulta")}
								</Option>
								<Option
									key={2}
									value={2}
									label={t("ambas")}>
									{t("ambas")}
								</Option>
							</Select>
						</Form.Item>
					</Col>
				</Row>

				

				<Form.Item label={t("descriptionField")} name="descEducation">
					<TextArea rows={3} style={{ resize: "none" }} />
				</Form.Item>

				<Form.Item label={t("professionalCareerField")} name="descCareer">
					<TextArea rows={3} style={{ resize: "none" }} />
				</Form.Item>

				<Modal
					open={previewVisible}
					title={previewTitle}
					footer={null}
					onCancel={props.handleCancel}>
					<img alt="" style={{ width: "100%", borderRadius: "50%" }} src={previewImage} />
				</Modal>
			</Form>
		</Modal>
	);
};

const UploadWithCrop = (props: {
	value?: UploadFile[];
	onChange?: (value: UploadFile[]) => void;
	handlePreview: (file: UploadFile) => void;
}) => {
	return (
		<ImgCrop cropShape="round">
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

export default ProviderForm;

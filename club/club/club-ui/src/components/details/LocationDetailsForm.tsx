import React, { useEffect, useState } from "react";

import { PlusOutlined } from "@ant-design/icons";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AutoComplete, Button, Checkbox, Col, Form, FormInstance, Input, message, Modal, Row, Select, Upload } from "antd";
import ImgCrop from "antd-img-crop";
import TextArea from "antd/lib/input/TextArea";
import { UploadChangeParam, UploadFile } from "antd/lib/upload/interface";
import OrganizationsDropdown from "components/filterDropdowns/organizationsDropdown/OrganizationsDropdown";
import { useTranslation } from "react-i18next";
import { URL } from "utils/rest";
import "./Location.scss";
import { IState as IStateContainer } from "./LocationDetailsFormContainer";
import { Rest } from "utils/utils";
const CheckboxGroup = Checkbox.Group;

const LocationDetailsForm = (
	props: {
		idLocationSelected?: number;
		visible?: boolean;
		onCancel: (saved: boolean) => void;
		onSubmit: (form: FormInstance) => void;
		handlePreview: (file: UploadFile<any>) => void;
		handleChange: (info: UploadChangeParam) => void;
		handleCancel: (e: React.MouseEvent<HTMLElement>) => void;
		handlePreviewProfile: (values:any) => void;
		searchLocation: (value: string) => void;
		onSelectLocation: (option: any) => void;
		geoPosition: () => void;
		onChangeSearch: (idOrganization: number) => void;
		filterOptions: (inputValue: String) => void;
	} & IStateContainer
) => {
	const [form] = Form.useForm();
	const { t } = useTranslation(["locationForm"]);
	const [provinces, setProvinces] = useState<any[]>();

	const [currentValues,setCurrentValues] = useState<any>()
	type Province = {
		idProvince: number;
		codeProvince: string;
		codeCountry: string;
		nameProvince: string;
	}

	const initialValues = props.locationDetails && {
		...props.locationDetails,
		nameLocation: props.locationDetails.nameLocation,
		idOrganization: props.locationDetails.idOrganization,
		//nameOrganization:props.locationDetails.nameOrganization,
		valueAddress: props.locationDetails.valueAddress,
		valueAddressDetails: props.locationDetails.valueAddressDetails,
		valuePhone: props.locationDetails.valuePhone,
		valueEmail: props.locationDetails.valueEmail,
		descLocation: props.locationDetails.descLocation,
		files: props.locationDetails.hasLocationPhoto
			? [
					{
						uid: "-1",
						name: t("mainImage"),
						status: "done",
						url: URL + "/file?locl&idLocation=" + props.locationDetails?.idLocation,
					},
			  ]
			: null,
		
	};


	useEffect(() => {
		form.setFieldsValue({ idOrganization: props.idOrganizationSelected });
	}, [props.idOrganizationSelected]);

	useEffect(()=> {
		Rest<any, Province[]>()
		.operation({
			type: "SelectProvinceList",
		})
		.then((response) => {
			setProvinces(
				response.map((province) => {
					return { value: province.idProvince, label: province.nameProvince };
				})
			);
		});
	},[])

	const handleFormChange = () => {
		const currentValues = {
			...form.getFieldsValue(),
			files: props.locationDetails?.hasLocationPhoto
			? [
					{
						uid: "-1",
						name: t("mainImage"),
						status: "done",
						url: URL + "/file?locl&idLocation=" + props.locationDetails?.idLocation,
					},
			  ]
			: null
		} 
		setCurrentValues(currentValues);
	  };

	const serviceOptions: any[] = [];
	const languagesOptions: any[] = [];

	props.services?.forEach(service => {
		if(service.codeService.includes("H24") || service.codeService.includes("AccesoMinusvalidos") || service.codeService.includes("FinSemana")){
			serviceOptions.push({
				label: service.nameService,
				value: service.idService.toString(),
				code: service.codeService
			}) 
		}
	})

	props.services?.forEach(service => {
		if(service.nameService.includes("Idioma")){
			languagesOptions.push({
				label: service.nameService,
				value: service.idService.toString(),
				code: service.codeService
			}) 
		}
	})

	const { previewVisible, previewImage, previewTitle } = props;
	const uploadButton = (
		<div>
			<PlusOutlined />
			<div style={{ marginTop: 8 }}>{t("uploadButton")}</div>
		</div>
	);

	const locations = (props.locations || []).map((loc) => {
		return {
			key: loc.place_id,
			value: loc.display_name,
			label: (
				<div style={{ display: "flex", justifyContent: "left", alignItems: "flex-start" }}>
					<div style={{ paddingRight: "0.5rem", color: "gray" }}>
						<FontAwesomeIcon icon={faMapMarkerAlt} />
					</div>
					<div> {loc.display_name}</div>
				</div>
			),
		};
	});


	return (
		<Modal
			title={
				props.idLocationSelected
					? t("editLocationTitle", { nameLocation: props.locationDetails?.nameLocation! })
					: t("newLocationTitle")
			}
			style={{ top: 40 }}
			open={props.visible}
			//onOk={() => props.onSubmit(form)}
			onCancel={() => props.onCancel(false)}
			className="location__details__form__modal"
			bodyStyle={{ padding: "1rem 2rem" }}
			okText={t("buttons:save")}
			cancelText={t("buttons:cancel")}
			footer={[
				<Button key="cancel" onClick={() => props.onCancel(false)}>
					{t("buttons:cancel")}
				</Button>,
				props.idLocationSelected && <Button type="primary" key="PreviewProfile" onClick={() => props.handlePreviewProfile(currentValues ? currentValues: initialValues)}>
					{t("previewProfile")}
				</Button>,
				<Button key="save" type="primary" onClick={() => props.onSubmit(form)}>
					{t("buttons:save")}
				</Button>,
				]}>
			<Form layout="vertical" form={form} size="large" initialValues={initialValues} onValuesChange={handleFormChange}>
			<p style={{fontSize:'14px', paddingBottom:'1rem'}} >{t("locationTitledesc")}</p>
				<Row gutter={32}>
					<Col span={24}>
						<Form.Item
							label={t("organizationLabel")}
							name="idOrganization"
							rules={[{ required: true }]}>
							<OrganizationsDropdown
								idOrganizationSelected={props.idOrganizationSelected}
								organizations={props.organizations}
								onChangeSearch={props.onChangeSearch}
								filterOptions={props.filterOptions}
								defaultOrgId = {props.locationDetails?.idOrganization}
								style={{ width: "-webkit-fill-available" }}
							/>
						</Form.Item>
					</Col>
				</Row>
				
				<Row gutter={12}>
					<Col span={8}>
						<Form.Item
							label={t("mainImageField")}
							name="files"
							className="location-form__uploadImage">
							<UploadWithCrop handlePreview={props.handlePreview} />
						</Form.Item>
					</Col>
					<Col span={16}>
						<Form.Item label={t("nameField")} name="nameLocation" rules={[{ required: true }]}>
							<Input maxLength={128} />
						</Form.Item>
						<Form.Item
							name="idProvince"
							label={<div className="field__label">{t("provinceLabel")}</div>}
							rules={[{ required: true }]}>
							<Select
								placeholder={t("provincePlaceholder")}
								options={provinces}
								showSearch
								optionFilterProp="children"
								filterOption={(input, option) =>
									(option?.label ?? "").toLowerCase().includes(input.toLowerCase())
								}
								filterSort={(optionA, optionB) =>
									(optionA?.label ?? "")
										.toLowerCase()
										.localeCompare((optionB?.label ?? "").toLowerCase())
								}
							/>
						</Form.Item>
					   </Col>
					</Row>
					<Form.Item label={t("addressField")} name="valueAddress" rules={[{ required: true }]}>
						<AutoComplete
							onSearch={props.searchLocation}
							onSelect={(value, option) => props.onSelectLocation(option)}
							showSearch
							options={locations || []}>
							<Input
								placeholder={t("placeholders:startTypingResults")}
								suffix={
									<FontAwesomeIcon
										icon={faMapMarkerAlt}
										style={{ color: "#3CBCF2" }}
										onClick={props.geoPosition}
									/>
								}
							/>
						</AutoComplete>
					</Form.Item>
					
				<Form.Item label={t("addressDetailsField")} name="valueAddressDetails">
					<Input maxLength={256} />
				</Form.Item>
				
				<Row gutter={12}>
					<Col span={10}>
						<Form.Item label={t("phoneField")} name="valuePhone">
							<Input maxLength={256} />
						</Form.Item>
					</Col>
					<Col span={14}>
						<Form.Item label={t("emailField")} name="valueEmail">
							<Input maxLength={256} />
						</Form.Item>
					</Col>
				</Row>

				<Form.Item label={t("schedule")} name="schedule">
					<Input maxLength={256} />
				</Form.Item>

				<Row gutter={24}>
						<Col span={24}>
						<Form.Item /*label={t("services")}*/ initialValue={props.selectedServices?.map(service => service.idService)} name="valueServices">
							<Checkbox.Group style={{ width: '100%' }}>
							<Row style={{gap:'.5rem', display:'flex', flexDirection:'column'}}>
								<span style={{padding:'.5rem'}}>{t("services")}</span>
                              	<Row className="location-form__service-check-box">
                                    {serviceOptions.map((option, index) => (
                                    <Col span={7} key={index}>
                                        <div className="location-form__service-check-box__service">
                                            <Checkbox value={option.value}>{option.label}</Checkbox>
                                            <i className={"fa-regular " + t(option.code + "Icon") + " location__service__card__icon"} />
                                        </div>
                                    </Col>
                                    ))}
                              	</Row>
								<div className="location-form__languages-title">
								<span style={{padding:'.5rem 0rem .5rem .5rem'}}>{t("languages")}</span>
								<i style={{padding:'8px'}} className={"fa-regular " + t("IdiomaIcon") + " location__service__card__icon"} />
								</div>
							   	<Row className="location-form__service-check-box">
                                    {languagesOptions.map((option, index) => (
                                    <Col span={7} key={index}>
                                        <div className="location-form__service-check-box__service">
                                            <Checkbox value={option.value}>{option.label}</Checkbox>
                                            {<></>/*<i className={"fa-regular " + t(option.code + "Icon") + " location__service__card__icon"} />*/}
                                        </div>
                                    </Col>
                                    ))}
								</Row> 
							</Row>
							</Checkbox.Group>

						</Form.Item>		

						</Col>
				</Row>
				<div style={{padding:'1rem .5rem .5rem .5rem'}}>
				<span>{t("descriptionField")}</span>
				<p style={{paddingTop:'.5rem',fontSize:'12px'}}>{t("descriptionFieldMore")}</p>
				</div>				
				<Form.Item /*label={t("descriptionField")}*/ name="descLocation">
					<Input.TextArea title={t("descriptionFieldMore")} maxLength={256} rows={4} />
					
				</Form.Item>
				<Form.Item label={t("additionalFilesField")}>
					<Upload
						action={"javascript:;"}
						listType="picture-card"
						fileList={props.fileList}
						onPreview={(file) => props.handlePreview(file)}
						onChange={props.handleChange}
						customRequest={(option: any) => option.onSuccess("ok")}
						beforeUpload={(file) => {
							const isImage = file.type === 'image/jpeg' || file.type === 'image/png';
							if (!isImage) {
							  message.error('Solo puedes subir archivos PNG o JPG.');
							}
							return isImage;
						  }}>
						{uploadButton}
					</Upload>
					<Modal
						open={previewVisible}
						title={previewTitle}
						style={{ top: 40 }}
						footer={null}
						onCancel={props.handleCancel}>
						<img alt="" style={{ width: "100%" }} src={previewImage} />
					</Modal>
				</Form.Item>
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

export default LocationDetailsForm;

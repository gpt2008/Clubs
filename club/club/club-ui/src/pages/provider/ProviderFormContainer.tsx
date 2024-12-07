import React from "react";

import { FormInstance } from "antd/es/form/Form";
import { Store } from "antd/lib/form/interface";
import { RcFile } from "antd/lib/upload";
import { WithTranslation, withTranslation } from "react-i18next";
import Provider, { Language, ProviderDetails, ProviderPreview } from "types/entities/Provider";
import Speciality from "types/entities/Speciality";
import FormErrorField from "utils/form/formErrorField";
import formUtils from "utils/formUtils";
import { Rest } from "utils/utils";
import View from "./ProviderForm";
import { Specie } from "types/entities/Specie";
import { Modal } from "antd";
import ProviderDetailsModal from "components/providerInfo/ProviderDetailsModal";

interface IProps {
	visible?: boolean;
	idProvider?: number;
	nameProvider?: string;
	onClose: (save: boolean) => void;
}
export interface IState {
	errorFields: FormErrorField[];
	provider?: Provider;
	specialities?: Speciality[];
	languages?: Language[];
	selectedSpecies?: Specie[];
	selectedLanguages?: Language[];
	selectedSpecialities?: Speciality[];
	providerDataAux?: ProviderDetails;
	previewVisible: boolean;
	previewImage: string;
	previewTitle: string;
	ProvidersPublicProfileKey?: number;
	previewProfileModal: boolean;
	loaded?: boolean;
	//previewValues: ProviderPreview;
}

class ProviderFormContainer extends React.Component<WithTranslation & IProps, IState> {
	public state: IState = {
		errorFields: [],
		previewVisible: false,
		previewImage: "",
		previewTitle: "",
		previewProfileModal: false,
	};

	public componentDidMount() {
		if (this.props.visible) {
			this.loadLanguages();
			this.loadData();
		}
	}

	public render() {
		return this.state.loaded ? (
		<>
			<Modal
				open={this.state.previewProfileModal}
				onCancel={() => {
					this.setState({previewProfileModal : false})
				}}
				style={{top: 40}}
				footer={null}
				className="provider__details__modal">
				<ProviderDetailsModal
						key={this.state.ProvidersPublicProfileKey}
						{...this.state}
						visible={true}
						providerDataAux={this.state.providerDataAux}
						provider={{
							idProvider: this.state.provider?.idProvider || 0,
							languages: this.state.providerDataAux?.languages?.length != 0 ? this.state.languages!.filter(language => this.state.providerDataAux?.languages?.includes(language.idLanguage)) : this.state.selectedLanguages,
							specialities: this.state.selectedSpecialities || [],//this.state.previewValues.speciality.length != 0 ? this.state.specialities!.filter(speciality => this.state.previewValues.speciality!.includes(speciality.codeSpeciality)) : this.state.selectedSpecialities,
							locations: [],
							typeOnline: undefined
						}} 
						/>
			</Modal>
			<View
				{...this.state}
				visible={this.props.visible}
				nameProvider={this.props.nameProvider}
				handlePreview={this.handlePreview}
				handleCancel={this.handleCancel}
				onCancel={() => this.props.onClose(false)}
				onSubmit={this.validateAndSave}
				handlePreviewProfile = {this.handlePreviewProfile}
			/>
			</>
		) : (
			<></>
		);
	}

	private loadLanguages = () => {
		Rest<{ type: string;}, 	Language[]>()
			.operation({
				type: "SelectAllLanguages",
			})
			.then((response) => {
				this.setState({
					languages: response,
				});
			});
	}

	private loadData = () => {

		Rest<{ type: string; idProvider?: number }, any>()
			.operation({
				type: "GetProviderFormData",
				idProvider: this.props.idProvider,
			})
			.then((response) => {
				this.setState({
					provider: response.provider,
					specialities: response.specialities,
					loaded: true,
				});
			});
	};

	private handlePreview = async (file: any) => {

		if (!file.url && !file.preview) {
			file.preview = await this.getBase64(file.originFileObj);
		}

		this.setState({
			previewImage: file.url || file.preview,
			previewVisible: true,
			previewTitle: file.name || (file.url && file.url.substring(file.url.lastIndexOf("/") + 1)),
		});
	};

	private handleCancel = (e: React.MouseEvent<HTMLElement>) =>
		this.setState({ previewVisible: false });

	private getBase64 = (file: RcFile) => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result);
			reader.onerror = (error) => reject(error);
		});
	};

	private handlePreviewProfile = (values?: any) => {
		this.setState({ProvidersPublicProfileKey: new Date().getTime()})
		this.setState({previewProfileModal: true})
		if(values){
			this.setState((prevState: Readonly<IState>) => {
			return {
				selectedLanguages: values?.languages, selectedSpecialities: values?.speciality, selectedSpecies: values?.species,
				providerDataAux: {
					...prevState.providerDataAux,
					namePerson: values?.namePerson, nameSurname1: values?.nameSurname1, nameSurname2: values?.nameSurname2,
					typeIdentification: values.typeIdentification, codeIdentification: values.codeIdentification, speciality: values?.speciality,
					species: values.species, languages: values.languages, locations: values.locations, descEducation: values.descEducation, descCareer: values.descCareer,
					typeOnline: values.typeOnline, hasProviderPhoto: true, codeProfessionalCollege: values.codeProfessionalCollege, namePosition: values.namePosition
				}
				} as unknown as IState; 
			});
			
			this.setState({previewProfileModal: true})
		}

	}

	private validateAndSave = (form: FormInstance) => {
		this.setState({ errorFields: [] }, () => {
			form.validateFields().then((values: Store) => {
				if (this.props.idProvider) {
					this.save(values);
				} else {
					this.internalValidation(values);
				}
			});
		});
	};

	private internalValidation = (values: Store) => {
		this.doInternalValidation(values)?.then((errors) => {
			if (!errors || errors.length === 0) {
				this.save(values);
			} else {
				this.setState({ errorFields: errors });
			}
		});
	};

	private doInternalValidation = (values: Store) => {
		return new Promise((resolve: (f: FormErrorField[]) => void) => {
			let errors: FormErrorField[] = [];
			if (values.typeIdentification && values.codeIdentification) {
				Rest<{ type: string; idType: number; identification: string }, any>()
					.operation({
						type: "CheckProviderIdentification",
						idType: values.typeIdentification,
						identification: values.codeIdentification,
					})
					.then((response) => {
						if (response === 0) {
							const codeIdentificationError = {
								fieldName: "codeIdentification",
								errorMessage: this.props.t("errorIdentificationFormatIncorrect"),
							};

							errors = formUtils.addError(errors, codeIdentificationError);
						} else if (response === 1) {
							const codeIdentificationError = {
								fieldName: "codeIdentification",
								errorMessage: this.props.t("errorMessageCodeIdentificationExists"),
							};

							errors = formUtils.addError(errors, codeIdentificationError);
						}
						resolve(errors);
					});
			} else {
				resolve(errors);
			}
		});
	};

	private save = async (values: Store) => {
		const providerImageBase64Data: any =
			values.files &&
			values.files[0] &&
			!values.files[0].url &&
			(await this.getBase64(values.files[0].originFileObj));
		Rest<
			{
				type: string;
				idProvider?: number;
				idPerson?: number;
				typeIdentification?: number;
				codeIdentification?: string;
				namePerson: string;
				nameSurname1: string;
				nameSurname2?: string;
				//codeSpeciality: string;
				base64ImageAvatar?: string;
				hasProviderAvatar?: boolean;
				codeProfessionalCollege: string;
				descEducation: string;
				descCareer: string;
				namePosition?: string;
				languageCodes?: Language[];
				typeOnline?: Number;
				specialityCodes?: Speciality[];
			},
			any
		>()
			.operation({
				type: this.props.idProvider ? "EditProvider" : "NewProvider",
				idProvider: this.props.idProvider,
				typeIdentification: values.typeIdentification,
				codeIdentification: values.codeIdentification,
				namePerson: values.namePerson,
				nameSurname1: values.nameSurname1,
				nameSurname2: values.nameSurname2,
				//codeSpeciality: values.speciality.key,
				base64ImageAvatar: providerImageBase64Data ? providerImageBase64Data : undefined,
				hasProviderAvatar: values.files && values.files.length > 0,
				codeProfessionalCollege: values.codeProfessionalCollege,
				descEducation: values.descEducation,
				descCareer: values.descCareer,
				namePosition: values.namePosition,
				languageCodes: values.languages,
				typeOnline: values.typeOnline,
				specialityCodes: values.speciality
			})
			.then(() => this.props.onClose(true));
	};
}

export default withTranslation("providerForm")(ProviderFormContainer);

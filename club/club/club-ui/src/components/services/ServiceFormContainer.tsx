import { FormInstance } from "antd";
import { Store } from "antd/lib/form/interface";
import { RcFile } from "antd/lib/upload";
import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import PortfolioService from "types/entities/Portfolio";
import Speciality from "types/entities/Speciality";
import SavePortfolioService from "types/operations/SavePortfolioService";
import { Rest } from "utils/utils";
import View from "./ServiceForm";

interface IProps {
	idPortfolio: number;
	namePortfolio: string;
	idPortfolioService?: number;
	visible?: boolean;
	onClose: (save: boolean) => void;
}

export interface IState {
	service?: PortfolioService;
	newService?: PortfolioService;
	specialities?: Speciality[];
	loaded?: boolean;
	previewVisible: boolean;
	previewImage: string;
	previewTitle: string;
}

class ServiceFormContainer extends React.Component<WithTranslation & IProps, IState> {
	public state: IState = {
		previewVisible: false,
		previewImage: "",
		previewTitle: "",
	};

	public componentDidMount() {
		if (this.props.idPortfolioService) {
			this.loadData();
		} else {
			this.loadSpecialities();
		}
	}

	public render() {
		return this.state.loaded ? (
			<View
				{...this.state}
				visible={this.props.visible}
				namePortfolio={this.props.namePortfolio}
				edit={!!this.props.idPortfolioService}
				onCancel={() => this.props.onClose(false)}
				onSubmit={this.validateAndSave}
				handlePreview={this.handlePreview}
				handleCancel={this.handleCancel}
			/>
		) : (
			<></>
		);
	}

	private loadData = () => {
		Rest<{ type: string; idPortfolioService: number }, PortfolioService>()
			.operation({
				type: "SelectPortfolioServiceById",
				idPortfolioService: this.props.idPortfolioService!,
			})
			.then((response) => {
				this.setState({ service: response }, () => this.loadSpecialities());
			});
	};

	private loadSpecialities = () => {
		Rest<{ type: string }, Speciality[]>()
			.operation({ type: "SelectAllSpecialities" })
			.then((response) => {
				this.setState({ specialities: response, loaded: true });
			});
	};

	private handleCancel = (e: React.MouseEvent<HTMLElement>) =>
		this.setState({ previewVisible: false });

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

	private getBase64 = (file: RcFile) => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result);
			reader.onerror = (error) => reject(error);
		});
	};

	private validateAndSave = (form: FormInstance) => {
		form.validateFields().then((values) => {
			this.save(values);
		});
	};

	private save = async (values: Store) => {
		const serviceImageBase64Data =
			values.files && values.files[0] && !values.files[0].url && values.files[0].originFileObj
				? await this.getBase64(values.files[0].originFileObj)
				: undefined;
		Rest<SavePortfolioService, any>()
			.operation({
				type: this.props.idPortfolioService ? "EditPortfolioService" : "NewPortfolioService",
				idPortfolio: this.props.idPortfolio,
				idPortfolioService: this.props.idPortfolioService,
				speciality: values.speciality.value,
				nameService: values.nameService,
				valueDuration: values.valueDuration,
				amtPrice: values.amtPrice,
				flagAllowOnlineRes: values.flagAllowOnlineRes ? 1 : 0,
				flagAllowOnlineVid: values.flagAllowOnlineVid ? 1 : 0,
				flagShowPrice: values.flagShowPrice ? 1 : 0,
				flagAllowPriorPayment: values.flagAllowPriorPayment ? 1 : 0,
				base64ImageService: serviceImageBase64Data ? serviceImageBase64Data : undefined,
				hasServicePhoto: values.files && values.files.length > 0 ? true : false,
			})
			.then((response) => this.props.onClose(true));
	};
}

export default withTranslation("serviceForm")(ServiceFormContainer);

import { FormInstance, Modal } from "antd";
import { Store } from "antd/lib/form/interface";
import { RcFile, UploadChangeParam, UploadFile } from "antd/lib/upload/interface";
import _ from "lodash";
import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import {
	default as LocationFile,
	default as LocationIQ,
	default as LocationInfo,
} from "types/entities/Location";
import Organization from "types/entities/Organization";
import enumUploadType from "types/enums/EnumUploadType";
import { URL } from "utils/rest";
import { Rest } from "utils/utils";
import View from "./LocationDetailsForm";
import LocationDetailsModal from "./LocationDetailsModal";
import chica from "images/general/chica.jpg";
import chico from "images/general/chico.jpg";
import gafaslimpias from "images/general/gafaslimpias.jpg";
import muela from "images/dental/muela.jpg";
import radio from "images/dental/radio.jpg";
import sonrisa from "images/dental/sonrisa.jpg";
import gatoychica from "images/veterinaria/gatoychica.jpg";
import perroychico from "images/veterinaria/perroychico.jpg";
import movil from "images/veterinaria/movil.jpg";
import Service from "types/entities/Service";

interface IProps {
	visible?: boolean;
	idLocationSelected?: number;
	onClose: (saved: boolean) => void;
}

export interface IState {
	loaded?: boolean;
	locationDetails?: LocationInfo;
	imagesLocation?: any[];
	fileList?: UploadFile[];
	previewVisible: boolean;
	previewImage: string;
	previewTitle: string;
	deleteFileList?: number[];
	selectedServices?: Service[];
	selectedServicesPreview?: any[];
	services: Service[];
	locations?: LocationIQ[];
	location?: LocationIQ;
	addressKey?: number;
	geoLoc?: boolean;
	idOrganizationSelected?: number;
	organizations?: Organization[];
	previewProfileModal: boolean;
	providersLocation: any[];
	LocationsPublicProfileKey?: number;
}

class LocationDetailsFormContainer extends React.Component<WithTranslation & IProps, IState> {
	public state: IState = {
		previewVisible: false,
		previewImage: "",
		previewTitle: "",
		previewProfileModal: false,
		providersLocation: [],
		selectedServicesPreview: [],
		services: []
	};

	public componentDidMount() {
		this.loadOrganizations();
		if (this.props.idLocationSelected) {
			this.loadData();
		} else {
			this.setState({ loaded: true });
		}
		this.loadServices();
	}

	public loadOrganizations = () => {
		Rest<{ type: string }, any>()
			.operation({ type: "SelectOrganizations" })
			.then((response) => {
				this.setState({ ...this.state, organizations: response });
			});
	};

	public filterOptions = (inputValue: String) => {
		if (inputValue !== "") {
			Rest<{ type: string; inputValue: String }, any>()
				.operation({ type: "SelectOrganizationsByName", inputValue: inputValue })
				.then((response) => {
					this.setState({ ...this.state, organizations: response });
				});
		} else {
			this.loadOrganizations();
		}
	};

	public selectOrganization = (idOrganization: number) => {
		this.setState({ ...this.state, idOrganizationSelected: idOrganization });
	};

	public render() {
		return this.state && this.state.loaded ? (
			<>
			<Modal
				style={{overflow:'hidden',top: 40}}
				className="location__details__modal"
				open={this.state.previewProfileModal}
				footer={""}
				onCancel={() => {
					this.setState({previewProfileModal : false})
				}}>
				{<LocationDetailsModal
					{...this.state}
					key={this.state.LocationsPublicProfileKey}
					visible={true}
					servicesPreview={this.state.selectedServicesPreview?.length != 0 ? this.state.selectedServicesPreview : this.state.selectedServices}
					/>}
			</Modal>
			<View
				{...this.state}
				idLocationSelected={this.props.idLocationSelected}
				visible={this.props.visible}
				onCancel={this.props.onClose}
				onSubmit={this.validateAndSave}
				handlePreview={this.handlePreview}
				handleChange={this.handleChange}
				handleCancel={this.handleCancel}
				handlePreviewProfile={this.handlePreviewProfile}
				searchLocation={this.onSearchLocation}
				onSelectLocation={this.onSelectLocation}
				geoPosition={this.geoPosition}
				onChangeSearch={this.selectOrganization}
				filterOptions={this.filterOptions}
			/>
			</>
		) : (
			<></>
		);
	}

	private loadData = () => {
		const promises: Array<Promise<any>> = [];
		const req1 = Rest<{ type: string; idLocation: number }, LocationInfo>();
		const req2 = Rest<{ type: string; idLocation: number }, LocationFile[]>();
		const req3 = Rest<{ type: string; idLocation: number }, any[]>();

		promises.push(
			req1.operation({
				type: "SelectLocationDataByIdLocation",
				idLocation: this.props.idLocationSelected!,
			})
		);
		promises.push(
			req2.operation({
				type: "SelectFilesByIdLocation",
				idLocation: this.props.idLocationSelected!,
			})
		);

		promises.push(
			req3.operation({
				type: "SelectServicesByLocation",
				idLocation: this.props.idLocationSelected!,
			})
		);


		Promise.all(promises).then((response) => {
			this.setState({
				locationDetails: response[0],
				fileList: this.getFileList(response[1]),
				selectedServices: response[2],
				loaded: true,
			});
			this.loadImages(this.getFileList(response[1]),response[0]);
		});
	};

	private loadImages = (list: UploadFile[],locationinfo?:LocationInfo) => {
		if(list && list.length == 0 ){
			//console.log(locationinfo?.service)
			switch (locationinfo?.service) {
				case 'Dental':
				this.setState({imagesLocation: [muela,radio,sonrisa]});
				break;
				case 'Veterinaria':
				this.setState({imagesLocation: [perroychico,gatoychica,movil]});
				break;
				default:
				this.setState({imagesLocation: [chica,chico,gafaslimpias]});
			  }
		}else if(list && list.length > 0){
			 this.UpdateImagesUrl(list)
		}
	}

	private UpdateImagesUrl = (list: UploadFile[]) => {
		
		var fileListAux: (string | undefined)[] = [] 
		var auxUrl: any = "";

		list.forEach(async (file) => {
			if(!file.url){
				auxUrl = await this.getBase64(file.originFileObj!)
			}
			fileListAux.push(file.url ? file.url: auxUrl)
		});
		this.setState({imagesLocation: fileListAux});
	}

	private getFileList = (list: LocationFile[]) => {
		const fileList: UploadFile[] = [];

		list &&
			list.forEach((file) => {
				fileList.push({
					uid: file.idLocationFile + "",
					name: file.nameFile,
					status: "done",
					type: file.typeMime,
					size: file.nbrSize,
					url: file.typeFile === 1 ? URL + "/file?bf&idFile=" + file.idFile : undefined,
					preview: file.typeFile === 1 ? URL + "/file?bf&idFile=" + file.idFile : undefined,
				} as UploadFile);
			});

		return fileList;
	};

	private onSearchLocation = _.debounce((value: string) => this.searchLocation(value), 500);

	public searchLocation = (value: string) => {
		if (value.length < 3) {
			this.setState({ location: undefined });
			return;
		}

		if (this.state.geoLoc) {
			this.setState({ geoLoc: false });
			return;
		}

		Rest<{ type: string; value: string }, LocationIQ[]>()
			.operation({ type: "AddressListByQuery", value }, true)
			.then((response) => {
				this.setState({ locations: response });
			});
	};

	private geoPosition = () => {
		navigator.geolocation.getCurrentPosition((position) => {
			Rest<{ type: string; latitude: number; longitude: number }, LocationIQ>()
				.operation(
					{
						type: "GetGeoLocation",
						latitude: position.coords.latitude,
						longitude: position.coords.longitude,
					},
					true
				)
				.then((response) => {
					this.setState({
						location: response,
						locations: [response],
						addressKey: new Date().getTime(),
						geoLoc: true,
					});
				});
		});
	};

	private loadServices = () => {
		Rest<{ type: string;}, 	[]>()
			.operation({
				type: "SelectServiceList",
			})
			.then((response) => {
				this.setState({
					services: response,
				});
			});
	}


	private handlePreviewProfile = (values?: any) => {

		this.setState({LocationsPublicProfileKey: new Date().getTime()})

		if(values && this.state && this.state.loaded){
			
			this.setState((prevState: Readonly<IState>) => {
				
				return {
					selectedServicesPreview: this.state.services?.filter(service => values.valueServices?.includes(String(service.idService))),
					locationDetails: {
					...prevState.locationDetails,
					valueAddress: values.valueAddress, 
					valuePhone: values.valuePhone,
					nameLocation: values.nameLocation,
					valueEmail: values.valueEmail,
					schedule: values.schedule
					}
				} as IState; 
				});
				this.setState({previewProfileModal: true})
		}

	}

	private onSelectLocation = (option: any) => {
		const location = (this.state.locations || []).filter((loc) => loc.place_id === option.key);
		this.setState({ location: location[0] });
	};

	private validateAndSave = (form: FormInstance) => {
		form.validateFields().then((values) => 	{
			this.save(values);
		});
	};

	private save = async (values: Store) => {
		console.log(values)
		const locationImageBase64Data =
			values.files && values.files[0] && !values.files[0].url && values.files[0].originFileObj
				? await this.getBase64(values.files[0].originFileObj)
				: undefined;
		console.log(this.state.idOrganizationSelected)
		const formData = new FormData();
		const locationDetailsFields = {
			idOrganization: this.state.idOrganizationSelected
				? this.state.idOrganizationSelected
				: undefined,
			idLocation: this.props.idLocationSelected ? this.props.idLocationSelected : undefined,
			base64ImageLocation: locationImageBase64Data ? locationImageBase64Data : undefined,
			hasLocationPhoto: values.files ? values.files && values.files.length > 0 : false,
			nameLocation: values.nameLocation,
			descLocation: values.descLocation,
			valueAddress: this.state.location
				? this.state.location.display_name
				: this.state.locationDetails?.valueAddress,
			valueLong: this.state.location
				? this.state.location.lon
				: this.state.locationDetails?.valueLong,
			valueLat: this.state.location
				? this.state.location.lat
				: this.state.locationDetails?.valueLat,
			valuePhone: values.valuePhone,
			valueEmail: values.valueEmail,
			valueAddressDetails: values.valueAddressDetails,
			idProvince: values.idProvince,
			deleteFileList: this.state.deleteFileList,
			services: values.valueServices,
			schedule: values.schedule,
		};

		formData.append("locationDetailsFields", JSON.stringify(locationDetailsFields));

		this.state.fileList &&
			this.state.fileList.forEach((file) => {
				if (file.originFileObj) {
					formData.append("file", file.originFileObj);
				}
			});

		Rest<void, any>()
			.fetchURL("/fileUpload?typeUpload=" + enumUploadType.FILE_LOCATION, {
				method: "POST",
				body: formData,
			})
			.then((response) => this.props.onClose(true));
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

	/*private handleChange = (info: UploadChangeParam) => {
		const deleteFileList = [...(this.state.deleteFileList || [])];

		if (info.file.status === "removed") {
			deleteFileList.push(Number(info.file.uid));
		}

		this.setState({ fileList: info.fileList, deleteFileList });
	};*/

	private handleChange = async (info: UploadChangeParam) => {
		const deleteFileList = [...(this.state.deleteFileList || [])];
		var listImages: UploadFile<any>[] = []

		if (info.file.status === "removed") {
			deleteFileList.push(Number(info.file.uid));
		}

		if(info.fileList && info.fileList.length > 0){
			listImages = info.fileList.filter(file => file.type === 'image/jpeg' || file.type === 'image/png')
		}
		
		this.setState({ fileList: listImages, deleteFileList});
		this.loadImages(listImages, this.state.locationDetails )
	};

	private getBase64 = (file: RcFile) => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result);
			reader.onerror = (error) => reject(error);
		});
	};
}

export default withTranslation("locationForm")(LocationDetailsFormContainer);

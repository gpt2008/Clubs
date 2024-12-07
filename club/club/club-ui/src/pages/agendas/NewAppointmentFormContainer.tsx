import { FormInstance, notification } from "antd";
import { Store } from "antd/lib/form/interface";
import _ from "lodash";
import React, { Children } from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { AppointmentNotificationChannel } from "types/entities/Appointment";
import LocationInfo from "types/entities/Location";
import IPatient from "types/entities/Patient";
import Portfolio from "types/entities/Portfolio";
import ProviderData from "types/entities/Provider";
import Service, { NewService } from "types/entities/Service";
import enumTypeChannelNotification from "types/enums/EnumTypeChannelNotification";
import { Rest, validarEmail } from "../../utils/utils";
import View from "./NewAppointmentForm";
import dayjs from "dayjs";

export interface IChannelState {
	idPatientNotifChannel: number;
	idPatient: number;
	typeChannel: number;
	dateCreation: Date;
	dateDeletion: Date;
}

interface IProps {
	visible?: boolean;
	idProvider?: number;
	idScheduleSlot?: number;
	typeCalendarClick?: string;
	date?: Date;
	onClose: (save: boolean) => void;
	resetStyle?: () => void;
	nuevaCita?: boolean; // Para pantalla de nueva cita
	idService?: number[];
	service?: string[];
}

export interface IState {
	loaded?: boolean;
	provider?: ProviderData;
	providers?: ProviderData[];
	locations?: LocationInfo[];
	services?: NewService[];
	patients?: IPatient;
	cbGroupStyle?: string;
	channelsResponce?: number[];
	loading: boolean;
	loadedSearch: boolean;
	idProvider?: number;
}

class NewAppointmentFormContainer extends React.Component<WithTranslation & IProps, IState> {
	public state: IState = {
		loading: false,
		loadedSearch: false
	};

	public componentDidMount() {
		this.props.visible && this.loadData();
	}

	public render() {
		return this.state.loaded ? (
			<View
				{...this.state}
				visible={this.props.visible}
				fromSlot={!!this.props.idScheduleSlot}
				fromMonth={this.props.typeCalendarClick === "dayGridMonth"}
				date={this.props.date}
				getServices={this.getServices}
				searchPatient={this.doSearchPatient}
				onCancel={() => this.props.onClose(false)}
				onSubmit={this.validateAndSave}
				onPatientSelection={this.PatientSelected}
				loading={this.state.loading}
				nuevaCita={this.props.nuevaCita}
				setIdProvider={this.setIdProvider}
				idProvider={this.state.idProvider}
				idService={this.props.idService}
				service={this.props.service}
			/>
		) : (
			<></>
		);
	}

	private loadData = () => {
			Rest<{ type: string; idProvider?: number; date: Date; idScheduleSlot?: number;idEspecialidad?: number; idSubespecialidad?: number; idActo?: number }, any>()
				.operation({
					type: "GetNewAppointmentData",
					idProvider: this.props.nuevaCita === undefined ? this.props.idProvider! : undefined, // Para pantalla de nueva cita
					date: this.props.date!,
					idScheduleSlot: this.props.nuevaCita === undefined ? this.props.idScheduleSlot : undefined,
					idEspecialidad:  this.props.nuevaCita && this.props.idService ? this.props.idService[0] : undefined,
					idSubespecialidad:  this.props.nuevaCita && this.props.idService ? this.props.idService[1] : undefined,
					idActo:  this.props.nuevaCita && this.props.idService ? this.props.idService[2]: undefined,
				})
				.then((response) => {
					const locations = response.slotsInfo
						? [
								{
									idLocation: response.slotsInfo.idLocation,
									nameLocation: response.slotsInfo.nameLocation,
								},
						]
						: response.locations;
					const services = this.buildServiceStruct(response.services ? response.services : []);
					this.setState({
						provider: response.provider,
						locations,
						services,
						loaded: true,
						providers: response.listProviders
					});
				});
	};

	private PatientSelected = (form: FormInstance, id: number) => {
		Rest<{ type: string; idPatient: number }, IChannelState[]>()
			.operation({
				type: "SelectPatientNotifChannel",
				idPatient: id,
			})
			.then((response) => {
				form.setFieldsValue({
					channelCbGroup: response.map((e) => e.typeChannel),
				});
			});
	};

	private buildServiceStruct = (services: NewService[]) => {
		return _(services)
			.groupBy("idEspecialidad")
			.map((especialidadGroup, especialidadKey) => ({
				value: especialidadGroup[0].idEspecialidad.toString(), 
				label: especialidadGroup[0].nameEspecialidad,
				children: _(especialidadGroup)
					.groupBy("IdSubespecialidad")
					.map((subespecialidadGroup, subespecialidadKey) => ({
						value: subespecialidadGroup[0].IdSubespecialidad.toString(),
						label: subespecialidadGroup[0].nameSubespecialidad,
						children: _(subespecialidadGroup)
                        .map((acto) => ({
                            valueDuration: acto.valueDuration,
                            value: acto.idActo.toString(),
                            label: acto.nameActo,
                        }))
						.orderBy("label", "asc")
						.value(),
					}))
					.orderBy("label", "asc")
					.value(),
			}))
			.orderBy("label", "asc")
			.value() as NewService[];
	};
	
	private getServices = (idProvider: number) => {
		Rest<{ type: string; idProvider: number }, NewService[]>()
			.operation({
				type: "GetCarteraServiciosProviderByIdProvider",
				idProvider,
			})
			.then((response) => this.setState({ services: this.buildServiceStruct(response) }));
	};

	//private searchPatient = _.debounce((value: string) => this.doSearchPatient(value), 500);

	private doSearchPatient = (value: string, form: FormInstance) => {
		form.setFieldsValue({
			...form.getFieldsValue(),
			namePatient: undefined,
			surname1: undefined,
			surname2: undefined,
			phone: undefined,
			email: undefined,
		});
		this.setState({loading: true, loadedSearch: false})
		if (value && value != " "){
		Rest<{ type: string; value: string }, IPatient>()
			.operation(
				{
					type: "SelectPatientByNIF",
					value,
				},
				true
			)
			.then((response) => {
				this.setState({ patients: response, channelsResponce: [], loadedSearch:true })
				if (response){
					form.setFieldsValue({
					...form.getFieldsValue(),
					namePatient: response.namePatient,
					surname1: response.nameSurname1,
					surname2: response.nameSurname2,
					tipo: response.typeIdentification,
					dni: response.codeIdentification,
					dateBirth: response.dateBirth ?  dayjs(response.dateBirth): undefined,
					phone: response.valueContactPhone,
					email: response.valueContactEmail,
				});}
			});
		}
		this.setState({loading: false})
	};

	private validateAndSave = (form: FormInstance) => {
		form.validateFields().then((values) => {
			if (values.email && !validarEmail(values.email)) {
				notification["error"]({
					message: this.props.t("emailFormatError"),
				});
				return;
			}
			if(!values.namePatient){
				notification["error"]({
					message: this.props.t("notSearched"),
				});
				return;
			}

			this.save(values);
		});
	};

	private save = (values: Store) => {
		Rest<
			{
				type: string;
				idProvider: number;
				idLocation: number;
				date: Date;
				time: number;
				duration: number;
				idPatient?: number;
				namePatient?: string;
				surname1?: string;
				surname2: string;
				typeIdentification?: number;
				ndoc?: string;
				phone?: string;
				email?: string;
				note?: string;
				flagOnline: boolean;
				idEspecialidad: number;
				idSubespecialidad: number;
				idActo: number;
				dateBirth?: Date;

			},
			any
		>()
			.operation({
				type: "NewAppointment",
				idProvider: this.props?.idProvider ? this.props?.idProvider : values.prestador, // Si hay medico seleccionado / se utiliza el dropDown
				idLocation: values.location,
				date: values.date,
				time: Number(this.getMinutes(values.time.format("HH:mm"))),
				duration: values.duration,
				idPatient: this.state.patients?.idPatient,
				namePatient: values.namePatient,
				surname1: values.surname1,
				surname2: values.surname2,
				typeIdentification: Number(values.tipo),
				ndoc: values.dni,
				phone: values.phone,
				email: values.email,
				note: values.note,
				flagOnline: values.flagOnline !== undefined ? values.flagOnline : false,
				idEspecialidad: this.props.nuevaCita ? this.props.idService![0] : Number(values.service[0]),
				idSubespecialidad: this.props.nuevaCita ? this.props.idService![1] :Number(values.service[1]),
				idActo: this.props.nuevaCita ? this.props.idService![2] : Number(values.service[2]),
				dateBirth: values.dateBirth
			})
			.then(() => this.props.onClose(true));
	};

	private getMinutes = (time: string) => {
		if (time !== undefined) {
			const parts = time.split(":");
			return parseInt(parts[0]) * 60 + parseInt(parts[1]) + "";
		}

		return "";
	};

	private setIdProvider = (idProvider?: number) => {
		this.setState({
			idProvider: idProvider
		})
	};
}

export default withTranslation("newAppointmentForm")(NewAppointmentFormContainer);

import { FormInstance } from "antd";
import { Store } from "antd/lib/form/interface";
import dayjs from "dayjs";
import _ from "lodash";
import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import AppointmentDetail from "types/entities/Appointment";
import Location from "types/entities/Location";
import Portfolio from "types/entities/Portfolio";
import Provider from "types/entities/Provider";
import Service, { NewService } from "types/entities/Service";
import { Rest } from "utils/utils";
import DoctorsCalendarContainer from "./DoctorsCalendarContainer";
import View from "./EditAppointmentForm";

interface IProps {
	visible?: boolean;
	idAppointment?: number;
	patient?: string;
	onClose: (saved: boolean) => void;
	nuevaCita?: boolean;
	idService?: number[];
	service?: string[];
}

export interface IState {
	loaded?: boolean;
	appointment?: AppointmentDetail;
	providerList?: Provider[];
	locations?: Location[];
	portfolios?: Portfolio[];
	services?: NewService[];
	prestadorSelected?: number;
	calendarVisible?: boolean;
	calendarKey?: number;
	form?: FormInstance;
}

class EditAppointmentFormContainer extends React.Component<WithTranslation & IProps, IState> {
	public state: IState = {};

	public componentDidMount() {
		if (this.props.idAppointment) {
			this.loadData();
		}
	}

	public render() {
		return this.state && this.state.loaded ? (
			<>
				<View
					{...this.state}
					patient={this.props.patient}
					visible={this.props.visible}
					onCancel={this.props.onClose}
					onSubmit={this.validateAndSave}
					getServices={this.getServices}
					onClickCalendar={this.onClickCalendar}
					nuevaCita={this.props.nuevaCita}
				/>

				{/* Appointment details form modal */}
				<DoctorsCalendarContainer
					prestadorSelected={this.state.prestadorSelected!}
					key={this.state.calendarKey}
					visible={this.state.calendarVisible}
					onClose={this.onCloseCalendar}
				/>
			</>
		) : (
			<></>
		);
	}

	private loadData = () => {
		Rest<{ type: string; idAppointment: number; idEspecialidad?: number; idSubespecialidad?: number; idActo?: number  }, any>()
			.operation({
				type: "GetEditAppointmentData",
				idAppointment: this.props.idAppointment!,
				idEspecialidad:  this.props.nuevaCita && this.props.idService ? this.props.idService[0] : undefined,
				idSubespecialidad:  this.props.nuevaCita && this.props.idService ? this.props.idService[1] : undefined,
				idActo:  this.props.nuevaCita && this.props.idService ? this.props.idService[2]: undefined,
			})
			.then((response) => {
				this.setState(
					{
						appointment: response.appointmentDetail,
						providerList: response.providerList,
						locations: response.locations,
						portfolios: response.portfolios,
						loaded: true,
					},
					() => this.getServices(response.appointmentDetail.idProvider)
				);
			});
	};

	private getServices = (idProvider: number) => {
		Rest<{ type: string; idProvider: number }, NewService[]>()
			.operation({
				type: "GetCarteraServiciosProviderByIdProvider",
				idProvider,
			})
			.then((response) => {
				this.setState({ services: this.buildServiceStruct(response) })
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
						children: subespecialidadGroup.map(acto => ({
							valueDuration: acto.valueDuration,
							value: acto.idActo.toString(), 
							label: acto.nameActo,
						})),
					}))
					.value(),
			}))
			.value() as NewService[];
	};

	private onClickCalendar = (form: FormInstance) => {
		this.setState({
			calendarVisible: true,
			calendarKey: new Date().getTime(),
			prestadorSelected: form.getFieldValue("prestador"),
			form: form,
		});
	};

	private onCloseCalendar = (info: any) => {
		this.setState({ calendarVisible: false }, () => {
			if (info && this.state.form) {
				this.state.form.setFieldsValue({
					...this.state.form.getFieldsValue(),
					dateAppointment: info.date ? dayjs(info.date) : undefined,
					valueTime: info.view.type !== "dayGridMonth" ? dayjs(info.date) : undefined,
				});
			}
		});
	};

	private validateAndSave = (form: FormInstance) => {
		form.validateFields().then((values) => {
			this.save(values);
		});
	};

	private save = (values: Store) => {

		Rest<
			{
				type: string;
				idAppointment: number;
				idProvider: number;
				idLocation: number;
				date: Date;
				time: number;
				duration: number;
				note?: string;
				flagOnline: boolean;
				idEspecialidad: number;
				idSubespecialidad: number;
				idActo: number;
			},
			any
		>()
			.operation({
				type: "EditAppointment",
				idAppointment: this.props.idAppointment!,
				idProvider: values.prestador,
				idLocation: values.location,
				date: values.dateAppointment,
				time: Number(this.getMinutes(values.valueTime.format("HH:mm"))),
				duration: values.valueDuration,
				note: values.valueNote,
				flagOnline: values.flagOnline ? values.flagOnline : false,
				idEspecialidad: this.state.appointment?.idEspecialidad!,
				idSubespecialidad: this.state.appointment?.idSubespecialidad!,
				idActo: this.state.appointment?.idActo!
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
}

export default withTranslation("newAppointmentForm")(EditAppointmentFormContainer);

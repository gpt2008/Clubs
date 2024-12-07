import { DatesSetArg } from "@fullcalendar/core";
import dayjs from "dayjs";
import AppointmentDetailContainer from "pages/agendas/AppointmentDetailContainer";
import NewAppointmentFormContainer from "pages/agendas/NewAppointmentFormContainer";
import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import Appointment from "types/entities/Appointment";
import Slot from "types/entities/Slot";
import enumAppointmentStatusNew from "types/enums/EnumAppointmentStatusNew";
import EventHub, { Event } from "utils/eventHub";
import { Rest } from "utils/utils";
import View from "./NuevaCita";
import NomenclatorDetails from "types/entities/Nomenclator";
import _ from "lodash";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { width } from "@fortawesome/free-solid-svg-icons/faAddressBook";

export interface IState {
	loaded?: boolean;
	idProviderSelected?: number;
	forceProviderPhotoReloadKey?: number;
	calendarHeight?: number | string;
	appointmentDetailVisible?: boolean;
	newAppointmentFormVisible?: boolean;
	newAppointmentFormKey?: number;
	appointmentDetailKey?: number;
	idScheduleSlotSelected?: number;
	idAppointmentSelected?: number;
	dateSelected?: Date;
	typeCalendarClick?: string;
    idEspecialidad?: number;
    idSubespecialidad?: number;
    idActo?: number;
	idService?: number[];
	service?: string[];
	services?: NomenclatorDetails[];
	checked?: boolean;
}

class NuevaCitaContainer extends React.Component<WithTranslation, IState> {
	calendarComponentRef: any = React.createRef();

	public state: IState = {};

	private eventRefPrestadorCard?: string;

	public componentDidMount() {
		this.eventRefPrestadorCard = EventHub.on(Event.OPEN_PROVIDER_CALENDAR, (parameters: any) => {
			this.loadData(parameters.idPrestador, parameters.date);
		});
        this.loadData();
	}

	public render() {
		return this.state.loaded ? (
			<>
				<View
					{...this.state}
					calendarComponentRef={this.calendarComponentRef}
					//selectOrganization={this.selectOrganization}
					//filterOptions={this.filterOptions}
					events={this.events}
					eventClick={this.eventClick}
					dateClick={this.dateClick}
					dateSet={this.dateSet}
                    selectNomenclator={this.selectNomenclator}
					onCheck={this.onCheck}
				/>

				{/* New appointment form */}
				<NewAppointmentFormContainer
					key={this.state.newAppointmentFormKey}
					visible={this.state.newAppointmentFormVisible}
					//idProvider={this.state.idProviderSelected}
					//idScheduleSlot={this.state.idScheduleSlotSelected}
					date={this.state.dateSelected}
					typeCalendarClick={this.state.typeCalendarClick}
					onClose={this.closeNewAppointmentModal}
					nuevaCita={true}
					idService={this.state.idService}
					service={this.state.service}
				/>

				{/* Appointment detail */}
				<AppointmentDetailContainer
					key={this.state.appointmentDetailKey}
					visible={this.state.appointmentDetailVisible}
					idAppointment={this.state.idAppointmentSelected}
					onClose={this.closeAppointmentDetail}
					nuevaCita={true}
					idService={this.state.idService}
					service={this.state.service}
				/>
			</>
		) : (
			<></>
		);
	}

	private onCheck = (checked: any) => {
		this.setState({
			checked: checked.target.checked
		})
		this.calendarComponentRef.current?.getApi().refetchEvents();
	};

	private loadData = (idProvider?: number, dateStart?: Date) => {
        Rest<{ type: string;}, NomenclatorDetails[]>()
			.operation({
				type: "SelectNomenclatorsList",
			})
			.then((response) => {
				this.setState(
					{
						services: this.buildServiceStruct(response ? response : []),
						forceProviderPhotoReloadKey: new Date().getTime(),
						loaded: true,
					},
					() => {
						this.setState({ calendarHeight: "calc(100vh - 240px)" });
						if (idProvider) {
							this.calendarComponentRef.current.getApi().changeView("timeGridDay", dateStart);
							this.calendarComponentRef.current.getApi().refetchEvents();
						}
					}
				);
			});
	};

    private buildServiceStruct = (services: NomenclatorDetails[]) => {
        return _(services)
        .groupBy("idSpeciality")
        .map((especialidadGroup) => ({
            value: especialidadGroup[0].idSpeciality.toString(),
            label: especialidadGroup[0].nameSpeciality,
            children: _(especialidadGroup)
                .groupBy("idSubspeciality")
                .map((subespecialidadGroup) => ({
                    value: subespecialidadGroup[0].idSubspeciality.toString(),
                    label: subespecialidadGroup[0].nameSubspeciality,
                    children: _(subespecialidadGroup)
                        .map((acto) => ({
                            valueDuration: acto.valueDuration,
                            value: acto.idAct.toString(),
                            label: acto.nameAct,
                        }))
                    .orderBy("label", "asc")
                    .value(),
                }))
                .orderBy("label", "asc")
                .value(),
        }))
        .orderBy("label", "asc")
        .value() as NomenclatorDetails[];
	};

    private selectNomenclator = (idSpeciality?: number, idSubspeciality?: number, idAct?: number,
								nameSpeciality?: string, nameSubespeciality?: string, nameAct?: string, duration?:number ) => {
        this.setState({
            idEspecialidad: idSpeciality,
            idSubespecialidad: idSubspeciality,
            idActo: idAct,
			idService: [idSpeciality!,idSubspeciality!,idAct!, duration!],
			service:[nameSpeciality!,nameSubespeciality!,nameAct!]
        }, () => {
			idSpeciality !== undefined && this.calendarComponentRef.current.getApi().refetchEvents();
		}
		)
    };

	private events = (info: any, successCallback: any) => {
		Rest<{ type: string; dateStart: Date; dateEnd: Date, idEspecialidad?: number, idSubespecialidad?: number, idActo?: number, }, any>()
			.operation(
				{
					type: "GetProviderSchedulesSlots",
					dateStart: info.start,
					dateEnd: info.end,
					idEspecialidad: this.state.idEspecialidad,
					idSubespecialidad: this.state.idSubespecialidad,
					idActo: this.state.idActo
				},
				true
			)
			.then((response) => {
				successCallback(this.setEventStruct(response));
			});
	};

	private setEventStruct = (allEvents: any) => {
		const events: any = [];
		dayjs.extend(utc);
		dayjs.extend(timezone);
		// Se utiliza para quitar duplicados y solo coger uno por dia, y hora
		const horariosUnicos = Array.from(
			allEvents.slots.reduce((map:any, horario:Slot) => {
				const key = `${horario.valueDay}-${horario.valueStart}-${horario.valueEnd}`;

			  // Si la clave ya existe, incrementamos el contador
				if (map.has(key)) {
					map.get(key).count += 1;
				} else {
					// Si no existe, creamos un nuevo objeto con count en 1
					map.set(key, { horario, count: 1 });
				}
				return map;
			}, new Map()).values()
		);
		
		horariosUnicos.forEach((slots: any) => {
			const slot = slots.horario;
			const count = slots.count;
			let i = slot.valueStart;
			while (i < slot.valueEnd) {
				const dateStart = dayjs(slot.date);
				const dateStarta = dateStart.minute(i).toDate();

				const dateEnd = dayjs(dayjs(slot.date).format("DD/MM/YYYY"), "DD/MM/YYYY").toDate();
				dateEnd.setMinutes(i + slot.valueInterval);

				let appointmentStatus = "green";
				const citasFiltradas = (allEvents.appointments || []).filter((cita: any) => {
					return new Date(cita.dateAppointment).getTime() === new Date(slot.date).getTime();
				});

				let counter = 0;
				citasFiltradas.some((cita: any) => {
					const citaFecha = dayjs(cita.dateAppointment).minute(cita.valueTime).toDate();
					const citaHasta = dayjs(citaFecha).add(cita.valueDuration, 'minute').toDate();
					if (dateStarta.getTime() >= citaFecha.getTime() && dateEnd.getTime() <= citaHasta.getTime()){ // Poner mas condiciones
						if (counter < count) {
							counter += 1; // Si no hemos alcanzado el máximo de medicos, incrementamos
						} 
					}
				});

				if (counter === count) appointmentStatus = "red";
				else if (counter > 0) appointmentStatus = "yellow";
				  
				switch (appointmentStatus) {
					case "green":
						appointmentStatus = "#77DD77";
						break;
					case "yellow":
						appointmentStatus = "rgb(237, 218, 11)";
						break;
					case "red":
						appointmentStatus = "#FF6961";
						break;
					default:
						appointmentStatus = "#77DD77";
						break;
				};

				events.push({
					start: dateStarta,
					end: dateEnd,
					extendedProps: { idScheduleSlot: slot.idScheduleSlot },
					display: "background",
					borderColor: appointmentStatus,
					backgroundColor: appointmentStatus 
				});
				i += slot.valueInterval;
			}
		});

		// Si el checkbox esta en true, se muestan las citas creadas
		if (this.state.checked) {
			allEvents.appointments?.forEach((appointment: Appointment) => {
				const dateStart = dayjs(
					dayjs(appointment.dateAppointment).format("DD/MM/YYYY"),
					"DD/MM/YYYY"
				).toDate();
				dateStart.setMinutes(appointment.valueTime);

				const dateEnd = dayjs(
					dayjs(appointment.dateAppointment).format("DD/MM/YYYY"),
					"DD/MM/YYYY"
				).toDate();
				dateEnd.setMinutes(appointment.valueTime + appointment.valueDuration);

				let appointmentStatus = "confirmed";

				switch (appointment.typeStatus) {
					case enumAppointmentStatusNew.PROPOSED:
						appointmentStatus = "proposed";
						break;
					case enumAppointmentStatusNew.CANCELLED:
						appointmentStatus = "cancelled";
						break;
					case 5:
						appointmentStatus = "payment";
						break;
					case enumAppointmentStatusNew.DONE:
						appointmentStatus = "done";
						break;
					default:
						break;
				}

				events.push({
					title:
						appointment.namePatient +
						" " +
						(appointment.nameSurname1 ? " " + appointment.nameSurname1 : "") +
						(appointment.nameSurname2 ? " " + appointment.nameSurname2 : ""),
					start: dateStart,
					end: dateEnd,
					extendedProps: { idAppointment: appointment.idAppointment },
					className: appointmentStatus,
				});
			});
		}

		return events;
	};

	private eventClick = (info: any) => {
		if (info.event.extendedProps.idAppointment) {
			this.setState({
				appointmentDetailVisible: true,
				appointmentDetailKey: new Date().getTime(),
				idAppointmentSelected: info.event.extendedProps.idAppointment,
			});
		} else {
			this.setState({
				newAppointmentFormVisible: true,
				newAppointmentFormKey: new Date().getTime(),
				//idScheduleSlotSelected: info.event.extendedProps.idScheduleSlot,
				dateSelected: info.event.start,
			});
		}
	};

	private dateClick = (info: any) => {
		if (!this.state.idAppointmentSelected && !this.state.idScheduleSlotSelected) {
			this.setState({
				newAppointmentFormVisible: true,
				newAppointmentFormKey: new Date().getTime(),
				dateSelected: info.date,
				typeCalendarClick: info.view.type,
			});
		}
	};

	private dateSet = (dateInfo: DatesSetArg) => {
		if (dayjs().isAfter(dayjs(dateInfo.start)) && dayjs().isBefore(dayjs(dateInfo.end))) {
			this.calendarComponentRef.current
				?.getApi()
				.scrollToTime(dayjs().subtract(1, "hour").format("HH:mm:ss"));
		} else {
			this.calendarComponentRef.current?.getApi().scrollToTime("08:00:00");
		}
	};

	private closeNewAppointmentModal = (save: boolean) => {
		this.setState(
			{
				newAppointmentFormVisible: false,
				idScheduleSlotSelected: undefined,
				dateSelected: undefined,
				typeCalendarClick: undefined,
			},
			() => {
				//this.selectProvider(this.state.idProviderSelected!);
			}
		);
	};

	private closeAppointmentDetail = (save: boolean) => {
		this.setState({ appointmentDetailVisible: false, idAppointmentSelected: undefined }, () => {
			//this.selectProvider(this.state.idProviderSelected!);
		});
	};
}

export default withTranslation("newSchedule")(NuevaCitaContainer);

import { DatesSetArg } from "@fullcalendar/core";
import dayjs from "dayjs";
import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import Appointment from "types/entities/Appointment";
import Organization from "types/entities/Organization";
import ProviderNameAndPhoto from "types/entities/Provider";
import Slot from "types/entities/Slot";
import enumAppointmentStatusNew from "types/enums/EnumAppointmentStatusNew";
import EventHub, { Event } from "utils/eventHub";
import { Rest } from "utils/utils";
import View from "./AgendasSchedule";
import AppointmentDetailContainer from "./AppointmentDetailContainer";
import NewAppointmentFormContainer from "./NewAppointmentFormContainer";

export interface IState {
	loaded?: boolean;
	idProviderSelected?: number;
	providers?: ProviderNameAndPhoto[];
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
	organizations?: Organization[];
	idOrganizationSelected?: number;
}

class AgendasScheduleContainer extends React.Component<WithTranslation, IState> {
	calendarComponentRef: any = React.createRef();

	public state: IState = {};

	private eventRefPrestadorCard?: string;

	public componentDidMount() {
		this.eventRefPrestadorCard = EventHub.on(Event.OPEN_PROVIDER_CALENDAR, (parameters: any) => {
			this.loadData(parameters.idPrestador, parameters.date);
			this.loadOrganizations();
		});
		this.loadOrganizations();
	}

	public render() {
		return this.state.loaded ? (
			<>
				<View
					{...this.state}
					calendarComponentRef={this.calendarComponentRef}
					selectProvider={this.selectProvider}
					selectOrganization={this.selectOrganization}
					filterOptions={this.filterOptions}
					filterProviders={this.filterProviders}
					events={this.events}
					eventClick={this.eventClick}
					dateClick={this.dateClick}
					dateSet={this.dateSet}
				/>

				{/* New appointment form */}
				<NewAppointmentFormContainer
					key={this.state.newAppointmentFormKey}
					visible={this.state.newAppointmentFormVisible}
					idProvider={this.state.idProviderSelected}
					idScheduleSlot={this.state.idScheduleSlotSelected}
					date={this.state.dateSelected}
					typeCalendarClick={this.state.typeCalendarClick}
					onClose={this.closeNewAppointmentModal}
				/>

				{/* Appointment detail */}
				<AppointmentDetailContainer
					key={this.state.appointmentDetailKey}
					visible={this.state.appointmentDetailVisible}
					idAppointment={this.state.idAppointmentSelected}
					onClose={this.closeAppointmentDetail}
				/>
			</>
		) : (
			<></>
		);
	}

	private loadData = (idProvider?: number, dateStart?: Date) => {
		if (this.state.idOrganizationSelected) {
			Rest<{ type: string; idOrganization: number }, any>()
				.operation({
					type: "SelectProviderListByOrg",
					idOrganization: this.state.idOrganizationSelected,
				})
				.then((response) => {
					this.setState(
						{
							providers: response,
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
		} else {
			Rest<{ type: string }, any>()
				.operation({ type: "SelectProviderListByOrgAndUser" })
				.then((response) => {
					this.setState(
						{
							//idProviderSelected: idProvider ? idProvider : response[0] && response[0].idProvider,
							providers: response,
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
		}
	};

	private loadOrganizations = () => {
		Rest<{ type: string }, any>()
			.operation({ type: "SelectOrganizations" })
			.then((response) => {
				this.setState(
					{
						...this.state,
						organizations: response,
						loaded: true,
					},
					() => {
						this.setState({ calendarHeight: "calc(100vh - 240px)" });
					}
				);
			});
	};

	private filterOptions = (inputValue: String) => {
		if (inputValue !== "") {
			Rest<{ type: string; inputValue: String }, any>()
				.operation({ type: "SelectOrganizationsByName", inputValue: inputValue })
				.then((response) => {
					this.setState({
						...this.state,
						organizations: response,
					});
				});
		}
	};

	private filterProviders = (inputValue: string, idOrganization?: number) => {
		if (inputValue !== "") {
			Rest<{ type: string; inputValue: string; idOrganization?: number }, any>()
				.operation({
					type: "SelectProviderByName",
					inputValue: inputValue,
					idOrganization: idOrganization,
				})
				.then((response) => {
					this.setState({
						...this.state,
						providers: response,
					});
				});
		}
	};

	private selectOrganization = (idOrganization: number) => {
		this.setState({ idOrganizationSelected: idOrganization }, () => {
			this.loadData();
		});
	};

	private selectProvider = (idProvider: number | undefined) => {
		this.setState({ idProviderSelected: idProvider }, () => {
			idProvider !== undefined && this.calendarComponentRef.current.getApi().refetchEvents();
		});
	};

	private events = (info: any, successCallback: any) => {
		Rest<{ type: string; idProvider: number; dateStart: Date; dateEnd: Date }, any>()
			.operation(
				{
					type: "GetProviderSchedulesSlots",
					idProvider: this.state.idProviderSelected!,
					dateStart: info.start,
					dateEnd: info.end,
				},
				true
			)
			.then((response) => {
				successCallback(this.setEventStruct(response));
			});
	};

	private setEventStruct = (allEvents: any) => {
		const events: any = [];
		allEvents.slots?.forEach((slot: Slot) => {
			let i = slot.valueStart;
			while (i < slot.valueEnd) {
				const dateStart = dayjs(dayjs(slot.date).format("DD/MM/YYYY"), "DD/MM/YYYY").toDate();
				dateStart.setMinutes(i);

				const dateEnd = dayjs(dayjs(slot.date).format("DD/MM/YYYY"), "DD/MM/YYYY").toDate();
				dateEnd.setMinutes(i + slot.valueInterval);

				events.push({
					start: dateStart,
					end: dateEnd,
					extendedProps: { idScheduleSlot: slot.idScheduleSlot },
					display: "background",
				});
				i += slot.valueInterval;
			}
		});

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
				idScheduleSlotSelected: info.event.extendedProps.idScheduleSlot,
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
				this.selectProvider(this.state.idProviderSelected!);
			}
		);
	};

	private closeAppointmentDetail = (save: boolean) => {
		this.setState({ appointmentDetailVisible: false, idAppointmentSelected: undefined }, () => {
			this.selectProvider(this.state.idProviderSelected!);
		});
	};
}

export default withTranslation("agendasSchedule")(AgendasScheduleContainer);

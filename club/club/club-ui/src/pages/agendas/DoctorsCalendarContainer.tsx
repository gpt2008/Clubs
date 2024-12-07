import { DatesSetArg } from "@fullcalendar/core";
import dayjs from "dayjs";
import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import Appointment from "types/entities/Appointment";
import Slot from "types/entities/Slot";
import enumAppointmentStatusNew from "types/enums/EnumAppointmentStatusNew";
import { Rest } from "../../utils/utils";
import View from "./DoctorsCalendar";

interface IProps {
	visible?: boolean;
	prestadorSelected: number;
	onClose: (info: any) => void;
}

export interface IState {
	calendarHeight?: number;
	loaded?: boolean;
	idScheduleSlotSelected?: number;
	idAppointmentSelected?: number;
	dateSelected?: Date;
}

class DoctorsCalendarContainer extends React.Component<WithTranslation & IProps, IState> {
	public state: IState = {};

	calendarComponentRef: any = React.createRef();

	public componentDidMount() {
		if (this.props.visible) {
			this.loadData();
		}
	}

	public render() {
		return this.state && this.state.loaded ? (
			<View
				{...this.state}
				visible={this.props.visible}
				onClose={this.props.onClose}
				calendarComponentRef={this.calendarComponentRef}
				events={this.events}
				eventClick={this.eventClick}
				dateClick={this.dateClick}
				dateSet={this.dateSet}
			/>
		) : (
			<></>
		);
	}

	private loadData = () => {
		this.setState({ loaded: true });
	};

	private events = (info: any, successCallback: any) => {
		Rest<{ type: string; idProvider: number; dateStart: Date; dateEnd: Date }, any>()
			.operation({
				type: "GetProviderSchedulesSlots",
				idProvider: this.props.prestadorSelected!,
				dateStart: info.start,
				dateEnd: info.end,
			})
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
				default:
					break;
			}

			events.push({
				title:
					appointment.namePatient +
					" " +
					appointment.nameSurname1 +
					(appointment.nameSurname2 ? " " + appointment.nameSurname2 : ""),
				start: dateStart,
				end: dateEnd,
				extendedProps: { idAppointment: appointment.idAppointment },
				className: appointmentStatus,
			});
		});

		return events;
	};

	private dateClick = (info: any) => {
		this.props.onClose(info);
	};

	private eventClick = (info: any) => {
		if (info.event.extendedProps.idAppointment) {
			this.setState({
				idAppointmentSelected: info.event.extendedProps.idAppointment,
			});
		} else {
			this.setState({
				idScheduleSlotSelected: info.event.extendedProps.idScheduleSlot,
				dateSelected: info.event.start,
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

		setTimeout(() => {
			this.forceUpdate();
		}, 500);
	};
}

export default withTranslation("newAppointmentForm")(DoctorsCalendarContainer);

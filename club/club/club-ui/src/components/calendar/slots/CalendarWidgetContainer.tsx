import { addDays, getISODay, isBefore } from "date-fns";
import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { SlotStepInfo } from "types/entities/StepsInfo";
import { SelectAvailabilitiesOperation } from "types/operations/Slot";
import { Rest } from "utils/utils";
import CalendarWidget from "./CalendarWidget";

export interface IProps {
	idLocation?: number;
	idProvider?: number;
	idEquivalentAppointment?: number;
	currentSlot?: SlotStepInfo;
	selectSlot: (slot?: SlotStepInfo) => void;
}

export interface IState {
	loading?: boolean;
	loadingSlots?: boolean;
	dayCalendar: Date;
	slots?: SlotStepInfo[];
	slotSelected?: SlotStepInfo;
}

class CalendarWidgetContainer extends React.Component<WithTranslation & IProps, IState> {
	public state: IState = {
		dayCalendar: new Date(),
	};

	public componentDidMount() {
		this.setState({ slotSelected: this.props.currentSlot }, () =>
			this.loadSlots(this.state.dayCalendar)
		);
	}

	public render() {
		return (
			<CalendarWidget
				{...this.state}
				nextWeek={this.nextWeek}
				prevWeek={this.prevWeek}
				isCurrentWeek={this.isCurrentWeek}
				selectSlot={this.selectSlot}
			/>
		);
	}

	private loadSlots = (day: Date) => {
		Rest<SelectAvailabilitiesOperation, SlotStepInfo[]>()
			.operation(
				{
					type: "SelectAvailabilities",
					days: 7,
					dateStart: day,
					dateUser: new Date(),
					idProvider: this.props.idProvider,
					idLocation: this.props.idLocation,
					idEquivalentAppointment: this.props.idEquivalentAppointment,
				},
				true
			)
			.then((response) => {
				let startDay = getISODay(day);
				let tmSlots = response.map((e) => {
					let slot = e;
					let slotDay = slot.valueDayOfTheWeek - startDay + 1;
					if (slotDay <= 0) {
						slotDay = slotDay + 7;
					}
					slot.valueDayOfTheWeek = slotDay;
					return slot;
				});
				this.setState({ slots: tmSlots, loadingSlots: false, loading: false });
			})
			.catch(() => {
				this.setState({ loadingSlots: false, loading: false });
			});
	};

	private isCurrentWeek = () => {
		return isBefore(this.state.dayCalendar, new Date());
	};

	private nextWeek = () => {
		const newDay = addDays(this.state.dayCalendar, 7);
		this.setState({ dayCalendar: newDay }, () => {
			this.loadSlots(this.state.dayCalendar);
		});
	};

	private prevWeek = () => {
		if (this.isCurrentWeek()) {
			return;
		}

		const newDay = addDays(this.state.dayCalendar, -7);
		this.setState({ dayCalendar: newDay }, () => {
			this.loadSlots(this.state.dayCalendar);
		});
	};

	private selectSlot = (slot: SlotStepInfo) => {
		if (
			slot.dateAvailability === this.state.slotSelected?.dateAvailability &&
			slot.valueTimeMinutes === this.state.slotSelected?.valueTimeMinutes
		) {
			this.setState({ slotSelected: undefined }, () => this.props.selectSlot(undefined));
		} else {
			this.setState({ slotSelected: slot }, () => this.props.selectSlot(slot));
		}
	};
}

export default withTranslation("agendasStep")(CalendarWidgetContainer);

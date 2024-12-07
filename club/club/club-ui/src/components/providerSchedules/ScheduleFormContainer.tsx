import React from "react";

import { notification } from "antd";
import _ from "lodash";
import { WithTranslation, withTranslation } from "react-i18next";
import Schedule from "types/entities/Schedule";
import ScheduleDaySlots from "types/entities/ScheduleDaySlots";
import enumPrestadorScheduleSlotConfigurationType from "types/enums/EnumPrestadorScheduleSlotConfigurationType";
import { Rest } from "utils/utils";
import View from "./ScheduleForm";

interface IProps {
	visible?: boolean;
	idProvider: number;
	nameProvider: string;
	idSchedule?: number;
	nameSchedule?: string;
	cloneSchedule?: boolean;
	onClose: (save: boolean) => void;
}

export interface IState {
	idSchedule?: number;
	loaded?: boolean;
	nameSchedule?: string;
	dateFrom?: Date;
	schedule?: Schedule;
	slotsDays: ScheduleDaySlots[];
	locations?: { idLocation: number; nameLocation: string }[];
	portfolios?: { idPortfolio: number; namePortfolio: string }[];
	step: number;
	subStep: number;
	errors: string[];
	nameScheduleError: boolean;
	dateFromError: boolean;
	dateAlreadyUsedError: boolean;
	daySelectionError: boolean;
}

class ScheduleFormContainer extends React.Component<WithTranslation & IProps, IState> {
	public state: IState = {
		slotsDays: [],
		errors: [],
		step: 0,
		subStep: 0,
		nameScheduleError: false,
		dateFromError: false,
		dateAlreadyUsedError: false,
		daySelectionError: false,
	};

	public componentDidMount() {
		if (this.props.visible) {
			this.loadData();
		}
	}

	public render() {
		return this.state.loaded ? (
			<View
				{...this.state}
				visible={this.props.visible}
				nameProvider={this.props.nameProvider}
				nameSchedule={this.state.nameSchedule}
				dateFrom={this.state.dateFrom}
				goBack={this.goBack}
				goNext={this.goNext}
				onChangeNameSchedule={this.onChangeNameSchedule}
				onChangeDateFrom={this.onChangeDateFrom}
				onChangeCheckbox={this.onChangeCheckbox}
				onChangeConfiguration={this.onChangeConfiguration}
				selectCopyConfiguration={this.selectCopyConfiguration}
				addSlot={this.addSlot}
				deleteSlot={this.deleteSlot}
				onChangeSelects={this.onChangeSelects}
				onChangeTimes={this.onChangeTimes}
				onChangeInterval={this.onChangeInterval}
				onChangeFlags={this.onChangeFlags}
				onChangeParticipants={this.onChangeParticipants}
				onCancel={() => this.props.onClose(false)}
			/>
		) : (
			<></>
		);
	}

	private loadData = () => {
		Rest<{ type: string; idSchedule?: number }, any>()
			.operation({
				type: "GetScheduleSlotsData",
				idSchedule: this.props.idSchedule,
			})
			.then((response) => {
				if (response.slotsDays) {
					let slotsDays = response.slotsDays.map((sd: ScheduleDaySlots, i: number) => {
						if (sd.slots?.length === 0) {
							sd.configurationType = enumPrestadorScheduleSlotConfigurationType.COPY;
							sd.slots = undefined;
						} else {
							sd.configurationType = enumPrestadorScheduleSlotConfigurationType.CUSTOM;

							sd.slots?.map((sl) => {
								if (sl.idLocation) {
									const loc = response.locations.find((l: any) => l.idLocation === sl.idLocation);
									sl.location = {
										key: loc.idLocation,
										label: loc.nameLocation,
										value: loc.idLocation,
									};
								}

								if (sl.idPortfolio) {
									const port = response.portfolios.find(
										(p: any) => p.idPortfolio === sl.idPortfolio
									);
									sl.portfolio = {
										key: port.idPortfolio,
										label: port.namePortfolio,
										value: port.idPortfolio,
									};
								}

								sl.timeFrom = this.getTime(sl.valueTimeFrom!);
								sl.timeTo = this.getTime(sl.valueTimeTo!);
								return sl;
							});
						}

						if (this.props.cloneSchedule) {
							sd.idScheduleDay = undefined;
						}

						return sd;
					});
					slotsDays = _(slotsDays).orderBy("day").value() as ScheduleDaySlots[];

					this.setState({
						locations: response.locations,
						portfolios: response.portfolios,
						slotsDays,
						loaded: true,
						nameSchedule: response.nameSchedule,
						dateFrom: response.dateFrom,
						idSchedule: this.props.idSchedule,
					});
				} else {
					this.setState({
						locations: response.locations,
						portfolios: response.portfolios,
						loaded: true,
					});
				}
			});
	};

	private onChangeNameSchedule = (name?: string) => {
		let errors = [...this.state.errors];

		this.setState({ nameSchedule: name, errors, nameScheduleError: false });
	};

	private onChangeDateFrom = (date?: Date | undefined, dateString?: string) => {
		let errors = [...this.state.errors];

		this.setState({
			dateFrom: date,
			errors,
			dateFromError: false,
			dateAlreadyUsedError: false,
		});
	};

	private onChangeCheckbox = (value: number, checked: boolean) => {
		let slotsDays = [...this.state.slotsDays];
		let errors = [...this.state.errors];

		if (checked) {
			slotsDays.push({ day: value });
		} else {
			slotsDays = slotsDays.filter((sd) => sd.day !== value);
		}

		slotsDays = _(slotsDays).orderBy("day").value() as ScheduleDaySlots[];
		this.setState({ slotsDays, errors, daySelectionError: false });
	};

	private onChangeConfiguration = (value: number) => {
		const slotsDays = [...this.state.slotsDays];

		slotsDays[this.state.subStep - 1].configurationType = value;
		if (value === enumPrestadorScheduleSlotConfigurationType.CUSTOM) {
			slotsDays[this.state.subStep - 1].slots = [
				{
					flagAllowGroupSession: false,
					flagAllowOnlineCon: false,
					flagAllowPriorPayment: false,
				},
			];
			slotsDays[this.state.subStep - 1].copyConfigurationDay = undefined;
		} else {
			slotsDays[this.state.subStep - 1].slots = undefined;
		}

		this.setState({ slotsDays, errors: [] });
	};

	private selectCopyConfiguration = (value: number) => {
		const slotsDays = [...this.state.slotsDays];
		let errors = [...this.state.errors];

		slotsDays[this.state.subStep - 1].copyConfigurationDay = value;
		errors = errors.filter((e) => e !== "copyConfigurationDay");

		this.setState({ slotsDays, errors });
	};

	private addSlot = () => {
		const slotsDays = [...this.state.slotsDays];
		slotsDays[this.state.subStep - 1].slots?.push({
			flagAllowGroupSession: false,
			flagAllowOnlineCon: false,
			flagAllowPriorPayment: false,
		});
		this.setState({ slotsDays });
	};

	private deleteSlot = (index: number) => {
		const slotsDays = [...this.state.slotsDays];

		slotsDays[this.state.subStep - 1].slots?.splice(index - 1, 1);
		this.setState({ slotsDays, errors: [] });
	};

	private onChangeSelects = (index: number, location?: any, portfolio?: any) => {
		const slotsDays = [...this.state.slotsDays];
		let errors = [...this.state.errors];

		slotsDays[this.state.subStep - 1].slots?.forEach((sl, i) => {
			if (i === index - 1) {
				if (location !== undefined) {
					sl.idLocation = location.value;
					sl.location = location;
				}
				if (portfolio !== undefined) {
					sl.idPortfolio = portfolio.value;
					sl.portfolio = portfolio;
				}
			}
		});
		if (location !== undefined) errors = errors.filter((e) => e !== "location" + index);
		if (portfolio !== undefined) errors = errors.filter((e) => e !== "portfolio" + index);

		this.setState({ slotsDays, errors });
	};

	private onChangeTimes = (index: number, date: string, timeFrom: boolean) => {
		const slotsDays = [...this.state.slotsDays];
		let errors = [...this.state.errors];

		slotsDays[this.state.subStep - 1].slots?.forEach((sl, i) => {
			if (i === index - 1) {
				const minDate = this.getMinutes(date);
				if (timeFrom) {
					sl.timeFrom = date;
					sl.valueTimeFrom = Number(minDate);
				} else {
					sl.timeTo = date;
					sl.valueTimeTo = Number(minDate);
				}
			}
		});

		errors = errors.filter((e) => e !== (timeFrom ? "timeFrom" : "timeTo") + index);
		errors = errors.filter((e) => e !== "valTimeFrom" + index && e !== "valTimeTo" + index);

		this.setState({ slotsDays });
	};

	private onChangeInterval = (index: number, value: number) => {
		const slotsDays = [...this.state.slotsDays];
		let errors = [...this.state.errors];

		slotsDays[this.state.subStep - 1].slots?.forEach((sl, i) => {
			if (i === index - 1) {
				sl.interval = value;
			}
		});

		errors = errors.filter((e) => e !== "interval" + index);

		this.setState({ slotsDays });
	};

	private onChangeParticipants = (index: number, value: number) => {
		const slotsDays = [...this.state.slotsDays];
		let errors = [...this.state.errors];

		slotsDays[this.state.subStep - 1].slots?.forEach((sl, i) => {
			if (i === index - 1) {
				sl.nbrParticipants = value;
			}
		});

		errors = errors.filter((e) => e !== "participants" + index);

		this.setState({ slotsDays });
	};

	private onChangeFlags = (
		index: number,
		flagGroup?: boolean,
		flagCon?: boolean,
		flagPay?: boolean
	) => {
		const slotsDays = [...this.state.slotsDays];

		slotsDays[this.state.subStep - 1].slots?.forEach((sl, i) => {
			if (i === index - 1) {
				if (flagGroup !== undefined) {
					sl.flagAllowGroupSession = flagGroup;
					if (!flagGroup) {
						sl.nbrParticipants = 1;
					} else {
						sl.nbrParticipants = undefined;
					}
				}
				if (flagCon !== undefined) sl.flagAllowOnlineCon = flagCon;
				if (flagPay !== undefined) sl.flagAllowPriorPayment = flagPay;
			}
		});
		this.setState({ slotsDays });
	};

	private goBack = () => {
		if (this.state.subStep > 1) {
			this.setState({ subStep: this.state.subStep - 1 });
			return;
		}

		this.setState({ step: this.state.step - 1 });
	};

	private goNext = async () => {
		if (this.state.step === 1) {
			this.validateSlotConfiguration();
			return;
		}

		this.validateDaySelection();
	};

	private validateDaySelection = () => {
		if (this.state.nameSchedule === undefined) {
			this.setState({ nameScheduleError: true });
		} else if (this.state.dateFrom === undefined) {
			this.setState({ dateFromError: true });
		} else if (this.state.slotsDays.length === 0) {
			this.setState({ daySelectionError: true });
		} else {
			this.setState({ step: this.state.step + 1, subStep: 1 }, () => {
				if (!this.state.slotsDays[this.state.subStep - 1].slots) {
					const slotsDays = [...this.state.slotsDays];
					slotsDays[this.state.subStep - 1].configurationType =
						enumPrestadorScheduleSlotConfigurationType.CUSTOM;
					slotsDays[this.state.subStep - 1].slots = [
						{
							flagAllowGroupSession: false,
							flagAllowOnlineCon: false,
							flagAllowPriorPayment: false,
						},
					];
					this.setState({ slotsDays });
				}
			});
		}
	};

	private validateSlotConfiguration = () => {
		const slotDay = this.state.slotsDays[this.state.subStep - 1];
		const errors = [];

		if (!slotDay.configurationType) {
			errors.push("configurationType");
		} else {
			slotDay.configurationType === enumPrestadorScheduleSlotConfigurationType.COPY &&
				!slotDay.copyConfigurationDay &&
				errors.push("copyConfigurationDay");

			if (slotDay.configurationType === enumPrestadorScheduleSlotConfigurationType.CUSTOM) {
				slotDay.slots?.forEach((sl, i) => {
					!sl.timeFrom && errors.push("timeFrom" + (i + 1));
					!sl.timeTo && errors.push("timeTo" + (i + 1));
					!sl.interval && errors.push("interval" + (i + 1));
					sl.flagAllowGroupSession &&
						(typeof sl.nbrParticipants === "undefined" ||
							sl.nbrParticipants.toString().trim() === "" ||
							sl.nbrParticipants < 2) &&
						errors.push("participants" + (i + 1));
				});
			}
		}

		if (errors.length === 0) {
			slotDay.slots?.forEach((sl, i) => {
				if (sl.valueTimeFrom !== undefined && sl.valueTimeTo !== undefined) {
					if (sl.valueTimeFrom >= sl.valueTimeTo) {
						errors.push("valTimeFrom" + (i + 1));
						errors.push("valTimeTo" + (i + 1));
					}
				}
			});

			if (errors.length > 0) {
				notification["error"]({
					message: this.props.t("timeFieldsErrors"),
				});
			}
		}

		this.setState({ errors }, () => {
			if (errors.length === 0) {
				if (this.state.subStep === this.state.slotsDays.length) {
					this.save();
					return;
				}
				this.setState({ subStep: this.state.subStep + 1 });
			}
		});
	};

	private getMinutes = (time: string) => {
		if (time !== undefined) {
			// Dividir en partes
			const parts = time.split(":");

			// Calcular minutos (horas * 60 + minutos)
			return parseInt(parts[0]) * 60 + parseInt(parts[1]) + "";
		}

		return "";
	};

	private getTime = (mins: number) => {
		const hours = Math.floor(mins / 60);
		const minutes = mins % 60;

		return (hours < 10 ? "0" : "") + hours + ":" + (minutes < 10 ? "0" : "") + minutes;
	};

	private save = () => {
		Rest<
			{
				type: string;
				idProvider: number;
				idSchedule?: number;
				name: string;
				dateFrom: Date;
				days: ScheduleDaySlots[];
			},
			any
		>()
			.operation({
				type: "SaveSchedule",
				idProvider: this.props.idProvider,
				idSchedule: this.props.cloneSchedule ? undefined : this.state.idSchedule,
				name: this.state.nameSchedule!,
				dateFrom: this.state.dateFrom!,
				days: this.state.slotsDays,
			})
			.then((response) => {
				if (response) {
					const days = response.map((d: any) => this.props.t("weekDays:" + d));
					notification["error"]({
						message: this.props.t("slotsOverlapError") + days.join(", "),
					});
				} else {
					this.props.onClose(true);
				}
			});
	};
}

export default withTranslation("scheduleForm")(ScheduleFormContainer);

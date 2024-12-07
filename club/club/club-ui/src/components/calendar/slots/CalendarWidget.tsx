import { faChevronLeft, faChevronRight, faGripLines } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Empty } from "antd";
import cx from "classnames";
import { addDays, format, getISODay } from "date-fns";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { SlotStepInfo } from "types/entities/StepsInfo";
import "./CalendarWidget.scss";
import { IState as IStateContainer } from "./CalendarWidgetContainer";

interface IProps {
	nextWeek: () => void;
	prevWeek: () => void;
	isCurrentWeek: () => boolean;
	selectSlot: (slot: SlotStepInfo) => void;
}

const CalendarWidget = (props: IProps & IStateContainer) => {
	const { t } = useTranslation("timetableStep");

	const [shownList, setShownList] = useState<string | number | undefined>("100%");

	const dayOfWeek = [
		t("monday"),
		t("tuesday"),
		t("wednesday"),
		t("thursday"),
		t("friday"),
		t("saturday"),
		t("sunday"),
	];
	const [currentDaysOfWeek, setCurrentDaysOfWeek] = useState([...dayOfWeek]);
	const [currentDayOfCalendar, setCurrentDayOfCalendar] = useState(props.dayCalendar);
	const weekDayStart = getISODay(props.dayCalendar) - 1;

	useEffect(() => {
		let tmCurrentDaysOfWeek;
		tmCurrentDaysOfWeek = [
			...dayOfWeek.filter((e, index) => index >= weekDayStart),
			...dayOfWeek.filter((e, index) => index < weekDayStart),
		];

		setCurrentDaysOfWeek([...tmCurrentDaysOfWeek]);
		setCurrentDayOfCalendar(props.dayCalendar);
	}, [props.dayCalendar]);

	const selectSlot = (theSlot: SlotStepInfo) => {
		if (!theSlot.flagTaken) {
			props.selectSlot(theSlot);
		}
	};

	const PintaHuecos = (propsX: { currentDia: number }) => {
		let dia = propsX.currentDia;

		if (!props.slots || props.slots.length === 0) {
			return (
				<div className="dia">
					<div className="hueco__inner" key={propsX.currentDia}>
						{dailyHeader(propsX.currentDia)}
					</div>
				</div>
			);
		}

		let showDay = true;

		const distinctSlots = props.slots
			.map((s) => s.valueTimeMinutes)
			.filter((v, i, a) => a.indexOf(v) === i);

		const slots = distinctSlots
			.sort((a, b) => a - b)
			.map((slot, i) => {
				let hdr;
				const theSlots = props.slots!.filter(
					(s) => s.valueDayOfTheWeek === dia + 1 && s.valueTimeMinutes === slot
				);
				const theSlot = theSlots.length > 0 ? theSlots[0] : undefined;
				if (showDay) {
					hdr = <div className="hueco__inner">{dailyHeader(propsX.currentDia)}</div>;
					showDay = false;
				} else {
					hdr = null;
				}

				if (theSlot) {
					return (
						<div key={i}>
							{hdr}
							<div
								className={cx("hueco", {
									ocupado: theSlot.flagTaken,
									selected:
										props.slotSelected?.dateAvailability.getTime() ===
											theSlot.dateAvailability.getTime() &&
										props.slotSelected.valueTimeMinutes === theSlot.valueTimeMinutes,
								})}
								onClick={() => selectSlot(theSlot)}>
								<div className="hueco__inner" key={theSlot.valueTime}>
									{theSlot.valueTime}
								</div>
							</div>
						</div>
					);
				} else {
					return (
						<div key={i}>
							{hdr}
							<div className="hueco-placeholder">-</div>
						</div>
					);
				}
			});

		return (
			<div className="dia" key={dia}>
				{slots}
			</div>
		);
	};

	const msInDay = 1000 * 3600 * 24;
	const dailyHeader = (daysToAdd: number) => {
		const today = new Date().setHours(0, 0, 0, 0);
		const dayCalendar = currentDayOfCalendar.setHours(0, 0, 0, 0) + msInDay * daysToAdd;
		const daysBetween = (dayCalendar - today) / msInDay;
		let dayToShow;
		if (daysBetween === 0) {
			dayToShow = t("today");
		} else if (daysBetween === 1) {
			dayToShow = t("tomorrow");
		} else {
			dayToShow = currentDaysOfWeek[daysToAdd];
		}

		return (
			<div>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}>
					<div style={{ display: "flex", fontSize: "0.75rem" }}>
						{format(addDays(currentDayOfCalendar, daysToAdd), "dd/MM")}
					</div>
					<div style={{ fontSize: "0.75rem", fontWeight: "bold", marginTop: "0.5rem" }}>
						{dayToShow}
					</div>
				</div>
			</div>
		);
	};

	return (
		<div className="delonia-calendar-container">
			<div className="delonia-calendar-inner">
				<div className="calendar-form-container">
					<div className="comercial-container">
						<div
							className="comercial"
							style={{
								maxHeight: shownList,
								overflowY: "hidden",
								overflowX: "auto",
							}}>
							{props.loading && (
								<div className="comercial-container-skeleton">
									<FontAwesomeIcon icon={faGripLines} />
									<FontAwesomeIcon icon={faGripLines} />
									<FontAwesomeIcon icon={faGripLines} />
								</div>
							)}
							<div className="agenda">
								{!props.loading && props.loadingSlots && props.slots && (
									<div className="slots-mask">{t("loading")}</div>
								)}
								{!props.loading && (
									<div className="agenda__huecos" style={{ alignItems: "normal" }}>
										<div className="dia">
											<FontAwesomeIcon
												style={{
													cursor: !props.isCurrentWeek() ? "pointer" : "default",
													color: !props.isCurrentWeek() ? "black" : "gray",
													fontWeight: "bold",
												}}
												icon={faChevronLeft}
												onClick={() => props.prevWeek()}
											/>
										</div>
										{currentDaysOfWeek.map((e, index) => (
											<PintaHuecos key={index} currentDia={index} />
										))}
										<div className="dia">
											<FontAwesomeIcon
												icon={faChevronRight}
												onClick={() => props.nextWeek()}
												style={{ cursor: "pointer" }}
											/>
										</div>
									</div>
								)}
							</div>
							{(!props.slots || props.slots.length === 0) && (
								<Empty
									description={t("noData")}
									style={{
										display: "flex",
										flexDirection: "column",
										marginTop: "2rem",
									}}
								/>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CalendarWidget;

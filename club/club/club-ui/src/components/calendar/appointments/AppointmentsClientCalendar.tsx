import { useEffect, useState } from "react";

import cx from "classnames";
import dayjs, { Dayjs } from "dayjs";
import weekday from "dayjs/plugin/weekday";

import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	GetLogedUserAppointmentsOperation,
	GetLogedUserAppointmentsResponse,
} from "types/operations/Appointment";
import { Rest } from "utils/utils";
import "./AppointmentsClientCalendar.scss";

interface Props {
	onSelectedDateChange?: (day?: Dayjs) => void;
	onRangeChange?: (dateFrom: Dayjs, dateTo: Dayjs) => void;
	selectedDate?: Dayjs;
	providerId?: number;
}

dayjs.extend(weekday);

const Calendar = (props: Props) => {
	const [appointments, setAppointments] = useState<GetLogedUserAppointmentsResponse[]>();

	useEffect(() => {
		const firstDay = dayjs(showingDay).startOf("month").startOf("week").startOf("day");
		const lastDay = dayjs(showingDay).endOf("month").endOf("week").startOf("day").add(1, "days");

		Rest<GetLogedUserAppointmentsOperation, GetLogedUserAppointmentsResponse[]>()
			.operation({
				type: "GetLogedUserAppointments",
				dateStart: firstDay.toDate(),
				dateEnd: lastDay.toDate(),
			})
			.then((response) => {
				setAppointments(response);
			});

		props.onRangeChange && props.onRangeChange(firstDay, lastDay);
	}, []);

	useEffect(() => {
		if (props.selectedDate && !props.selectedDate.isSame(selectedDay)) {
			setSelectedDay(props.selectedDate);
		}
	}, [props.selectedDate]);

	const [selectedDay, setSelectedDay] = useState<Dayjs | undefined>(props.selectedDate);
	const [showingDay, setShowingDay] = useState<Dayjs>(
		dayjs(dayjs().startOf("day")).startOf("month")
	);

	const changeMonth = (direction: 0 | 1) => {
		const showIngDayFrom = dayjs(showingDay).add(1 * (direction === 0 ? -1 : 1), "month");
		setShowingDay(showIngDayFrom);

		const firstDay = dayjs(showIngDayFrom).startOf("month").startOf("week").startOf("day");
		const lastDay = dayjs(showIngDayFrom)
			.endOf("month")
			.endOf("week")
			.startOf("day")
			.add(1, "days");

		Rest<GetLogedUserAppointmentsOperation, GetLogedUserAppointmentsResponse[]>()
			.operation({
				type: "GetLogedUserAppointments",
				dateStart: firstDay.toDate(),
				dateEnd: lastDay.toDate(),
			})
			.then((response) => {
				setAppointments(response);
			});

		props.onRangeChange && props.onRangeChange(firstDay, lastDay);
	};

	const getNumberAppointments = (current: Dayjs): boolean => {
		let nbrAppointments = false;

		if (appointments) {
			const currentDate = current.toDate();
			for (let i = 0; i < appointments.length; i++) {
				const aDate = appointments[i].appointmentInfo.dateAppointment;
				if (
					aDate.getFullYear() === currentDate.getFullYear() &&
					aDate.getMonth() === currentDate.getMonth() &&
					aDate.getDate() === currentDate.getDate()
				) {
					nbrAppointments = true;
					break;
				}
			}
		}

		return nbrAppointments;
	};

	const days = () => {
		const firstDay = dayjs(showingDay).startOf("month").startOf("week").startOf("day");
		const lastDay = dayjs(showingDay).endOf("month").endOf("week").startOf("day").add(1, "days");

		const days = [];
		let current = dayjs(firstDay);
		let index = 0;
		const today = dayjs().startOf("day");

		while (!current.isSame(lastDay)) {
			const nbrAppointments = getNumberAppointments(current);

			const setSelectedDayThis = (day: Dayjs) => {
				const newSelectedDay = selectedDay && day.isSame(selectedDay) ? undefined : day;
				setSelectedDay(newSelectedDay);
				props.onSelectedDateChange && props.onSelectedDateChange(newSelectedDay);
			};

			days.push(
				<Day
					key={index}
					day={dayjs(current)}
					setSelectedDay={setSelectedDayThis}
					prevMonth={current.month() !== showingDay.month()}
					selected={current.isSame(selectedDay)}
					today={current.isSame(today)}
					nbrAppointments={nbrAppointments}
				/>
			);

			current.add(1, "days");
			index++;
		}

		return days;
	};

	return (
		<div className="calendar">
			<div className="calendar__header">
				<div className="title">
					<span className="month">{showingDay.format("MMMM")}</span>
					<span className="year">{showingDay.format("yyyy")}</span>
				</div>
				<div className="buttons">
					<button onClick={() => changeMonth(0)}>
						<FontAwesomeIcon icon={faChevronLeft} />
					</button>
					<button onClick={() => changeMonth(1)}>
						<FontAwesomeIcon icon={faChevronRight} />
					</button>
				</div>
			</div>
			<div className="separator" />

			<div className="initials">
				{Array.from({ length: 7 }, (_, i) => (
					<div key={i} className="initials">
						{dayjs().weekday(i).format("dd").charAt(0)}
					</div>
				))}
			</div>

			<div className="days">{days()}</div>
		</div>
	);
};

interface DayProps {
	day: Dayjs;
	selected?: boolean;
	today: boolean;
	prevMonth: boolean;
	setSelectedDay: (selectedDay: Dayjs) => void;
	nbrAppointments?: boolean;
}

const Day = (props: DayProps) => {
	const appointments = () => {
		if (!props.nbrAppointments) {
			return undefined;
		} else {
			return Array.from(Array(props.nbrAppointments)).map((a, i) => (
				<span key={i} className="dot"></span>
			));
		}
	};

	return (
		<div className="day">
			<div
				onClick={() => props.setSelectedDay(props.day)}
				className={cx("day__inner", {
					"prev-month": props.prevMonth,
					selected: props.selected,
					today: props.today,
				})}>
				<div className="day__value">{props.day.date()}</div>

				<div className="day__appointments">{appointments()}</div>
			</div>
		</div>
	);
};

export default Calendar;

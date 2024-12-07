import i18n from "i18n/i18n";
import { useTranslation } from "react-i18next";
import { AppointmentDate } from "types/entities/Appointment";
import "./DateTitle.scss";

interface IProps {
	date: AppointmentDate;
	color?: string;
}

function DateTitle(props: IProps) {
	const { t } = useTranslation("dateTitle");

	return (
		<div className={"date__title__container" + (props.color ? " " + props.color : "")}>
			<i className="fa-regular fa-calendar-days" />
			{props.date ? (
				<div className="date__title__container__info">
					{props.date.dateAppointment
						.toLocaleString(i18n.language, { weekday: "long" })
						.charAt(0)
						.toUpperCase() +
						props.date.dateAppointment.toLocaleString(i18n.language, { weekday: "long" }).slice(1) +
						" " +
						(props.date.dateAppointment.getDate() <= 9
							? "0" + props.date.dateAppointment.getDate()
							: props.date.dateAppointment.getDate()) +
						" " +
						t("atMonth") +
						" " +
						props.date.dateAppointment.toLocaleString(i18n.language, { month: "long" }) +
						" " +
						t("atHour") +
						" " +
						props.date.valueTimeAppointment}
				</div>
			) : (
				<></>
			)}
		</div>
	);
}

export default DateTitle;

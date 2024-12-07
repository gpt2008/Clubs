import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
	faCalendar,
	faCancel,
	faCheck,
	faChevronDown,
	faMoneyBill,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Dropdown } from "antd";
import cx from "classnames";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { PersonaMascotaInfo } from "types/entities/Appointment";
import "./AppointmentHistory.scss";

interface IProps {
	appointment: PersonaMascotaInfo;
}

const AppointmentHistory = (props: IProps) => {
	const { t } = useTranslation("appointmentHistory");

	const loadStatusIcon = (typeStatus: number) => {
		switch (typeStatus) {
			case 1:
				return faCheck;
			case 3:
				return faCalendar;
			case 4:
				return faCheck;
			case 5:
				return faMoneyBill;
			default:
				return faCancel;
		}
	};

	return (
		<>
			<div className="appointment_status_container">
				<Dropdown
					overlay={
						<StatusHistory
							statusHistory={props.appointment.appointmentHistory}
							loadStatusIcon={loadStatusIcon}
						/>
					}
					trigger={["click"]}>
					<Button
						className={cx("appointment_status_button", {
							confirmed: props.appointment.typeStatus === 1,
							cancelled: props.appointment.typeStatus === 2,
							payment: props.appointment.typeStatus === 5,
							proposed: props.appointment.typeStatus === 3,
						})}>
						<div>
							<FontAwesomeIcon icon={loadStatusIcon(props.appointment.typeStatus)} />
							<span>
								<b>{t("appointmentStatus:" + props.appointment.typeStatus)}</b>
								{props.appointment.typeStatusDetail != undefined &&
									t("appointmentStatusDetail:" + props.appointment.typeStatusDetail)}
							</span>
						</div>
						<div className="appointment_history_date">
							{dayjs(props.appointment.appointmentHistory[0].dateCreation).format(
								"DD/MM/YYYY HH:mm"
							)}
							<FontAwesomeIcon icon={faChevronDown} />
						</div>
					</Button>
				</Dropdown>
			</div>
		</>
	);
};

const StatusHistory = (props: {
	statusHistory?: {
		typeStatus: number;
		nameOperator?: string;
		surnameOperator?: string;
		typeStatusDetail?: number;
		dateCreation: Date;
	}[];
	loadStatusIcon: (status: number) => IconProp;
}) => {
	const { t } = useTranslation("appointmentHistory");

	return (
		<div className="status_history_container">
			{props.statusHistory?.map((s) => (
				<div
					key={s.typeStatus}
					className={cx("status_history", {
						confirmed: s.typeStatus === 1,
						cancelled: s.typeStatus === 2,
						payment: s.typeStatus === 5,
						proposed: s.typeStatus === 3,
					})}>
					<div>
						<FontAwesomeIcon icon={props.loadStatusIcon(s.typeStatus!)} />
						<span>
							<b>{t("state") + t("appointmentStatus:" + s.typeStatus.toString())}</b>
							{s.typeStatusDetail != undefined &&
								t("appointmentStatusDetail:" + s.typeStatusDetail.toString())}
						</span>
					</div>
					<div className="appointment_history_date">
						{dayjs(s.dateCreation).format("DD/MM/YYYY HH:mm")}
					</div>
				</div>
			))}
		</div>
	);
};

export default AppointmentHistory;

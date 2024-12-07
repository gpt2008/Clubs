import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import i18n from "i18n/i18n";
import { AlignType } from "rc-table/lib/interface";
import { EnumAppointmentTypeStatus } from "types/enums/AppointmentTypeStatus";
import ActionTable from "./ActionTable";
import "./AppointmentsTableColumns.scss";

const tableColumns = (
	currentPage: number,
	loadAppointmentsData: (
		offset?: number | undefined,
		typeStatus?: number | undefined,
		idProvider?: number | undefined
	) => void
) => {
	return [
		{
			title: i18n.t("appointments:dateAndHourAndService"),
			dataIndex: "dateAndHourAndService",
			key: "0",
			width: "20%",
			render: (
				_text: string,
				record: { dateAppointment: Date; valueTime: number; nameService: string }
			) => (
				<>
					<div>
						<strong>{i18n.t("appointments:day")}</strong>
						{`${dayjs(record.dateAppointment)
							.add(record.valueTime, "minute")
							.format("DD/MM/YYYY")}`}
					</div>
					<div>
						<strong>{i18n.t("appointments:hour")}</strong>
						{`${dayjs(record.dateAppointment).add(record.valueTime, "minute").format("HH:mm")}`}
					</div>
					<div>
						<strong>{i18n.t("appointments:service")}</strong>
						{`${record.nameService}`}
					</div>
				</>
			),
			align: "left" as AlignType,
		},
		{
			title: i18n.t("appointments:clientAndContact"),
			dataIndex: "client",
			key: "0",
			width: "25%",
			render: (
				_text: string,
				record: {
					namePerson: string;
					nameSurname1: string;
					nameSurname2: string;
					valuePhone: string;
					valueEmail: string;
				}
			) => (
				<>
					<div>
						<strong>{i18n.t("appointments:nameAndSurname")}</strong>
						{`${record.namePerson} ${record.nameSurname1 || ""} ${record.nameSurname2 || ""}`}
					</div>
					{record.valuePhone && (
						<>
							<span>
								<strong>Teléfono: </strong>
								{`${record.valuePhone}`}
							</span>
							<br></br>
						</>
					)}
					{record.valueEmail && (
						<span>
							<strong>Email: </strong>
							{`${record.valueEmail || ""}`}
						</span>
					)}
				</>
			),
			align: "left" as AlignType,
		},
		{
			title: "Localización",
			dataIndex: "location",
			key: "0",
			width: "30%",
			render: (
				_text: string,
				record: {
					nameOrganization: string;
					nameLocation: string;
					nameProvider: string;
					firstSurnameProvider: string;
					secondSurnameProvider: string;
				}
			) => (
				<>
					{record.nameOrganization && (
						<div>
							<strong>{i18n.t("appointments:organization")}</strong> {record.nameOrganization}
						</div>
					)}
					{record.nameLocation && (
						<div>
							<strong>{i18n.t("appointments:location")}</strong> {record.nameLocation}
						</div>
					)}
					<div>
						<strong>{i18n.t("appointments:provider")}</strong> {record.nameProvider}{" "}
						{record.firstSurnameProvider ? record.firstSurnameProvider : ""}{" "}
						{record.secondSurnameProvider ? record.secondSurnameProvider : ""}
					</div>
				</>
			),
		},
		{
			title: i18n.t("appointments:status"),
			dataIndex: "status",
			key: "0",
			width: "15%",
			render: (
				_text: string,
				record: {
					typeStatus: number;
				}
			) => {
				var appointmentStatus = "other-status";
				switch (record.typeStatus) {
					case EnumAppointmentTypeStatus.CONFIRMED:
						appointmentStatus = "confirmed";
						break;
					case EnumAppointmentTypeStatus.PROPOSED:
						appointmentStatus = "proposed";
						break;
					case EnumAppointmentTypeStatus.CANCELLED:
						appointmentStatus = "cancelled";
						break;
					case 5:
						appointmentStatus = "payment";
						break;
					default:
						break;
				}
				return (
					<>
						<div>
							<FontAwesomeIcon
								icon={faCircle}
								className={appointmentStatus}
								style={{ marginRight: "8px" }}
							/>
							{i18n.t(`newAppointmentPrestadorStatuses:${record.typeStatus}`)}
						</div>
					</>
				);
			},
		},
		{
			title: i18n.t(""),
			dataIndex: "action",
			key: "0",
			width: "5%",
			render: (
				_text: string,
				record: { idAppointment: number; typeStatus: number; idLocation: number }
			) => {
				return (
					<ActionTable
						idAppointment={record.idAppointment}
						typeStatus={record.typeStatus}
						currentPage={currentPage}
						loadAppointmentsData={loadAppointmentsData}
						idLocation={record.idLocation}></ActionTable>
				);
			},
			align: "left" as AlignType,
		},
	];
};

export default tableColumns;

import { faCircle, faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { width } from "@fortawesome/free-solid-svg-icons/faAddressBook";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import i18n from "i18n/i18n";
import { AlignType } from "rc-table/lib/interface";
import { TableIcons } from "utils/utils";
import { Button, Dropdown, Menu, Table } from "antd";
import "./Provider.scss";
import Highlighter from "react-highlight-words";

const tableColumns = (
	currentPage: number,
	openProviderForm: (idProviderSelected?: number, nameProviderSelected?: string) => void,
	openProviderHolidaysForm: (idProviderSelected?: number, nameProviderSelected?: string) => void,
	openProviderSchedules: (idProviderSelected?: number, nameProviderSelected?: string) => void,
	highlightFilter?: string
) => {

	const onClick = (value: string, idProvider: number, name: string) => {
		switch (value) {
			case "1":
				openProviderForm(idProvider, name);
				break;
			case "2":
				openProviderSchedules(idProvider, name);
				break;
			default:
				openProviderHolidaysForm(idProvider, name);
				break;
		}
	};
	const addServicesDropdown = (idProvider: number, name: string) => {
		return (
			<Menu onClick={(e: any) => onClick(e.key, idProvider, name)}>
				<Menu.Item key="1">{i18n.t("providerList:editProfileButton")}</Menu.Item>
				<Menu.Item key="2">{i18n.t("providerList:scheduleButton")}</Menu.Item>
				<Menu.Item key="3">{i18n.t("providerList:holidaysButton")}</Menu.Item>
			</Menu>
		);
	};

    return [
		{
			title: i18n.t("providerList:infoProvider"),
			dataIndex: "proveedor",
			key: "0",
			width: "35%",
			render: (
				_text: string,
				record: {
					namePerson: string;
					nameSurname1: string;
					nameSurname2: string;
					nameService: string;
					NameOrganization: string;
				}
			) => (
				<>
					<div>
						<strong>{i18n.t("appointments:nameAndSurname")}</strong>
						{highlightFilter ? (
							<Highlighter
								highlightStyle={{ backgroundColor: "#f8d19b", padding: 0 }}
								searchWords={[highlightFilter]}
								autoEscape
								textToHighlight={`${record.namePerson} ${record.nameSurname1 || ""} ${record.nameSurname2 || ""}`}></Highlighter>
						) : (
							`${record.namePerson} ${record.nameSurname1 || ""} ${record.nameSurname2 || ""}`
						)}
					</div>
					{record.nameService && (
							<div className="provider-speciality">
								<span>
									<strong>Servicio: </strong>
									{`${record.nameService || ""}`}
								</span>
							</div>
					)}
					{record.NameOrganization && (
						<div className="provider-speciality">
							<strong>Organizacion: </strong>
							{ record.NameOrganization.split(";").length > 3 ? (
								record.NameOrganization.split(";").slice(0,4).map((org) => (
									<span>
										{`${org + "; "}`}
									</span>
								))
							) : ( record.NameOrganization.split(";").length > 2 ? (
									<span>
										{`${record.NameOrganization || " "}`}
									</span>
								): (
									<span>
										{`${record.NameOrganization.split(";")[0] || ""}`}
									</span>
								))
							}
						</div>
					)}
				</>
			),
			align: "left" as AlignType,
		},
		{
			title: i18n.t("providerList:infoAppointments"),
			dataIndex: "infoAppoinments",
			key: "1",
			width: "35%",
			render: (
				_text: string,
				record: { nTodayAppointments: number; nTomorrowAppointments: number; nameHoliday: string; dateStartHoliday: Date; dateEndHoliday: Date;}
			) => (
				<>
					<div className="list-item">
						<b>{i18n.t("providerList:appointmentsToday")}/{i18n.t("providerList:appointmentsTomorrow")}: </b>
						{record.nTodayAppointments}/{record.nTomorrowAppointments}
					</div>
					<div className="list-item">
					<b>{i18n.t("providerList:nextHolidays")}</b>
						{record.nameHoliday ? (
							<span style={{ paddingLeft: "0.2rem" }}>
								{record.nameHoliday +
									", " +
									(dayjs(record.dateStartHoliday).format("DD/MM") ===
									dayjs(record.dateEndHoliday).format("DD/MM")
										? dayjs(record.dateStartHoliday).format("DD/MM")
										: dayjs(record.dateStartHoliday).format("DD/MM") +
										  "-" +
										  dayjs(record.dateEndHoliday).format("DD/MM"))}
							</span>
						) : (
							<span className="info-nodata">{i18n.t("providerList:noNextHolidays")}</span>
						)}
					</div>
					
				</>
			),
			align: "left" as AlignType,
		},
		{
			title: i18n.t("providerList:statusProvider"),
			dataIndex: "activo",
			key: "2",
			render: (
				_text: string,
				record: { numSchedules: number}
			) => (
				<>
					{record.numSchedules > 0 ? (
							TableIcons.getScheduleTypeIcon(i18n.t("scheduleType:ACTIVE", { numSchedules: record.numSchedules }), TableIcons.DotColor.green)
						) : (
							TableIcons.getScheduleTypeIcon(i18n.t("scheduleType:INACTIVE", { numSchedules: record.numSchedules }), TableIcons.DotColor.red)
						)
					}
				</>
			),
			align: "center" as AlignType,
		},
		{
			title: "",
			dataIndex: "",
			key: "3",
			render:(
				_text: string,
				record: {idProvider: number, namePerson: string, nameSurname1: string}
			) => (
				<>
					<div className="three-dots">
						<Dropdown overlay={ addServicesDropdown(record.idProvider, record.namePerson.concat(" ").concat(record.nameSurname1)) } trigger={["hover"]}>
							<Button size="middle" type="primary" shape="circle">
								<FontAwesomeIcon className="icon" icon={faEllipsis} />
							</Button>
						</Dropdown>
					</div>
				</>
			),
			align: "center" as AlignType,
		}

    ];

};

export default tableColumns;
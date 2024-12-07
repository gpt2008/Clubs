import { faCalendar, faGear, faUserTie, faHammer } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import i18n from "i18n/i18n";
import {
	agendas,
	appointments,
	locations,
	services,
	staff,
	specialities,
	subspecialities,
	acts,
	nomenclator,
	carteras,
	pacientes,
	nuevacita
} from "utils/router-utils";

const items = [
	{
		key: "citas-open",
		icon: <FontAwesomeIcon icon={faCalendar} style={{ fontSize: "18px" }} />,
		label: i18n.t("verticalSlider:appointments"),
		children: [
			{
				key: agendas,
				label: i18n.t("verticalSlider:agenda"),
			},
			{
				key: appointments,
				label: i18n.t("verticalSlider:appointmentsList"),
			},
			/*{
				key: questionnaire,
				label: i18n.t("verticalSlider:questionnaire"),
			},
			{
				key: questionnaireAnswers,
				label: i18n.t("verticalSlider:questionnaireAnswers"),
			},*/
			{
				key: nuevacita,
				label: i18n.t("verticalSlider:nuevaCita")
			}
		],
	},
	{
		key: "configuracion-agenda-open",
		icon: <FontAwesomeIcon icon={faGear} style={{ fontSize: "18px" }} />,
		label: i18n.t("verticalSlider:agendaConfiguration"),
		children: [
			{
				key: staff,
				label: i18n.t("verticalSlider:staff"),
			},
			{
				key: locations,
				label: i18n.t("verticalSlider:locations"),
			},
			{
				key: services,
				label: i18n.t("verticalSlider:services"),
			},
		],
	},
	{
		key: "administracion-open",
		icon: <FontAwesomeIcon icon={faUserTie} style={{ fontSize: "18px" }} />,
		label: i18n.t("verticalSlider:clients"),
		children: [
			/*{
				key: facturas,
				label: i18n.t("verticalSlider:invoice"),
			},*/
			{
				key: pacientes,
				label: i18n.t("verticalSlider:patients"),
			},
			
		],
	},
	{
		key: "taller-open",
		icon: <FontAwesomeIcon icon={faHammer} style={{ fontSize: "18px" }} />,
		label: i18n.t("verticalSlider:taller"),
		children: [
			{
				key: specialities,
				label: i18n.t("verticalSlider:specialities"),
			},
			{
				key: subspecialities,
				label: i18n.t("verticalSlider:subspecialities"),
			},
			{
				key: acts,
				label: i18n.t("verticalSlider:acts"),
			},
			{
				key: nomenclator,
				label: i18n.t("verticalSlider:nomenclator"),
			},
			{
				key: carteras,
				label: i18n.t("verticalSlider:carteras"),
			},
			/*{
				key: precios,
				label: i18n.t("verticalSlider:precios"),
			},*/
			
		]
	}
];

export const submenuKeys = ["citas-open", "configuracion-agenda-open", "administracion-open", "taller-open"];

export default items;

import i18n from "i18n/i18n";
import { AlignType } from "rc-table/lib/interface";
//import ActionTable from "./ActionTable";
import dayjs from "dayjs";
import ActionAnswers from "./ActionAnswers";

const questionnaireAnswersTableColumns = (
	currentPage: number,
	loadAnswersData: (offset?: number | undefined) => void
) => {
	return [
		{
			title: i18n.t("questionnaireAnswers:providerInfo"),
			dataIndex: "providerInfo",
			key: "0",
			render: (
				_text: string,
				record: {
					providerName: string;
					providerFirstNameSurname: string;
					providerSecondNameSurname: string;
				}
			) => {
				return (
					<>
						<div>
							<strong>{i18n.t("appointments:nameAndSurname")}</strong>
							{`${record.providerName} ${record.providerFirstNameSurname || ""} ${
								record.providerSecondNameSurname || ""
							}`}
						</div>
					</>
				);
			},
			align: "left" as AlignType,
		},
		{
			title: i18n.t("questionnaireAnswers:client"),
			dataIndex: "client",
			key: "0",
			render: (
				_text: string,
				record: {
					namePerson: string;
					firstNameSurname: string;
					secondNameSurname: string;
				}
			) => {
				return (
					<>
						<div>
							<strong>{i18n.t("appointments:nameAndSurname")}</strong>
							{`${record.namePerson} ${record.firstNameSurname || ""} ${
								record.secondNameSurname || ""
							}`}
						</div>
					</>
				);
			},
			align: "left" as AlignType,
		},
		{
			title: i18n.t("questionnaireAnswers:dates"),
			dataIndex: "dates",
			key: "0",
			render: (
				_text: string,
				record: {
					dateAppointment: Date;
					dateCompletado: Date;
				}
			) => {
				return (
					<>
						<div>
							<strong>{i18n.t("questionnaireAnswers:dateAppointment")}</strong>
							{`${dayjs(record.dateAppointment).format("DD/MM/YYYY")}`}
						</div>
						<div>
							<strong>{i18n.t("questionnaireAnswers:dateCompletado")}</strong>
							{`${dayjs(record.dateCompletado).format("DD/MM/YYYY")}`}
						</div>
					</>
				);
			},
		},
		{
			title: "",
			dataIndex: "action",
			key: "0",
			render: (
				_text: string,
				record: {
					idCuestionario: number;
					idRespuestas: number;
				}
			) => {
				return (
					<>
						<ActionAnswers
							idQuestionnaire={record.idCuestionario}
							idRespuestas={record.idRespuestas}
						/>
					</>
				);
			},
		},
	];
};

export default questionnaireAnswersTableColumns;

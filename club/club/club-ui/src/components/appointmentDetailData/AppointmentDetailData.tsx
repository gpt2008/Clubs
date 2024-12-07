import { Collapse, Empty, message } from "antd";
import CollapsePanel from "antd/es/collapse/CollapsePanel";
import AppointmentFile from "components/appointmentFile/AppointmentFile";
import ClientStep from "components/steps/clientStep/ClientStep";
import PetInfoStep from "components/steps/registerStep/RegisterStep";
import { color_primary } from "css/theme";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PersonaMascotaInfo } from "types/entities/Appointment";
import { Client } from "types/entities/Client";
import {
	SelectFilesByIdAppointmentOperation,
	SelectFilesByIdAppointmentResponse,
} from "types/operations/Appointment";
import { Rest } from "utils/utils";
import "./AppointmentDetailData.scss";
import AppointmentType from "./AppointmentType";

interface IProps {
	PersonaMascotaData: PersonaMascotaInfo;
	column?: boolean;
	/*onBackStep: () => void;
  saveClient: (clientInfo?: Client) => void;*/
}

interface IFormFields {
	namePerson: string;
	nameSurname1: string;
	nameSurname2: string;
	phone: string;
	email: string;
	password: string;
	dataAuthorization: string;
	thirdPartyAuthorization: string;
}

function AppointmentDetailData(props: IProps) {
	const { t } = useTranslation("appointmentStep");
	const [messageApi, contextHolder] = message.useMessage();
	const [persona, setPersona] = useState<Client>();
	const [files, setFiles] = useState<SelectFilesByIdAppointmentResponse[]>();

	const headerStyle = { color: color_primary, fontWeight: "bold" };
	const contentStyle = { padding: "8px" };

	const loadAppointmentFiles = (idAppointment: number) => {
		Rest<SelectFilesByIdAppointmentOperation, SelectFilesByIdAppointmentResponse[]>()
			.operation({
				type: "SelectFilesByIdAppointment",
				idAppointment: idAppointment,
			})
			.then((response) => {
				setFiles(response);
			});
	};

	useEffect(() => {
		loadAppointmentFiles(props.PersonaMascotaData.idAppointment);
	}, []);

	return (
		<>
			<div className="data_component">
				<p className="data_info__titulo">
					{props.PersonaMascotaData.namePerson} {props.PersonaMascotaData.apellido1}{" "}
					{props.PersonaMascotaData.apellido2} {t("for")} {props.PersonaMascotaData.nameMascota}{" "}
					{t("at")} {props.PersonaMascotaData.valueTimeAppointment}
				</p>
				<Collapse className="data_form" bordered={false}>
					<CollapsePanel
						className="data_info"
						key={1}
						header={<span className="data_info">{t("clientLabel")}</span>}>
						<ClientStep
							personaMascotaData={props.PersonaMascotaData}
							column={props.column}></ClientStep>
					</CollapsePanel>
				</Collapse>

				<Collapse className="data_form" bordered={false} defaultActiveKey={["2"]}>
					<CollapsePanel
						className="data_info"
						key={2}
						header={<span className="data_info">{t("petLabel")}</span>}>
						<PetInfoStep
							personaMascotaData={props.PersonaMascotaData}
							column={props.column}></PetInfoStep>
					</CollapsePanel>
				</Collapse>

				<AppointmentType PersonaMascotaData={props.PersonaMascotaData} column={props.column} />

				<Collapse bordered={false}>
					<CollapsePanel
						className="data_info"
						key={4}
						header={<span className="data_info">{t("filesLabel")}</span>}>
						<div className="appointment__files__collapse__content" style={contentStyle}>
							{files && files.length > 0 ? (
								files?.map((file) => {
									return (
										<AppointmentFile
											file={{ id: file.idFile, name: file.nameFile, type: file.typeFile }}
										/>
									);
								})
							) : (
								<Empty
									description={
										<h4 className="primary">
											<strong>{t("noFiles")}</strong>
										</h4>
									}
								/>
							)}
						</div>
					</CollapsePanel>
				</Collapse>
			</div>
		</>
	);
}

export default AppointmentDetailData;

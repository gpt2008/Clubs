import { Collapse } from "antd";
import { useTranslation } from "react-i18next";

import CollapsePanel from "antd/es/collapse/CollapsePanel";
import AppointmentStep from "components/steps/appointmentStep/AppointmentStep";
import { PersonaMascotaInfo } from "types/entities/Appointment";
import "./AppointmentDetailData.scss";

interface IProps {
	PersonaMascotaData: PersonaMascotaInfo;
	column?: boolean;
	/*onBackStep: () => void;
  saveClient: (clientInfo?: Client) => void;*/
}

function AppointmentType(props: IProps) {
	const { t } = useTranslation("appointmentStep");

	return (
		<>
			<Collapse className="data_form" bordered={false} defaultActiveKey={["2"]}>
				<CollapsePanel
					className="data_info"
					key={2}
					header={<span className="data_info">{t("consultLabel")}</span>}>
					<AppointmentStep
						personaMascotaData={props.PersonaMascotaData}
						column={props.column}></AppointmentStep>
				</CollapsePanel>
			</Collapse>
		</>
	);
}

export default AppointmentType;

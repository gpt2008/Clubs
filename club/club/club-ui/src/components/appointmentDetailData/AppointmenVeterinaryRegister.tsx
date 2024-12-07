import { Collapse } from "antd";
import { useTranslation } from "react-i18next";

import CollapsePanel from "antd/es/collapse/CollapsePanel";
import RegisterStep from "components/steps/registerStep/RegisterStep";
import { PersonaMascotaInfo } from "types/entities/Appointment";
import "./AppointmentDetailData.scss";

interface IProps {
	PersonaMascotaData: PersonaMascotaInfo;
	column?: boolean;
}

function AppointmentVeterinaryRegister(props: IProps) {
	const { t } = useTranslation("veterinaryRegister");

	return (
		<>
			<Collapse
				className="data_form"
				bordered={false}
				expandIconPosition="left"
				defaultActiveKey={["2"]}>
				<CollapsePanel
					className="data_info"
					key={2}
					header={<span className="data_info">{t("titleLabel")}</span>}>
					<RegisterStep
						personaMascotaData={props.PersonaMascotaData}
						column={props.column}></RegisterStep>
				</CollapsePanel>
			</Collapse>
		</>
	);
}

export default AppointmentVeterinaryRegister;

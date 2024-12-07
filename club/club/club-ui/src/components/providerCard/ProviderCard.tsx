import { Button } from "antd";
import ProviderInfo from "components/providerInfo/ProviderInfo";
import { useTranslation } from "react-i18next";
import { AppointmentDate } from "types/entities/Appointment";
import { ProviderStepInfo } from "types/entities/StepsInfo";
import "./ProviderCard.scss";

interface IProps {
	providerStepInfo: ProviderStepInfo;
	appointmentDate?: AppointmentDate;
	selected?: boolean;
	onSelectProvider?: (providerId?: number) => void;
}

function ProviderCard(props: IProps) {
	const { t } = useTranslation("common");

	return (
		<>
			<div className="card-secondary provider-card__container">
				<ProviderInfo
					providerStepInfo={props.providerStepInfo}
					appointmentDate={props.appointmentDate}
				/>
				{props.onSelectProvider != undefined && (
					<Button
						type="primary"
						disabled={props.selected}
						onClick={() => props.onSelectProvider!(props.providerStepInfo.idProvider)}>
						{t("select")}
					</Button>
				)}
			</div>
		</>
	);
}

export default ProviderCard;

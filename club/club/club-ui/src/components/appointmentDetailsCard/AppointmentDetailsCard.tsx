import ProviderInfo from "components/providerInfo/ProviderInfo";
import { ProviderStepInfo, SlotStepInfo } from "types/entities/StepsInfo";
import "./AppointmentDetailsCard.scss";

interface IProps {
	slotStepInfo: SlotStepInfo;
	providerStepInfo: ProviderStepInfo;
}

function AppointmentDetailsCard(props: IProps) {
	return (
		<>
			<div className="card-secondary appointment__details__card__container">
				<ProviderInfo
					providerStepInfo={props.providerStepInfo}
					appointmentDate={{
						dateAppointment: props.slotStepInfo.dateAvailability,
						valueTimeAppointment: props.slotStepInfo.valueTime,
					}}
				/>
			</div>
		</>
	);
}

export default AppointmentDetailsCard;

import CalendarWidgetContainer from "components/calendar/slots/CalendarWidgetContainer";
import Loading from "components/loading/Loading";
import { useEffect, useState } from "react";
import { SlotStepInfo } from "types/entities/StepsInfo";
import "./SlotStep.scss";

interface IProps {
	idLocation?: number;
	idEquivalentAppointment?: number;
	idProvider?: number;
	currentSlot?: SlotStepInfo;
	onBackStep?: () => void;
	saveSlot: (slotStepInfo?: SlotStepInfo) => void;
}

function SlotStep(props: IProps) {
	const [loading, setLoading] = useState<boolean>(true);
	const [selectedSlot, setSelectedSlot] = useState<SlotStepInfo>();
	const [showMore, setShowMore] = useState<boolean>(true);

	const selectSlot = (slotStepInfo?: SlotStepInfo) => {
		props.saveSlot(slotStepInfo);
	};

	useEffect(() => {
		setSelectedSlot(props.currentSlot);
		setLoading(false);
	}, [props.currentSlot]);

	return (
		<>
			{loading ? (
				<Loading />
			) : (
				<>
					<div className={showMore ? "slots__container--showMore" : "slots__container--showLess"}>
						<CalendarWidgetContainer
							idLocation={props.idLocation}
							idEquivalentAppointment={props.idEquivalentAppointment}
							idProvider={props.idProvider}
							currentSlot={selectedSlot}
							selectSlot={selectSlot}
						/>
					</div>
					{/* <div className="slots__container__footer">
						<Button
							type="link"
							onClick={() => {
								setShowMore(!showMore);
							}}
							className="field__label">
							{showMore ? <>Mostrar menos</> : <>Mostrar más</>}
						</Button>
					</div> */}
					<div className="slots__container__divider">
						<hr />
					</div>
				</>
			)}
		</>
	);
}

export default SlotStep;

import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal } from "antd";
import DateTitle from "components/dateTitle/DateTitle";
import ProviderDetails from "components/providerInfo/providerDetails/ProviderDetails";
import { useState } from "react";
import { AppointmentDate } from "types/entities/Appointment";
import { ProviderStepInfo } from "types/entities/StepsInfo";
import { URL } from "utils/rest";
import "./ProviderInfo.scss";

interface IProps {
	providerStepInfo: ProviderStepInfo;
	appointmentDate?: AppointmentDate;
	nameProvider?: string;
}

function ProviderInfo(props: IProps) {
	const [showModal, setShowModal] = useState(false);

	return (
		<>
			<Modal
				open={showModal}
				onCancel={() => {
					setShowModal(false);
				}}
				footer={null}
				style={{ minWidth: "768px", top:40 }}
				width={700}>
				<ProviderDetails idProvider={props.providerStepInfo.idProvider} />
			</Modal>
			<div className="provider-card-info">
				<div
					className="provider-card-photo"
					onClick={() => {
						setShowModal(true);
					}}>
					{props.providerStepInfo.hasProviderPhoto ? (
						<div className="loading-img">
							<img
								alt=""
								src={URL + "/file?pa&idProvider=" + props.providerStepInfo.idProvider}
								onLoad={(e) => {
									e.currentTarget.parentElement!.classList.remove("loading-img");
									e.currentTarget.parentElement!.style.width = "auto";
								}}
							/>
						</div>
					) : (
						<FontAwesomeIcon icon={faUserCircle} className="icon" />
					)}
				</div>
				<div>
					{props.appointmentDate && (
						<div className="mb-8">
							<DateTitle
								date={{
									dateAppointment: props.appointmentDate.dateAppointment,
									valueTimeAppointment: props.appointmentDate.valueTimeAppointment,
								}}
							/>
						</div>
					)}
					<div
						className="provider__card__info__name"
						onClick={() => {
							setShowModal(true);
						}}>
						{props.nameProvider
							? props.nameProvider
							: props.providerStepInfo.namePerson
									.concat(" ")
									.concat(props.providerStepInfo.nameSurname1)
									.concat(
										props.providerStepInfo.nameSurname2
											? " " + props.providerStepInfo.nameSurname2
											: ""
									)}
					</div>
					<div className="provider__card__info__speciality">
						{props.providerStepInfo.namePosition}
					</div>
				</div>
			</div>
		</>
	);
}

export default ProviderInfo;

import AppointmentDetailComponent from "components/appointmentDetail/AppointmentDetailComponent";
import AppointmentDetailData from "components/appointmentDetailData/AppointmentDetailData";
import AppointmentHistory from "components/appointmentHistory/AppointmentHistory";
import { PersonaMascotaInfo } from "types/entities/Appointment";
import { EnumAppointmentTypeStatus } from "types/enums/AppointmentTypeStatus";

interface IProps {
	personaMascotaData: PersonaMascotaInfo;
}
const AppointmentDetail = (props: IProps) => {
	return (
		<div className="citas__datos">
			<AppointmentHistory appointment={props.personaMascotaData} />
			<div className="citas__datos--inner">
				<AppointmentDetailComponent
					appointmentDetail={props.personaMascotaData}></AppointmentDetailComponent>
				<AppointmentDetailData
					PersonaMascotaData={props.personaMascotaData}></AppointmentDetailData>
				<div className="citas__datos__buttons">
					{props.personaMascotaData.typeStatus !== EnumAppointmentTypeStatus.CANCELLED &&
						props.personaMascotaData.typeStatus !== EnumAppointmentTypeStatus.DONE && (
							/*<Button
								className="citas__datos--button"
								type="primary"
								danger
								onClick={() => {
									router.navigate(citas + "/" + id + "/modificar");
								}}>
								{t("modifyAppointment")}
							</Button>*/
							<></>
						)}
					{props.personaMascotaData.typeStatus !== EnumAppointmentTypeStatus.CANCELLED &&
						props.personaMascotaData.typeStatus !== EnumAppointmentTypeStatus.DONE && (
							/*<Button
								className="citas__datos--button"
								type="primary"
								danger
								onClick={showCancellationModal}>
								{t("cancelAppointment")}
							</Button>*/
							<></>
						)}
					{props.personaMascotaData.typeStatus !== EnumAppointmentTypeStatus.CANCELLED &&
						props.personaMascotaData.typeStatus !== EnumAppointmentTypeStatus.DONE && (
							/*<Button
								className="citas__datos--button"
								type="primary"
								danger
								onClick={showNotDoneModal}>
								{t("notDoneAppointment")}
							</Button>*/
							<></>
						)}
					{/*<Button
						type="primary"
						className="citas__datos--button"
						onClick={() => {
							router.navigate(citas + "/" + id + "/veterinary");
						}}>
						{t("veterinaryHistory")}
					</Button>*/}
				</div>
			</div>
		</div>
	);
};

export default AppointmentDetail;

import {
	faCalendar,
	faHouseMedical,
	faUserCircle,
	faVideo,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, Tag } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { PersonaMascotaInfo } from "types/entities/Appointment";
import Provider from "types/entities/Provider";
import { EnumAppointmentTypeStatus } from "types/enums/AppointmentTypeStatus";
import { ProviderInfoOperations } from "types/operations/ProviderInfo";
import { URL } from "utils/rest";
import { Rest } from "utils/utils";
import "./AppointmentDetailComponent.scss";

interface IProps {
	appointmentDetail: PersonaMascotaInfo;
}

const AppointmentDetailComponent = (props: IProps) => {
	const { t } = useTranslation("appointmentDetail");

	const dateMoment = dayjs(props.appointmentDetail.dateAppointment);
	let dayName = dateMoment.format("dddd");
	dayName = dayName.charAt(0).toUpperCase() + dayName.slice(1);
	const day = dateMoment.format("DD");
	const monthName = dateMoment.format("MMMM");
	const year = dateMoment.format("YYYY");
	const hour = props.appointmentDetail.valueTimeAppointment;

	const providerInfoString = sessionStorage.getItem("providerInfo");
	const [providerInfo, setProviderInfo] = useState({} as Provider);

	useEffect(() => {
		Rest<ProviderInfoOperations, Provider>()
			.operation({
				type: "SelectProviderById",
				id: props.appointmentDetail.idProvider,
			})
			.then((response) => {
				setProviderInfo(response);
			});
	}, []);

	const { id } = useParams();

	return (
		<>
			<div className="appointment__detail__component__container">
				{props.appointmentDetail.typeStatus === EnumAppointmentTypeStatus.CANCELLED && (
					<div className="appointment__status">
						<Tag color="red"> Cancelada </Tag>
					</div>
				)}
				<div className="appointment__detail__component__container__data">
					<div className="appointment__detail__component__container__data--avatar">
						{providerInfo?.blobPhoto ? (
							<div className="loading-img">
								<Avatar
									size={100}
									alt=""
									src={URL + "/file?pa&idProvider=" + providerInfo.idProvider}></Avatar>
							</div>
						) : (
							<FontAwesomeIcon icon={faUserCircle} className="icon" />
						)}
					</div>
					<div className="appointment__detail__component__container__data__info">
						<div>
							<FontAwesomeIcon
								icon={faCalendar}
								style={{ fontSize: "0.9rem", marginRight: "10px" }}></FontAwesomeIcon>
							{dayName}, {day} {t("de")} {monthName} {t("de")} {year} {t("at")} {hour}
						</div>
						<div>
							{props.appointmentDetail.nameProvider} {props.appointmentDetail.surName1Provider}{" "}
							{props.appointmentDetail.surName2Provider}
						</div>
						<div>{props.appointmentDetail.nameSpeciality} </div>
						<div className="appointment__detail__component__container__data__info__call">
							<div>
								{props.appointmentDetail.flagOnline ? (
									<>
										<FontAwesomeIcon
											icon={faVideo}
											style={{ fontSize: "0.9rem", marginRight: "10px" }}></FontAwesomeIcon>
										{t("video")}
									</>
								) : (
									<>
										<FontAwesomeIcon
											icon={faHouseMedical}
											style={{ fontSize: "0.9rem", marginRight: "10px" }}></FontAwesomeIcon>
										{t("inPerson")}
									</>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default AppointmentDetailComponent;

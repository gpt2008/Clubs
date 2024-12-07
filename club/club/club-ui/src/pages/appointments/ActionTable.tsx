import { faEllipsis, faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Dropdown, MenuProps, Modal } from "antd";
import { MenuItemType } from "antd/es/menu/hooks/useItems";
import AppointmentEdit from "components/appointmentEdit/AppointmentEdit";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PersonaMascotaInfo } from "types/entities/Appointment";
import { EnumAppointmentTypeStatus } from "types/enums/AppointmentTypeStatus";
import enumAppointmentCancellationReason from "types/enums/EnumAppointmentCancellationReason";
import enumAppointmentStatusNew from "types/enums/EnumAppointmentStatusNew";
import { GetAppointmentDetailInfo } from "types/operations/Appointment";
import { Rest } from "utils/utils";
import AppointmentDetail from "./AppointmentDetail";

interface IProps {
	loadAppointmentsData: (
		offset?: number | undefined,
		typeStatus?: number | undefined,
		idProvider?: number | undefined
	) => void;
	currentPage: number;
	idAppointment: number;
	typeStatus: number;
	idLocation: number;
}

const ActionTable = (props: IProps) => {
	const { t } = useTranslation("appointments");

	const [personaMascotaData, setPersonaMascotaData] = useState({} as PersonaMascotaInfo);
	const [open, setOpen] = useState(false);
	const [acceptModal, setAcceptModal] = useState(false);
	const [cancelModal, setCancelModal] = useState(false);
	const [modifyModal, setModifyModal] = useState(false);
	const [actionItems, setActionItems] = useState<MenuProps["items"]>([]);

	const onItemClick: MenuProps["onClick"] = (item) => {
		if (item.key === "detail") {
			onClickSeeMore(props.idAppointment);
		} else if (item.key === "accept") {
			showAcceptModal();
		} else if (item.key === "cancel") {
			showCancelModal();
		}
	};

	useEffect(() => {
		var detail: MenuItemType = {
			key: "detail",
			label: <span>{t("details")}</span>,
		};
		var accept: MenuItemType = {
			key: "accept",
			label: <span>{t("accept")}</span>,
		};
		var cancel: MenuItemType = {
			key: "cancel",
			label: <span>{t("cancel")}</span>,
			danger: true,
		};

		if (props.typeStatus == enumAppointmentStatusNew.PROPOSED) {
			setActionItems([detail, accept, cancel]);
		} else if (
			props.typeStatus == enumAppointmentStatusNew.CONFIRMED ||
			props.typeStatus == enumAppointmentStatusNew.EXPIRED_PROPOSAL
		) {
			setActionItems([detail, cancel]);
		} else {
			setActionItems([detail]);
		}
	}, [props.idAppointment]);

	const showModal = () => {
		setOpen(true);
	};

	const showAcceptModal = () => {
		setAcceptModal(true);
	};

	const showCancelModal = () => {
		setCancelModal(true);
	};

	const onClickSeeMore = (idAppointment: number) => {
		Rest<GetAppointmentDetailInfo, PersonaMascotaInfo>()
			.operation({
				type: "GetPatientPetAndPersonInfo",
				idAppointment: idAppointment != null ? idAppointment : 0 ,
			})
			.then((response) => {
				setPersonaMascotaData(response);
				showModal();
			});
	};

	const onOk = () => {
		setOpen(false);
		showAcceptModal();
	};

	const acceptOk = (id: number) => {
		Rest<
			{ type: string; idAppointment: number; typeStatus: number; typeStatusDetail: number | null },
			any
		>()
			.operation({
				type: "UpdateAppointmentStatus",
				idAppointment: id,
				typeStatus: EnumAppointmentTypeStatus.CONFIRMED,
				typeStatusDetail: null,
			})
			.then(() => {
				props.loadAppointmentsData(props.currentPage);
				onClickSeeMore(id);
				setAcceptModal(false);

				//envio de mail de confirmacion de cita al cliente
				Rest<{ type: string; idAppointment: number }, any>()
					.operation({
						type: "SendAppointmentConfirmationToClient",
						idAppointment: id,
					})
					.then(() => {});
			});
	};

	const onCancel = () => {
		setOpen(false);
		showCancelModal();
	};

	const onClose = () => {
		setOpen(false);
	};

	const acceptCancel = (id: number) => {
		Rest<
			{ type: string; idAppointment: number; typeStatus: number; typeStatusDetail: number | null },
			any
		>()
			.operation({
				type: "UpdateAppointmentStatus",
				idAppointment: id,
				typeStatus: EnumAppointmentTypeStatus.CANCELLED,
				typeStatusDetail: enumAppointmentCancellationReason.CANCELLED_BY_PROVIDER,
			})
			.then(() => {
				props.loadAppointmentsData(props.currentPage);
				onClickSeeMore(id);
				setCancelModal(false);
			});

		Rest<{ type: string; idAppointment: number },any>()
			.operation({
				type: "RefundAppointment",
				idAppointment: id,
			}).then((response) =>{
				console.log(response)
			});
	};

	const onModify = () => {
		setModifyModal(true);
		setOpen(false);
	};

	const onCancelModify = () => {
		setModifyModal(false);
		setOpen(true);
	};

	return (
		<>
			<Modal open={modifyModal} closable={false} footer={(_, {}) => <></>} width={700}>
				<AppointmentEdit
					idAppointment={props.idAppointment}
					idProvider={personaMascotaData.idProvider}
					idLocation={props.idLocation}
					onUpdate={() => {
						setModifyModal(false);
						setOpen(true);
						props.loadAppointmentsData(props.currentPage);
					}}
					onClose={onCancelModify}></AppointmentEdit>
			</Modal>
			<Modal
				closable={false}
				open={acceptModal}
				onOk={() => {
					acceptOk(props.idAppointment);
				}}
				onCancel={() => {
					setAcceptModal(false);
				}}
				width={700}>
				<p>{t("acceptConfirmation")}</p>
			</Modal>
			<Modal
				closable={false}
				open={cancelModal}
				onOk={() => {
					acceptCancel(props.idAppointment);
				}}
				onCancel={() => {
					setCancelModal(false);
				}}
				width={700}>
				<p>{t("cancelConfirmation")}</p>
			</Modal>
			<Modal
				closable={false}
				open={open}
				onOk={onOk}
				onCancel={onClose}
				footer={(_, { OkBtn }) => (
					<>
						{personaMascotaData.typeStatus == enumAppointmentStatusNew.PROPOSED && (
							<>
								<div className="appointmentDetail__buttons">
								<div className="appointmentDetail__buttons__left">
								<Button
									type="primary"
									onClick={() => {
										onOk();
									}}
									>
									{t("acceptModal")}
								</Button>
								<Button
									onClick={() => {
										onCancel();
									}}
									danger>
									{t("cancelModal")}
								</Button>
								<Button
									type="primary"
									onClick={() => {
										onModify();
									}}>
									{t("modifyModal")}
								</Button>
								</div>
								<div>
								<Button style={{alignSelf:'left'}}
									type="primary"
									onClick={() => {
										setOpen(false);
									}}>
									{t("close")}
								</Button>
								</div>
								

							</div>
							</>
						)}
						{(personaMascotaData.typeStatus == enumAppointmentStatusNew.CONFIRMED ||
							personaMascotaData.typeStatus == enumAppointmentStatusNew.EXPIRED_PROPOSAL) && (
							<>
								<div className="appointmentDetail__buttons">
									<div className="appointmentDetail__buttons__left">
									<Button
										onClick={() => {
											onCancel();
										}}
										danger>
										{t("cancelModal")}
									</Button>
									</div>
								<div>
									<Button style={{alignSelf:'left'}}
										type="primary"
										onClick={() => {
											setOpen(false);
										}}>
										{t("close")}
									</Button>
								</div>							
							</div>
								
							</>
						)}
					</>
				)}
				width={700}>
				<AppointmentDetail personaMascotaData={personaMascotaData}></AppointmentDetail>
			</Modal>
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					gap: "0.5rem",
				}}>
				<Dropdown trigger={["click", "hover"]} menu={{ items: actionItems, onClick: onItemClick }}>
					<div className = "appointment--action--three-dots ">
						<FontAwesomeIcon
						icon={faEllipsisVertical}
						style={{
							color: '#FFFFFF',
						}} />
					</div>
			</Dropdown>
			</div>
		</>
	);
};

export default ActionTable;

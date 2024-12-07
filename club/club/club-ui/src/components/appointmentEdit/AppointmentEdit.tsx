import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "antd";
import AppointmentDetailsCard from "components/appointmentDetailsCard/AppointmentDetailsCard";
import SlotStep from "components/steps/slots/SlotStep";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ProviderStepInfo, SlotStepInfo } from "types/entities/StepsInfo";
import { Rest } from "utils/utils";
import "./AppointmentEdit.scss";
import { CloseOutlined } from "@ant-design/icons";

interface IOptions {
	value: number;
	label: string;
}

interface IProps {
	idAppointment: number;
	idProvider: number;
	idLocation: number;
	onUpdate: () => void;
	onClose: () => void;
}

function AppointmentEdit(props: IProps) {
	const { t } = useTranslation(["common", "appointmentEdit"]);

	const [selectedSlot, setSelectedSlot] = useState<SlotStepInfo>();
	const [selectedProvider, setSelectedProvider] = useState<ProviderStepInfo>();
	const [modalOpen, setModalOpen] = useState(false);

	useEffect(() => {
		Rest<
			{
				type: string;
				idProvider: number;
			},
			ProviderStepInfo
		>()
			.operation({
				type: "SelectProviderDataById",
				idProvider: props.idProvider,
			})
			.then((response) => {
				setSelectedProvider(response);
			});
	}, []);

	const onSaveSlot = (slotParam?: SlotStepInfo) => {
		setSelectedSlot(slotParam);
	};

	const onModalCancel = () => {
		//clearState();
		setModalOpen(false);
	};

	const clearState = () => {
		setSelectedSlot(undefined);
	};

	const getStep = () => {
		if (selectedSlot == undefined) {
			return (
				<SlotStep
					idEquivalentAppointment={Number(props.idAppointment)}
					saveSlot={onSaveSlot}
					idProvider={props.idProvider}
					idLocation={props.idLocation}
				/>
			);
		} else {
			return (
				<AppointmentDetailsCard slotStepInfo={selectedSlot!} providerStepInfo={selectedProvider!} />
			);
		}
	};

	const getCardTitle = () => {
		if (selectedSlot !== undefined) {
			return t("cardTitleProvider", { ns: "appointmentEdit" });
		} else {
			return t("cardTitleSlot", { ns: "appointmentEdit" });
		}
	};

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "32px" }}>
			<div className="steps__header__container">
				<div className="steps__header__title">
					<h3>
						<FontAwesomeIcon icon={faCalendarDays} className="fs-xl" />{" "}
						{t("header", { ns: "appointmentEdit" })}
					</h3>
				</div>
				<p className="neutral">{t("subheaderSlot", { ns: "appointmentEdit" })}</p>
			</div>

			<div className="appointment__edit__card--outer">
				<div className="card-primary appointment__edit__card--inner">
					<p style={{ fontSize: "1rem" }}>{getCardTitle()}</p>
					{getStep()}
				</div>
				<CloseOutlined style={{    position: 'absolute',
						top: '0',
						right: '0',
						padding: '1rem'}}
					type="primary"
					onClick={() => {
						setSelectedSlot(undefined);
						props.onClose();
					}}>
					{t("cancel")}
				</CloseOutlined>
			</div>
		</div>
	);
}

export default AppointmentEdit;

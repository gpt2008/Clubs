import { Modal } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PolicyOwnerData } from "types/entities/PersonasInfo";
import { Rest } from "utils/utils";

type Props = {
	open?: boolean;
	onCancel: () => void;
};

interface BaseOperation {
	type: string;
}

function AppointmentLimit(props: Props) {
	const { t } = useTranslation(["usageLimit"]);

	const [clientData, setClientData] = useState<PolicyOwnerData>();

	const loadPerson = () => {
		/*Rest<BaseOperation, PolicyOwnerData>()
			.operation({
				type: "SelectLoggedUserPolicyData",
			})
			.then((response) => {
				setClientData(response);
			});*/
	};

	return (
		<Modal open={props.open} footer={null} onCancel={props.onCancel}>
			<div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
				<div
					className="card-secondary"
					style={{
						maxWidth: "400px",
						marginTop: "8px",
						marginBottom: "16px",
						textAlign: "center",
						boxShadow: "none",
					}}>
					<i
						className="fa-regular fa-message-exclamation primary"
						style={{ fontSize: "32px", marginBottom: "8px" }}
					/>
					<div className="p" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
						<div>
							{clientData
								? clientData.name + t("appointmentLimitPreMessage1")
								: t("appointmentLimitPreMessage2")}
							{t("appointmentLimitMessage1")}
						</div>
						<strong>{t("appointmentLimitMessage2")}</strong>
					</div>
				</div>
			</div>
		</Modal>
	);
}

export default AppointmentLimit;

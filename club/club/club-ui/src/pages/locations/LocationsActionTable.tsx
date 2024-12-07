import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Dropdown, Menu } from "antd";
import { useTranslation } from "react-i18next";

interface IProps {
	idLocation: number;
	nameLocation: string;
	forceReloadTimestamp: number;
	openLocationForm: (idLocation?: number) => void;
	onClickConfigurationClosingPeriods: (idLocation: number, nameLocation: string) => void;
}

const LocationsActionTable = (props: IProps) => {
	const { t } = useTranslation(["locationList"]);

	const onClick = (value: string) => {
		switch (value) {
			case "1":
				props.openLocationForm(props.idLocation);
				break;
			default:
				props.onClickConfigurationClosingPeriods(props.idLocation, props.nameLocation);
				break;
		}
	};

	const addServicesDropdown = (
		<Menu onClick={(e: any) => onClick(e.key)}>
			<Menu.Item key="1">{t("editLocationButton")}</Menu.Item>
			<Menu.Item key="2">{t("closingPeriodsButton")}</Menu.Item>
		</Menu>
	);
	return (
		<>
			<Dropdown overlay={addServicesDropdown} trigger={["hover"]}>
				<Button
					size="middle"
					type="primary"
					shape="circle"
					style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
					<FontAwesomeIcon icon={faEllipsis} />
				</Button>
			</Dropdown>
		</>
	);
};

export default LocationsActionTable;

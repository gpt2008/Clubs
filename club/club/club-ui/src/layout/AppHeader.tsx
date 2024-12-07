import { faBell, faUserGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Col, Dropdown, MenuProps, Row } from "antd";
import DenticardIsotipo from "images/isotipo.png";
import { useTranslation } from "react-i18next";
import router from "router";
import enumAccessType from "types/enums/EnumAccessType";
import Rest, { URL } from "utils/rest";
import { changePassword, login } from "utils/router-utils";
import { HomeInfo } from "./MainLayout";

const AppHeader = (props: { homeInfo?: HomeInfo }) => {
	const { t } = useTranslation(["header"]);

	var namePerson = "";
	if (props.homeInfo && props.homeInfo.namePerson) {
		namePerson = props.homeInfo.namePerson;

		if (props.homeInfo.surnamePerson1) {
			namePerson += " " + props.homeInfo.surnamePerson1;
		}
		if (props.homeInfo.surnamePerson2) {
			namePerson += " " + props.homeInfo.surnamePerson2;
		}
	}

	const userServicesMenuOnClick: MenuProps["onClick"] = ({ key }) => {
		switch (key) {
			case "1":
				router.navigate(changePassword);
				break;
			case "2":
				Rest<{ type: string }, {}>()
					.operation({
						type: "Logout",
					})
					.then((response) => {
						router.navigate(login);
					});
				break;
		}
	};

	const userServicesMenu: MenuProps["items"] = [
		{
			key: "1",
			label: <Button >{t("common:changePassword")}</Button>,
		},
		{
			key: "2",
			label:<Button block >{t("logout")}</Button>,
		},
	];

	const userServicesMenuProps = {
		items: userServicesMenu,
		onClick: userServicesMenuOnClick,
	};

	return (
		<>
			<Row align="middle" style={{ height: "100%" }} gutter={16}>
				<Col span={8}>
					<Row>
						<Col>
							<div style={{ display: "flex", alignItems: "center" }}>
								<div className="header-organization-logo isotopo">
									<img src={DenticardIsotipo} alt="" />
								</div>
							</div>
						</Col>
						<Col>
							{props.homeInfo?.hasOrganizationLogo && (
								<div className="header-organization-logo">
									<img
										src={URL + "/file?ol&idOrganization=" + props.homeInfo.idOrganization}
										alt="Organization logo"
									/>
								</div>
							)}
						</Col>
					</Row>
				</Col>
				<Col span={16}>
					<div className="header--options">
						<div className="header--user--info">
							<span>{namePerson}</span>
							<b>
								{props.homeInfo?.typeAccess === enumAccessType.ORGANIZATION_ADMINISTRATOR
									? " " + t("administrator")
									: props.homeInfo?.typeAccess === enumAccessType.LOCATION_ADMINISTRATOR
									? " " + t("locationManager")
									: props.homeInfo?.typeAccess === enumAccessType.APPOINTMENT_MANAGER
									? " " + t("user")
									: ""}
							</b>
						</div>
						<div className="header--options--icon--inner">
							<Button className="header--options--icon" shape="circle">
								<FontAwesomeIcon icon={faBell} />
							</Button>
						</div>
						<div className="header--options--icon--inner">
							<Dropdown menu={userServicesMenuProps} trigger={["hover"]} placement="bottomRight">
								<Button className="header--options--icon" shape="circle">
									<FontAwesomeIcon icon={faUserGear} />
								</Button>
							</Dropdown>
						</div>
					</div>
				</Col>
			</Row>
		</>
	);
};

export default AppHeader;

import {
	faAddressCard,
	faBuilding,
	faCalendarDays,
	faChartPie,
	faFilePdf,
	faMoneyBillTrendUp,
	faSuitcase,
	faUserGroup,
	faUserTie,
	faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { Col, Row } from "antd";
import { useTranslation } from "react-i18next";
import { OrganizationResume } from "types/entities/Organization";
import enumPages from "types/enums/EnumPages";
import "./Home.scss";
import HomeCard from "./HomeCard";

interface IProps {
	organizationResume: OrganizationResume;
	patientReservationUrl: string;
	onPageClicked: (key: number) => void;
}

const Home = (props: IProps) => {
	const { t } = useTranslation(["home"]);

	return (
		<div className="home-all-container">
			<div className="home-container">
				<div className="home-row">
					<span className="home-row-title">{t("appointmentsTitle")}</span>
					<Row className="home-row-cards" align="middle" gutter={[48, 48]}>
						<Col>
							<HomeCard
								color="#8BC740"
								title={t("agendas")}
								value={props.organizationResume.agendasAndStaff}
								icon={faCalendarDays}
								onClick={() => props.onPageClicked(enumPages.AGENDAS_PAGE)}
							/>
						</Col>
						<Col>
							<HomeCard
								color="#FADB15"
								title={t("clients")}
								value={props.organizationResume.patients}
								icon={faUserGroup}
								onClick={() => props.onPageClicked(enumPages.CLIENTS_PAGE)}
							/>
						</Col>
					</Row>
				</div>
				<div className="home-row">
					<span className="home-row-title">{t("agendaConfTitle")}</span>
					<Row className="home-row-cards" align="middle" gutter={[48, 48]}>
						<Col>
							<HomeCard
								color="#40189D"
								title={t("staff")}
								value={props.organizationResume.agendasAndStaff}
								icon={faUserTie}
								onClick={() => props.onPageClicked(enumPages.STAFF_PAGE)}
							/>
						</Col>
						<Col>
							<HomeCard
								color="#48A9F8"
								title={t("locations")}
								value={props.organizationResume.locations}
								icon={faBuilding}
								onClick={() => props.onPageClicked(enumPages.LOCATIONS_PAGE)}
							/>
						</Col>
						<Col>
							<HomeCard
								color="#1BD084"
								title={t("services")}
								value={props.organizationResume.services}
								icon={faSuitcase}
								onClick={() => props.onPageClicked(enumPages.SERVICES_PAGE)}
							/>
						</Col>
						<Col>
							<HomeCard
								color="#FF6746"
								title={t("cardCreator")}
								value={props.organizationResume.services}
								icon={faAddressCard}
								onClick={() => props.onPageClicked(enumPages.CARD_CREATOR)}
							/>
						</Col>
					</Row>
				</div>
				<div className="home-row">
					<span className="home-row-title">{t("administrationTitle")}</span>
					<Row className="home-row-cards" align="middle" gutter={[48, 48]}>
						<Col>
							<HomeCard
								color="#FF6746"
								title={t("users")}
								value={props.organizationResume.users}
								icon={faUsers}
								onClick={() => props.onPageClicked(enumPages.USERS_PAGE)}
							/>
						</Col>
						<Col>
							<HomeCard
								color="#FE8024"
								title={t("reports")}
								value={props.organizationResume.reports || 3}
								icon={faChartPie}
								onClick={() => props.onPageClicked(enumPages.REPORTS_PAGE)}
							/>
						</Col>
						<Col>
							<HomeCard
								color="#707070"
								title={t("billing")}
								value={props.organizationResume.billing || "3528"}
								valueType="€"
								icon={faMoneyBillTrendUp}
								onClick={() => props.onPageClicked(enumPages.BILLING)}
							/>
						</Col>
						<Col>
							<HomeCard
								color="#FADB15"
								title={t("Pdf Cards")}
								value={props.organizationResume.pdfCards || "10"}
								icon={faFilePdf}
								onClick={() => props.onPageClicked(enumPages.PDF_CARDS_PAGE)}
							/>
						</Col>
					</Row>
				</div>
			</div>
			<div className="home-footer">
				<span>{t("clientUrl")}</span>
				<a href={props.patientReservationUrl} target="_blank">
					{props.patientReservationUrl}
				</a>
			</div>
		</div>
	);
};

export default Home;

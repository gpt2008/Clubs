import bootstrapPlugin from "@fullcalendar/bootstrap";
import { DatesSetArg } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Col, Empty, Row } from "antd";
import PageOptions from "comps/PageOptions";
import { useTranslation } from "react-i18next";
import "./Agendas.scss";
import { IState as IStateContainer } from "./AgendasScheduleContainer";

import "@fortawesome/fontawesome-free/css/all.css";
import allLocales from "@fullcalendar/core/locales-all";
import OrganizationsDropdown from "components/filterDropdowns/organizationsDropdown/OrganizationsDropdown";
import ProvidersDropDown from "components/filterDropdowns/providersDropdown/ProvidersDropdown";

interface IProps {
	calendarComponentRef: any;
	selectProvider: (idProvider: number | undefined) => void;
	selectOrganization: (idOrganization: number) => void;
	filterOptions: (inputValue: String) => void;
	filterProviders: (inputValue: string, idOrganization?: number) => void;
	events: (info: any, successCallback: any) => void;
	eventClick: (info: any) => void;
	dateClick: (info: any) => void;
	dateSet: (dateInfo: DatesSetArg) => void;
}

const AgendasSchedule = (props: IProps & IStateContainer) => {
	const { t } = useTranslation(["agendasSchedule"]);

	const onChangeOrganizationsSearch = (idOrganization: number) => {
		props.selectOrganization(idOrganization);
		props.selectProvider(undefined);
	};

	return (
		<div className="page--container provider-schedule__container">
			<PageOptions
				title={t("agendasTitle")}
				extraContent={
					<>
						<Row gutter={24} className="agendas-row">
							<Col span={12} style={{paddingLeft: "16px", paddingRight: "16px" }} md={12} xs={24}>
								<OrganizationsDropdown
									idOrganizationSelected={props.idOrganizationSelected}
									organizations={props.organizations}
									onChangeSearch={onChangeOrganizationsSearch}
									filterOptions={props.filterOptions}
									style={{
										minWidth: "300px",
										maxWidth: "300px",
										maxHeight: "500px",
									}}
								/>
							</Col>
							<Col span={10} style={{paddingLeft: "16px", paddingRight: "16px" }} md={10} xs={24}>
								<ProvidersDropDown
									idProviderSelected={props.idProviderSelected}
									idOrganization={props.idOrganizationSelected}
									providers={props.providers}
									filterProviders={props.filterProviders}
									forceProviderPhotoReloadKey={props.forceProviderPhotoReloadKey}
									selectProvider={props.selectProvider}
									disabled={props.idOrganizationSelected === undefined}
									style={{ 
										minWidth: "300px", 
										maxWidth: "300px", 
										maxHeight: "500px" }}
								/>
							</Col>
						</Row>
					</>
				}
			/>

			{props.idOrganizationSelected !== undefined && props.idProviderSelected !== undefined ? (
				<div className="page--wrapper app-calendar__container">
					<Calendar
						calendarHeight={props.calendarHeight}
						calendarComponentRef={props.calendarComponentRef}
						events={props.events}
						eventClick={props.eventClick}
						dateClick={props.dateClick}
						dateSet={props.dateSet}
					/>
				</div>
			) : (
				<>
					<div className="page--wrapper">
						<Empty
							description={
								<div>
									<span style={{ display: "flex", color: "grey" }}>{t("selectorTitle")}</span>
								</div>
							}
							style={{
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								justifyContent: "center",
								position: "relative",
								background: "#DCDCDC",
								minHeight: props.calendarHeight,
								borderRadius: "0.25rem",
								padding: "1rem 1rem",
							}}
						/>
					</div>
				</>
			)}
		</div>
	);
};

const Calendar = (props: {
	calendarComponentRef: any;
	events: (info: any, successCallback: any) => void;
	eventClick: (info: any) => void;
	dateClick: (info: any) => void;
	dateSet: (dateInfo: DatesSetArg) => void;
	calendarHeight?: number | string;
}) => {
	const { t, i18n } = useTranslation(["agendasSchedule"]);

	return (
		<div className="app-calendar">
			<FullCalendar
				allDaySlot={false}
				locales={allLocales}
				locale={i18n.language}
				initialView="dayGridMonth"
				buttonText={{ today: t("todayButton") }}
				headerToolbar={{
					left: "prev,next today",
					center: "title",
					right: "dayGridMonth,timeGridWeek,timeGridDay",
				}}
				plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, bootstrapPlugin]}
				ref={props.calendarComponentRef}
				events={props.events}
				navLinks={true}
				themeSystem="standard"
				dateClick={props.dateClick}
				eventClick={props.eventClick}
				slotDuration="00:15:00"
				height={props.calendarHeight}
				datesSet={props.dateSet}
				nowIndicator={true}
				slotLabelFormat={{
					hour: "2-digit",
					minute: "2-digit",
					omitZeroMinute: false,
					meridiem: "short",
				}}
				eventTimeFormat={{
					hour: "2-digit",
					minute: "2-digit",
					omitZeroMinute: false,
					meridiem: "short",
				}}
			/>
		</div>
	);
};

export default AgendasSchedule;

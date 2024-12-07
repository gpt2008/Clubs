import bootstrapPlugin from "@fullcalendar/bootstrap";
import { DatesSetArg } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Cascader, Checkbox, Col, Empty, Form, Row } from "antd";
import PageOptions from "comps/PageOptions";
import { useTranslation } from "react-i18next";
import "pages/agendas/Agendas.scss";
import { IState as IStateContainer } from "./NuevaCitaContainer";

import "@fortawesome/fontawesome-free/css/all.css";
import allLocales from "@fullcalendar/core/locales-all";
import { useEffect } from "react";

interface IProps {
	calendarComponentRef: any;
	//selectOrganization: (idOrganization: number) => void;
	//filterOptions: (inputValue: String) => void;
    selectNomenclator: (idSpeciality?: number, idSubspeciality?: number, idAct?: number,nameSpeciality?: string, nameSubespeciality?: string, nameAct?: string, duration?:number) => void;
	events: (info: any, successCallback: any) => void;
	eventClick: (info: any) => void;
	dateClick: (info: any) => void;
	dateSet: (dateInfo: DatesSetArg) => void;
	onCheck: (checked: any) => void;
}


const NuevaCita = (props: IProps & IStateContainer) => {
	const { t } = useTranslation(["newSchedule"]);
    const [form] = Form.useForm();
    
    const filter = (inputValue: any, path: any) => {
		return path.some(
			(option: any) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
		);
	};

    const onChangeService = (value: any, more: any) => {
        if (value)
            props.selectNomenclator(Number(value[0]),Number(value[1]),Number(value[2]),more[0].label,more[1].label,more[2].label, more[2].valueDuration);
        else
            props.selectNomenclator();
    };

	return (
		<div className="page--container provider-schedule__container">
			<PageOptions
				title={t("title")}
				extraContent={
					<>
                        <Row gutter={24} className="agendas-row" style={{alignItems:"center"}}>
                            <Col span={16} style={{paddingLeft: "16px", paddingRight: "16px" }} md={16} xs={24}>
                                <Cascader
                                    options={props.services}
                                    placeholder={t("servicePlaceHolder")}
                                    showSearch={{ filter }}
                                    onChange={onChangeService}
                                    style={{
										minWidth: "400px",
										maxWidth: "400px",
									}}
                                />
                            </Col>
							<Col span={2} md={2} xs={24} style={{paddingRight: "16px"}}>
								<Checkbox onChange={props.onCheck}
									style={{
											minWidth: "200px",
											maxWidth: "200px",
										}}>
									{t("showApp")}
								</Checkbox>
							</Col>
                        </Row>
					</>
				}
			/>

			{props.idEspecialidad  !== undefined ? (
				<div className="page--wrapper app-calendar__container">
					<Calendar
						calendarHeight={props.calendarHeight}
						calendarComponentRef={props.calendarComponentRef}
						events={props.events}
						eventClick={props.eventClick}
						dateClick={props.dateClick}
						dateSet={props.dateSet}
						checked={props.checked}
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
	checked?: boolean;
}) => {
	const { t, i18n } = useTranslation(["agendasSchedule"]);
	//const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
	
	useEffect(() => {
	}, [props.checked]);

	return (
		<div className="app-calendar">
			<FullCalendar
				allDaySlot={false}
				locales={allLocales}
				locale={i18n.language}
				initialView="timeGridWeek"
				buttonText={{ today: t("todayButton") }}
				headerToolbar={{
					left: "prev,next today",
					center: "title",
					right: "timeGridWeek,timeGridDay",
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
				eventOverlap={false}
    			//slotEventOverlap={false}
				//timeZone={userTimeZone}
			/>
		</div>
	);
};

export default NuevaCita;

import bootstrapPlugin from "@fullcalendar/bootstrap";
import { DatesSetArg } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Button, Col, Modal, Row } from "antd";
import { useTranslation } from "react-i18next";
import { IState as IStateContainer } from "./DoctorsCalendarContainer";

interface IProps {
  visible?: boolean;
  calendarComponentRef: any;
  onClose: (info: any) => void;
  events: (info: any, successCallback: any) => void;
  eventClick: (info: any) => void;
  dateClick: (info: any) => void;
  dateSet: (dateInfo: DatesSetArg) => void;
}

const DoctorCalendar = (props: IProps & IStateContainer) => {
  const { t } = useTranslation(["newAppointmentForm"]);

  const footer = (
    <Row style={{ alignItems: "end" }}>
      <Col span={24}>
        <Button onClick={() => props.onClose(false)}>
          {t("buttons:cancel")}
        </Button>
      </Col>
    </Row>
  );

  return (
    <Modal
      open={props.visible}
      style={{ top: 40 }}
      footer={footer}
      onCancel={() => props.onClose(null)}
      destroyOnClose
      closable={false}
      width={800}
    >
      <div className="provider-schedule__container app-calendar__container">
        <Calendar
          calendarHeight={props.calendarHeight}
          calendarComponentRef={props.calendarComponentRef}
          events={props.events}
          eventClick={props.eventClick}
          dateClick={props.dateClick}
          dateSet={props.dateSet}
        />
      </div>
    </Modal>
  );
};

const Calendar = (props: {
  calendarComponentRef: any;
  events: (info: any, successCallback: any) => void;
  eventClick: (info: any) => void;
  dateClick: (info: any) => void;
  dateSet: (dateInfo: DatesSetArg) => void;
  calendarHeight?: number;
}) => {
  const { t } = useTranslation(["agendasSchedule"]);

  return (
    <div className="app-calendar">
      <FullCalendar
        initialView="timeGridWeek"
        buttonText={{ today: t("todayButton") }}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        plugins={[
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin,
          bootstrapPlugin,
        ]}
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
      />
    </div>
  );
};

export default DoctorCalendar;

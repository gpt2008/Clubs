import { FormInstance } from "antd";
import { Store } from "antd/lib/form/interface";
import dayjs from "dayjs";
import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import {
	default as AppointmentAlternative,
	default as AppointmentData,
} from "types/entities/Appointment";
import enumAppointmentCancellationProposal from "types/enums/EnumAppointmentCancellationProposal";
import { EnumAppointmentTypeStatus } from "../../types/enums/AppointmentTypeStatus";
import {
	MultipleCancellationOperation,
	MultipleCancellationResponse,
} from "../../types/operations";
import { Rest } from "../../utils/utils";
import CancellationDetails from "./CancellationDetails";

interface IProps {
	visible?: boolean;
	appointments?: AppointmentData[];
	limit?: number;
	dateFilter?: any;
	dateRender: (record: AppointmentData) => void;
	statusRender: (typeStatus: number) => void;
	onClose: (save: boolean) => void;
	cancelledByManager?: boolean;
}

export interface IState {
	step: number;
	tableKey?: number;
	alternatives?: AppointmentAlternative[];
	firstPageFields?: {
		cancellationReasonType: number;
		cancellationReasonValue?: string;
		additionalMessage?: string;
	};
}

class CancellationDetailsContainer extends React.Component<WithTranslation & IProps, IState> {
	public state: IState = {
		step: 0,
	};

	public render() {
		return (
			<CancellationDetails
				{...this.state}
				visible={this.props.visible}
				appointments={this.props.appointments}
				dateFilter={this.props.dateFilter}
				cancelledByManager={this.props.cancelledByManager}
				onCancel={() => this.props.onClose(false)}
				goBack={this.goBack}
				nextStep={this.nextStep}
				dateRender={this.props.dateRender}
				statusRender={this.props.statusRender}
				getAlternativeAppointment={this.getAlternativeAppointment}
			/>
		);
	}

	private goBack = () => {
		this.setState({ step: this.state.step - 1 });
	};

	private nextStep = (form: FormInstance) => {
		form.validateFields().then((values) => {
			if (this.state.step > 0) {
				this.save(values);
				return;
			}
			const firstPageFields = {
				cancellationReasonType: values.cancellationReasonType,
				cancellationReasonValue: values.cancellationReasonValue,
				additionalMessage: values.additionalMessage,
			};
			this.setState({ step: this.state.step + 1, firstPageFields });
		});
	};

	private getAlternativeAppointment = (form: FormInstance) => {
		const values = form.getFieldsValue();

		if (values.alternativeProposal === enumAppointmentCancellationProposal.NO_PROPOSITION) {
			this.setState({ tableKey: new Date().getTime() });
			return;
		}

		const appointments = (this.props.appointments || []).map((app) => {
			return {
				idAppointment: app.idAppointment,
				prestador: app.idPrestador,
				location: app.idLocation,
				appointmentValueDay: app.dateAppointment.getDay() === 0 ? 7 : app.dateAppointment.getDay(),
				appointmentValueTime: app.valueTime,
			};
		});

		const proposedDateFrom = values.proposedDateFrom
			? new Date(values.proposedDateFrom)
			: this.props.dateFilter
			? this.props.dateFilter.toDate()
			: dayjs().add(1, "days").toDate();

		Rest<
			{
				type: string;
				alternativeProposal: number;
				proposedDateFrom: Date;
				appointments: any;
			},
			AppointmentAlternative[]
		>()
			.operation({
				type: "GetAlternativeAppointmentDates",
				alternativeProposal: values.alternativeProposal,
				proposedDateFrom: new Date(proposedDateFrom.setHours(0, 0, 0, 0)),
				appointments,
			})
			.then((response) => {
				this.setState({
					alternatives: response,
					tableKey: new Date().getTime(),
				});
			});
	};

	private save = (values: Store) => {
		Rest<MultipleCancellationOperation, MultipleCancellationResponse>()
			.operation({
				type: "MultipleCancellation",
				typeStatus: EnumAppointmentTypeStatus.CANCELLED,
				typeStatusDetail: this.state.firstPageFields?.cancellationReasonType!,
				valueStatusReason: this.state.firstPageFields?.cancellationReasonValue,
				additionalMessage: this.state.firstPageFields?.additionalMessage,
				alternativeProposal: values.alternativeProposal,
				proposedDate: values.proposedDate,
				appointments: (this.props.appointments || []).map((app) => app.idAppointment),
				alternatives: this.state.alternatives || [],
			})
			.then(() => this.props.onClose(true));
	};
}

export default withTranslation("appointmentCancellation")(CancellationDetailsContainer);

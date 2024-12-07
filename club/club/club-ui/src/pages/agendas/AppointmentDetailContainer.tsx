import { notification } from "antd";
import CancellationDetailsContainer from "components/appointmentCancellation/CancellationDetailsContainer";
import React from "react";
import _ from "lodash";
import { WithTranslation, withTranslation } from "react-i18next";
import {
	default as AppointmentData,
	default as AppointmentProviderDetail,
} from "types/entities/Appointment";
import enumAppointmentStatusNew from "types/enums/EnumAppointmentStatusNew";
import { Functions, Rest, TableIcons } from "utils/utils";
import View from "./AppointmentDetail";
import EditAppointmentFormContainer from "./EditAppointmentFormContainer";
import { NewService } from "types/entities/Service";

interface IProps {
	visible?: boolean;
	idAppointment?: number;
	onClose: (save: boolean) => void;
	statusRender?: (typeStatus: number) => void;
	reloadAppointments?: () => void;
	cansellationDateFilter?: any;
	nuevaCita?: boolean;
	idService?: number[];
	service?: string[];
}

export interface IState {
	loaded?: boolean;
	appointment?: AppointmentProviderDetail;
	selectedAppointmentData?: AppointmentData;
	editFormVisible?: boolean;
	editFormKey?: number;
	cancellationDetailsKey?: number;
	cancellationDetailsVisible?: boolean;
	idAppointmentSelected?: number;
	patientSelected?: string;
	selectedAppointments?: AppointmentData[];
	services?: NewService[];
}

class AppointmentDetailContainer extends React.Component<WithTranslation & IProps, IState> {
	public state: IState = {};

	public componentDidMount() {
		this.props.visible && this.loadData();
	}

	public render() {
		return this.state.loaded ? (
			<>
				<View
					{...this.state}
					visible={this.props.visible}
					onCancel={() => this.props.onClose(false)}
					onClickEditAppointmenent={this.onClickEditAppointment}
					openCancellationDetails={this.openCancellationDetails}
				/>

				{/* Appointment details form modal */}
				<EditAppointmentFormContainer
					idAppointment={this.state.idAppointmentSelected}
					patient={this.state.patientSelected}
					key={this.state.editFormKey} // Force form regeneration
					visible={this.state.editFormVisible}
					onClose={this.onCloseEditForm}
					nuevaCita={this.props.nuevaCita}
					idService={this.props.idService}
					service={this.props.service}
				/>

				{/* Cancellation details */}
				<CancellationDetailsContainer
					key={this.state.cancellationDetailsKey}
					visible={this.state.cancellationDetailsVisible}
					appointments={this.state.selectedAppointments}
					dateRender={this.dateRender}
					statusRender={this.statusRender}
					onClose={this.onCloseCancellationDetails}
				/>
			</>
		) : (
			<></>
		);
	}

	private loadData = () => {
		Rest<{ type: string; idAppointment: number }, any>()
			.operation({
				type: "GetAppointmentProviderDetails",
				idAppointment: this.props.idAppointment!,
			})
			.then((response) =>
				this.setState({
					appointment: response,
					selectedAppointmentData: { ...response },
					loaded: true,
				})
			);
	};

	private dateRender = () => {
		const date =
			this.state.appointment?.dateAppointment! &&
			Functions.dateToString(this.state.appointment?.dateAppointment!);
		const time =
			this.state.appointment?.valueTime !== undefined &&
			Functions.getTime(this.state.appointment?.valueTime!).format("HH:mm");
		return date + ", " + time;
	};

	private statusRender = () => {
		if (!this.state.appointment?.typeStatus) {
			return null;
		}

		let color;
		switch (this.state.appointment?.typeStatus) {
			case enumAppointmentStatusNew.CONFIRMED:
				color = TableIcons.DotColor.green;
				break;
			case enumAppointmentStatusNew.CANCELLED:
				color = TableIcons.DotColor.red;
				break;
			case enumAppointmentStatusNew.DONE:
				color = TableIcons.DotColor.blue;
				break;
			case 5:
				color = TableIcons.DotColor.orange;
				break;

			default:
				color = TableIcons.DotColor.gray;
				break;
		}

		return TableIcons.getStatusTypeIcon(
			this.props.t("newAppointmentPrestadorStatuses:" + this.state.appointment?.typeStatus),
			color
		);
	};

	private onClickEditAppointment = (idAppointment: number, patient: string) => {
		this.setState({
			editFormVisible: true,
			editFormKey: new Date().getTime(),
			idAppointmentSelected: idAppointment,
			patientSelected: patient,
		});
	};

	private onCloseEditForm = (saved: boolean) => {
		this.setState({ editFormVisible: false }, () => {
			if (saved) {
				this.loadData();
			}
		});
	};

	private openCancellationDetails = () => {
		const currentSelectedAppointments: AppointmentData[] = [this.state.selectedAppointmentData!];
		this.setState({
			selectedAppointments: currentSelectedAppointments,
			cancellationDetailsVisible: true,
			cancellationDetailsKey: new Date().getTime(),
		});
	};

	private onCloseCancellationDetails = (save: boolean) => {
		this.setState({ cancellationDetailsVisible: false }, () => {
			if (save) {
				this.setState({ selectedAppointments: [] }, () => {
					notification["success"]({
						message: this.props.t("titles:actionPerformed"),
					});
					if (this.props.reloadAppointments) {
						this.props.reloadAppointments();
					}
					this.loadData();
				});
			}
		});
	};
}

export default withTranslation("newAppointmentForm")(AppointmentDetailContainer);

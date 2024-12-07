import { notification } from "antd";
import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import Schedule from "types/entities/Schedule";
import { MainTableBodyProps } from "utils/tableUtils";
import { Rest, TableUtils } from "utils/utils";
import ScheduleActionsFormContainer from "./ScheduleActionsFormContainer";
import ScheduleFormContainer from "./ScheduleFormContainer";
import View from "./ScheduleManagement";

interface IProps {
	visible?: boolean;
	idProvider?: number;
	nameProvider?: string;
	onClose: () => void;
}

export interface IState extends MainTableBodyProps {
	limit: number;
	page: number;
	dataCount: number;
	schedules?: Schedule[];
	idScheduleSelected?: number;
	nameScheduleSelected?: string;
	scheduleModalVisible?: boolean;
	scheduleModalKey?: number;
	cloneSchedule?: boolean;
	scheduleActionsModalVisible?: boolean;
	scheduleActionsModalKey?: number;
	scheduleActionsActivate?: boolean;
	scheduleActionsDrop?: boolean;
}

class ScheduleManagementContainer extends React.Component<WithTranslation & IProps, IState> {
	public state: IState = {
		dataCount: 0,
		limit: 0,
		page: 1,
	};

	public componentDidMount() {
		if (this.props.visible) {
			this.setState(
				TableUtils.calculatePageSizeForMainTable(),
				() => this.props.idProvider && this.loadData()
			);
		}
	}

	public render() {
		return (
			<>
				<View
					{...this.state}
					visible={this.props.visible}
					nameProvider={this.props.nameProvider}
					onChangePage={this.onChangePage}
					onClickScheduleForm={this.onClickScheduleForm}
					onClickSchedulesAction={this.onClickSchedulesAction}
					onClickScheduleSlotsForm={this.onClickScheduleSlotsForm}
					onCancel={this.props.onClose}
				/>
				<ScheduleFormContainer
					visible={this.state.scheduleModalVisible}
					key={this.state.scheduleModalKey}
					idProvider={this.props.idProvider!}
					nameProvider={this.props.nameProvider!}
					idSchedule={this.state.idScheduleSelected}
					cloneSchedule={this.state.cloneSchedule}
					onClose={this.onCloseScheduleSlotsForm}
				/>
				<ScheduleActionsFormContainer
					visible={this.state.scheduleActionsModalVisible}
					key={this.state.scheduleActionsModalKey}
					nameProvider={this.props.nameProvider!}
					idSchedule={this.state.idScheduleSelected}
					nameSchedule={this.state.nameScheduleSelected}
					activate={this.state.scheduleActionsActivate}
					drop={this.state.scheduleActionsDrop}
					onClose={this.onCloseScheduleActionsModal}
				/>
			</>
		);
	}

	private loadData = () => {
		Rest<{ type: string; idProvider: number; limit: number; offset: number }, any>()
			.operation({
				type: "SelectProviderScheduleList",
				idProvider: this.props.idProvider!,
				limit: 10,
				offset: (this.state.page - 1) * this.state.limit,
			})
			.then((response) => {
				this.setState({
					schedules: response.data,
					dataCount: response.dataCount,
				});
			});
	};

	private onChangePage = (page: number) => {
		this.setState({ page }, () => this.loadData());
	};

	private onClickScheduleForm = (idSchedule?: number, nameSchedule?: string) => {
		this.setState({
			scheduleModalVisible: true,
			scheduleModalKey: new Date().getTime(),
			idScheduleSelected: idSchedule,
			nameScheduleSelected: nameSchedule,
		});
	};

	private onCloseScheduleSlotsForm = (save: boolean) => {
		this.setState(
			{
				scheduleModalVisible: false,
				idScheduleSelected: undefined,
				nameScheduleSelected: undefined,
			},
			() => {
				if (save) {
					notification["success"]({
						message: this.props.t("titles:actionPerformed"),
					});
					this.loadData();
				}
			}
		);
	};

	private onClickScheduleSlotsForm = (
		idSchedule?: number,
		nameSchedule?: string,
		cloneSchedule?: boolean
	) => {
		this.setState({
			scheduleModalVisible: true,
			scheduleModalKey: new Date().getTime(),
			idScheduleSelected: idSchedule,
			nameScheduleSelected: nameSchedule,
			cloneSchedule,
		});
	};

	private onClickSchedulesAction = (
		idSchedule: number,
		nameSchedule: string,
		activate: boolean,
		drop: boolean
	) => {
		if (activate) {
			this.setState({
				scheduleActionsModalVisible: true,
				scheduleActionsModalKey: new Date().getTime(),
				idScheduleSelected: idSchedule,
				nameScheduleSelected: nameSchedule,
				scheduleActionsActivate: activate,
			});
		} else {
			this.setState({
				scheduleActionsModalVisible: true,
				scheduleActionsModalKey: new Date().getTime(),
				idScheduleSelected: idSchedule,
				nameScheduleSelected: nameSchedule,
				scheduleActionsActivate: activate,
				scheduleActionsDrop: drop,
			});
		}
	};

	private onCloseScheduleActionsModal = (save: boolean) => {
		this.setState(
			{
				scheduleActionsModalVisible: false,
				idScheduleSelected: undefined,
				nameScheduleSelected: undefined,
				scheduleActionsActivate: undefined,
				scheduleActionsDrop: undefined,
			},
			() => {
				if (save) {
					notification["success"]({
						message: this.props.t("titles:actionPerformed"),
					});
					this.loadData();
				}
			}
		);
	};
}

export default withTranslation("scheduleManagement")(ScheduleManagementContainer);

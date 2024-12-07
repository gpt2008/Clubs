import { notification } from "antd";
import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import HolidaysManagementData from "types/entities/Holidays";
import GetHolidaysManagementData from "types/operations/Holidays";
import { Rest } from "utils/utils";
import View from "./ClosingPeriodForm";
import NewClosingPeriodModalContainer from "./NewClosingPeriodModalContainer";

interface IProps {
	idLocation?: number;
	nameLocation?: string;
	visible?: boolean;
	onClose: (saved: boolean) => void;
}

export interface IState {
	holidays?: HolidaysManagementData;
	newHolidayFormVisible?: boolean;
	newHolidayFormKey?: number;
	showPastPeriod: boolean;
	loaded?: boolean;
}

class ClosingPeriodFormContainer extends React.Component<WithTranslation & IProps, IState> {
	public state: IState = {
		showPastPeriod: false,
	};

	public componentDidMount() {
		if (this.props.idLocation) {
			this.loadData();
		}
	}

	public render() {
		return this.state.loaded ? (
			<>
				<View
					{...this.state}
					visible={this.props.visible}
					nameLocation={this.props.nameLocation}
					onCancel={() => this.props.onClose(false)}
					onChangePublicHoliday={this.onChangePublicHoliday}
					onClickNewHolidayForm={this.onClickNewHolidayForm}
					onClickPastPeriod={this.onClickPastPeriod}
					deleteHolidayPeriod={this.deleteHolidayPeriod}
				/>

				<NewClosingPeriodModalContainer
					idLocation={this.props.idLocation!}
					key={this.state.newHolidayFormKey}
					visible={this.state.newHolidayFormVisible}
					onClose={this.onCloseNewHolidayForm}
				/>
			</>
		) : (
			<></>
		);
	}

	private loadData = () => {
		Rest<GetHolidaysManagementData, HolidaysManagementData>()
			.operation({
				type: "GetClosingPeriodsData",
				idLocation: this.props.idLocation!,
				date: new Date(),
				showPastPeriod: this.state.showPastPeriod,
			})
			.then((response) => {
				this.setState({ holidays: response, loaded: true });
			});
	};

	public onChangePublicHoliday = (idZoneHoliday: number, checked: boolean) => {
		Rest<
			{
				type: string;
				idZoneHoliday: number;
				idLocation: number;
				active: boolean;
			},
			any
		>().operation({
			type: "ManagePublicholidays",
			idZoneHoliday,
			idLocation: this.props.idLocation!,
			active: checked,
		});
	};

	private onClickNewHolidayForm = () => {
		this.setState({
			newHolidayFormVisible: true,
			newHolidayFormKey: new Date().getTime(),
		});
	};

	private onCloseNewHolidayForm = (saved: boolean) => {
		this.setState({ newHolidayFormVisible: false }, () => {
			if (saved) {
				this.loadData();
			}
		});
	};

	private deleteHolidayPeriod = (idPeriod: number) => {
		Rest<{ type: string; id: number }, any>()
			.operation({
				type: "DeleteLocationClosingPeriodById",
				id: idPeriod,
			})
			.then(() => {
				notification["success"]({
					message: this.props.t("titles:actionPerformed"),
				});

				this.loadData();
			});
	};

	private onClickPastPeriod = () => {
		this.setState({ showPastPeriod: !this.state.showPastPeriod }, () => this.loadData());
	};
}

export default withTranslation("holidaysAndClosingForm")(ClosingPeriodFormContainer);

import React from "react";

import { WithTranslation, withTranslation } from "react-i18next";
import {
	default as PrestadorHolidays,
	default as PrestadorHolidaysData,
} from "types/entities/Prestador";
import { Rest } from "utils/utils";
import NewProviderHolidaysModalContainer from "./NewProviderHolidaysModalContainer";
import View from "./ProviderHoliday";

interface IProps {
	idProvider?: number;
	nameProvider?: string;
	visible?: boolean;
	onClose: (saved: boolean) => void;
}

export interface IState {
	holidayList?: PrestadorHolidays[];
	newHolidayFormVisible?: boolean;
	newHolidayFormKey?: number;
	showPastPeriod: boolean;
	loaded?: boolean;
}

class ProviderHolidayContainer extends React.Component<WithTranslation & IProps> {
	public state: IState = {
		showPastPeriod: false,
	};

	public componentDidMount() {
		if (this.props.idProvider) {
			this.loadData();
		}
	}

	public render() {
		return (
			<>
				<View
					{...this.state}
					visible={this.props.visible}
					nameProvider={this.props.nameProvider}
					onCancel={() => this.props.onClose(false)}
					onClickNewHolidayForm={this.onClickNewHolidayForm}
					onClickPastPeriod={this.onClickPastPeriod}
					deleteHolidayPeriod={this.deleteHolidayPeriod}
				/>
				<NewProviderHolidaysModalContainer
					idProvider={this.props.idProvider!}
					key={this.state.newHolidayFormKey}
					visible={this.state.newHolidayFormVisible}
					onClose={this.onCloseNewHolidayForm}
				/>
			</>
		);
	}

	private loadData = () => {
		Rest<
			{ type: string; idProvider: number; date: Date; showPastPeriod: boolean },
			PrestadorHolidaysData
		>()
			.operation({
				type: "GetProviderHolidaysData",
				idProvider: this.props.idProvider!,
				date: new Date(),
				showPastPeriod: this.state.showPastPeriod,
			})
			.then((response) => {
				this.setState({
					holidayList: response.prestadorHolidayList || [],
					loaded: true,
				});
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

	private deleteHolidayPeriod = (idPrestadorHoliday: number) => {
		Rest<{ type: string; id: number }, any>()
			.operation({
				type: "DeleteProviderHolidayById",
				id: idPrestadorHoliday,
			})
			.then(() => this.loadData());
	};

	private onClickPastPeriod = () => {
		this.setState({ showPastPeriod: !this.state.showPastPeriod }, () => this.loadData());
	};
}

export default withTranslation("providerHolidayForm")(ProviderHolidayContainer);

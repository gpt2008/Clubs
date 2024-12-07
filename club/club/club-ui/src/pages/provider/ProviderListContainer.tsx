import { notification } from "antd";
import ProviderHolidayContainer from "components/providerHolidays/ProviderHolidayContainer";
import ScheduleManagementContainer from "components/providerSchedules/ScheduleManagementContainer";
import _ from "lodash";
import React from "react";
import { useEffect, useState } from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import Provider from "types/entities/Provider";
import { Rest, TableUtils } from "utils/utils";
import ProviderFormContainer from "./ProviderFormContainer";
import View from "./ProviderList";
import UTILS from "../../utils/tableUtils"

export interface IState {
	providers?: Provider[];
	providerFormVisible?: boolean;
	providerFormKey?: number;
	providerHolidaysFormVisible?: boolean;
	providerHolidaysFormKey?: number;
	schedulesFormVisible?: boolean;
	schedulesFormKey?: number;
	idProviderSelected?: number;
	nameProviderSelected?: string;
	highlightFilter?: string;
	countData?: number;
	page?: number;
	limit?: number;
	loading: boolean;
}

class ProviderListContainer extends React.Component<WithTranslation, IState> {
	public state: IState = {
		loading: false
	};

	public componentDidMount() {
		this.loadData();
	}

	public render() {
		return (
			<>
				<View
					providers={this.state.providers}
					openProviderForm={this.openProviderForm}
					openProviderHolidaysForm={this.openProviderHolidaysForm}
					//searchFilter={this.searchFilter}
					highlightFilter={this.state.highlightFilter}
					openProviderSchedules={this.openProviderSchedules}
					countData={this.state.countData ? this.state.countData : 0}
					page={this.state.page ? this.state.page : 1}
					loadProvidersData={this.loadData}
					limit = {this.state.limit ? this.state.limit : 1}
					loading = {this.state.loading}
				/>
				<ProviderFormContainer
					key={this.state.providerFormKey}
					visible={this.state.providerFormVisible}
					idProvider={this.state.idProviderSelected}
					nameProvider={this.state.nameProviderSelected}
					onClose={this.closeProviderForm}
				/>
				<ScheduleManagementContainer
					key={this.state.schedulesFormKey}
					visible={this.state.schedulesFormVisible}
					idProvider={this.state.idProviderSelected}
					nameProvider={this.state.nameProviderSelected}
					onClose={this.closeProviderSchedule}
				/>
				<ProviderHolidayContainer
					key={this.state.providerHolidaysFormKey}
					visible={this.state.providerHolidaysFormVisible}
					idProvider={this.state.idProviderSelected}
					nameProvider={this.state.nameProviderSelected}
					onClose={this.closeProviderHolidaysForm}
				/>
			</>
		);
	}

	private loadData = (offset?: number, typeStatus?: boolean, nameProvider?: string, idOrganization?: number) => {
		if (offset) this.setState({page: offset});
		this.setState({loading: true})
		Rest<{ type: string; date: Date, offset?:number, limit: number, typeStatusActive?: boolean, typeStatusInactive?: boolean, filter?:string, idOrganization?:number }, {limit:number, offset:string, dataCount:string, data: Provider[]}>()
			.operation({
				type: "SelectProviderListByOrganizations",
				date: new Date() ,
				limit: UTILS.calculatePageSizeForMainTableOther().limit,
				offset: offset ? (offset - 1) * 10 : 0,
				typeStatusActive: typeStatus ? typeStatus : undefined,
				typeStatusInactive: typeStatus ? undefined : typeStatus,
				filter: nameProvider,
				idOrganization: idOrganization
			})
			.then((response) => {
				this.setState({ providers: response.data, countData: Number(response.dataCount), limit: response.limit});
			}).finally(() => {
				this.setState({loading: false});
			});
	};

	private openProviderForm = (idProviderSelected?: number, nameProviderSelected?: string) => {
		this.setState({
			providerFormVisible: true,
			providerFormKey: new Date().getTime(),
			idProviderSelected,
			nameProviderSelected,
		});
	};

	private closeProviderForm = (save: boolean) => {
		this.setState(
			{
				providerFormVisible: false,
				idProviderSelected: undefined,
				nameProviderSelected: undefined,
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

	private openProviderSchedules = (idProviderSelected?: number, nameProviderSelected?: string) => {
		this.setState({
			schedulesFormVisible: true,
			schedulesFormKey: new Date().getTime(),
			idProviderSelected,
			nameProviderSelected,
		});
	};

	private closeProviderSchedule = () => {
		this.setState(
			{
				schedulesFormVisible: undefined,
				idProviderSelected: undefined,
				nameProviderSelected: undefined,
			},
			() => this.loadData()
		);
	};

	private openProviderHolidaysForm = (
		idProviderSelected?: number,
		nameProviderSelected?: string
	) => {
		this.setState({
			providerHolidaysFormVisible: true,
			providerHolidaysFormKey: new Date().getTime(),
			idProviderSelected,
			nameProviderSelected,
		});
	};

	private closeProviderHolidaysForm = () => {
		this.setState(
			{
				providerHolidaysFormVisible: undefined,
				idProviderSelected: undefined,
				nameProviderSelected: undefined,
			},
			() => this.loadData()
		);
	};

	/*private searchFilter = _.debounce((value: any) => this.doSearchFilter(value), 500);

	private doSearchFilter = (value: any) => {

		Rest<{ type: string; date: Date; filter: string }, Provider[]>()
			.operation({
				type: "SelectProviderListByOrganization",
				date: new Date(),
				filter: value,
			})
			.then((response) => {
				this.setState({ providers: response, highlightFilter: value });
			});
	};*/
}

export default withTranslation("providerList")(ProviderListContainer);

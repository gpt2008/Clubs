import { notification } from "antd";
import ClosingPeriodFormContainer from "components/closingPeriods/ClosingPeriodFormContainer";
import LocationDetailsFormContainer from "components/details/LocationDetailsFormContainer";
import _ from "lodash";
import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import LocationDetails from "types/entities/Location";
import Organization from "types/entities/Organization";
import { Rest } from "utils/utils";
import View from "./LocationList";

export interface IState {
	locations: LocationDetails[];
	loaded?: boolean;
	locationFormVisible?: boolean;
	locationFormKey?: number;
	formConfigClosingPeriodVisible?: boolean;
	formConfigClosingPeriodKey?: number;
	idLocationSelected?: number;
	nameLocationSelected?: string;
	forceReloadTimestamp?: number;
	highlightfilter?: string;
	page: number;
	countData?: number;
	filtersLoading: boolean;
	organizations?: Organization[];
}

class LocationListContainer extends React.Component<WithTranslation, IState> {
	public state: IState = {
		page: 0,
		locations: [],
		filtersLoading: false,
	};

	public componentDidMount() {
		this.applyFilters();
	}

	public render() {
		return (
			<>
				<View
					locations={this.state.locations}
					loadLocationsData={this.applyFilters}
					dataCount={this.state.countData}
					page={this.state.page}
					openLocationForm={this.openLocationForm}
					onClickConfigurationClosingPeriods={this.onClickConfigurationClosingPeriods}
					searchFilter={this.searchFilter}
					highlightfilter={this.state.highlightfilter}
					//applyFilters={this.applyFilters}
					filtersLoading={this.state.filtersLoading}
				/>

				<LocationDetailsFormContainer
					key={this.state.locationFormKey}
					visible={this.state.locationFormVisible}
					idLocationSelected={this.state.idLocationSelected}
					onClose={this.closeLocationForm}
				/>

				<ClosingPeriodFormContainer
					idLocation={this.state.idLocationSelected}
					nameLocation={this.state.nameLocationSelected}
					key={this.state.formConfigClosingPeriodKey} // Force form regeneration
					visible={this.state.formConfigClosingPeriodVisible}
					onClose={this.onCloseConfigurationClosingPeriodForm}
				/>
			</>
		);
	}

	private openLocationForm = (idLocation?: number) => {
		this.setState({
			locationFormVisible: true,
			locationFormKey: new Date().getTime(),
			idLocationSelected: idLocation,
		});
	};

	private closeLocationForm = (save: boolean) => {
		this.setState({ locationFormVisible: false, idLocationSelected: undefined }, () => {
			if (save) {
				notification["success"]({
					message: this.props.t("titles:actionPerformed"),
				});
				this.applyFilters();
			}
		});
	};

	private onClickConfigurationClosingPeriods = (idLocation: number, nameLocation: string) => {
		this.setState({
			formConfigClosingPeriodVisible: true,
			formConfigClosingPeriodKey: new Date().getTime(),
			idLocationSelected: idLocation,
			nameLocationSelected: nameLocation,
		});
	};

	private onCloseConfigurationClosingPeriodForm = (saved: boolean) => {
		this.setState(
			{
				formConfigClosingPeriodVisible: false,
				idLocationSelected: undefined,
				nameLocationSelected: undefined,
			},
			() => {
				if (saved) {
					this.applyFilters();
				}
			}
		);
	};

	private searchFilter = _.debounce((values: any) => this.doSearchFilter(values.filter), 500);

	private doSearchFilter = (value: any) => {
		Rest<{ type: string; filter: string }, LocationDetails[]>()
			.operation({
				type: "GetLocationsData",
				filter: value ? value : null,
			})
			.then((response) => {
				this.setState({
					locations: response,
					highlightfilter: value,
				});
			});
	};

	private filterData = (offset?: number, name?: string, idOrganization?: number) => {
		if (offset) {
			this.setState({ page: offset });
		} else {
			this.setState({ page: 0 });
		}

		Rest<
			{ type: string; limit: number; offset: number; name?: string; idOrganization?: number },
			{ limit: string; offset: string; dataCount: string; data: LocationDetails[] }
		>()
			.operation({
				type: "SelectLocationsPaged",
				name: name ? name : undefined,
				idOrganization: idOrganization ? idOrganization : undefined,
				limit: 10,
				offset: offset ? (offset - 1) * 10 : 0,
			})
			.then((response) => {
				this.setState({
					...this.state,
					locations: response.data,
					loaded: true,
					forceReloadTimestamp: new Date().getTime(),
					countData: Number(response.dataCount),
				});
			})
			.catch(() => {
				//message.error("Error al cargar las citas.");
			})
			.finally(() => {
				this.setState({ ...this.state, filtersLoading: false, highlightfilter: name });
			});
	};

	private applyFilters = (offset?: number, name?: string, idOrganization?: number) => {
		this.setState({
			filtersLoading: true,
		});
		this.filterData(offset, name, idOrganization);
	};
}

export default withTranslation("locationList")(LocationListContainer);

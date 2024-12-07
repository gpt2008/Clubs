import { useEffect, useState } from "react";

import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Drawer, Space, Table } from "antd";
import PageOptions from "comps/PageOptions";
import { useTranslation } from "react-i18next";
import LocationDetails from "types/entities/Location";
import "./Location.scss";
import { IState as IStateContainer } from "./LocationListContainer";
import LocationsFilter from "./LocationsFilter";
import { locationsTableColumns } from "./LocationsTableColumns";

interface IProps {
	openLocationForm: (idLocation?: number) => void;
	onClickConfigurationClosingPeriods: (idLocation: number, nameLocation: string) => void;
	searchFilter: (values: any) => void;
	page: number;
	loadLocationsData: (offset?: number, name?: string, idOrganization?: number) => void;
	dataCount?: number;
	locations: LocationDetails[];
	//applyFilters: (name?: string) => void;
	filtersLoading: boolean;
}

const LocationList = (props: IProps & IStateContainer) => {
	const { t } = useTranslation(["locationList"]);

	const [forceReloadTimestamp, setForceReloadTimestamp] = useState<number>(0);

	const [filters, setFilters] = useState<{ name?: string; idOrganization?: number }>();
	const [drawerIsOpen, setDrawerIsOpen] = useState(false);

	useEffect(() => {
		if (props.locations && props.locations.length > 0) {
			setForceReloadTimestamp(new Date().getTime());
		}
	}, [props.locations]);

	useEffect(() => {
		props.loadLocationsData(1, filters?.name, filters?.idOrganization);
	}, [filters]);

	const setFilterState = (name?: string, idOrganization?: number) => {
		setFilters({
			name: name,
			idOrganization: idOrganization,
		});
	};

	const openDrawer = () => {
		setDrawerIsOpen(true);
	};

	const closeDrawer = () => {
		setDrawerIsOpen(false);
	};


	return (
		<div className="listado_container">
			<Drawer
				className="filters-drawer"
				open={drawerIsOpen}
				onClose={closeDrawer}
				width="300px"
				placement="left"
				getContainer={false}>
				{<LocationsFilter applyFilters={setFilterState} filtersLoading={props.filtersLoading} />}
			</Drawer>
			<PageOptions title={t("locationsTitle")} onPlusClicked={props.openLocationForm} />{" "}
			<div className="table-container">
				<div className="table-container__header">
					<Space size="small" className="table-button-bar">
						<Button onClick={openDrawer} className="filter-btn">
							<FontAwesomeIcon icon={faFilter} />
						</Button>
					</Space>
				</div>
			</div>
			<Table
				className="table__custom-expandable-icon"
				columns={locationsTableColumns(
					forceReloadTimestamp,
					props.openLocationForm,
					props.onClickConfigurationClosingPeriods,
					props.highlightfilter
				)}
				pagination={{
					position: ["bottomCenter"],
					showSizeChanger: false,
					pageSize: 10,
					total: props.dataCount,
					current: props.page,
				}}
				onChange={(value) => {
					if (value.current)
						props.loadLocationsData(value.current, filters?.name, filters?.idOrganization);
				}}
				dataSource={props.locations}
			/>
			{/*
				<div className="page--elements page--wrapper">
					{!props.locations || props.locations.length === 0 ? (
						<EmptyCard
							searching={!!props.highlightfilter && props.highlightfilter.length > 0}
							description={t("addLocation")}
						/>
					) : (
						forceReloadTimestamp > 0 &&
						props.locations.map((location) => {
							return (
								<LocationCard
									key={location.idLocation}
									location={location}
									forceReloadTimestamp={forceReloadTimestamp}
									highlightFilter={props.highlightfilter}
									openLocationForm={props.openLocationForm}
									onClickConfigurationClosingPeriods={props.onClickConfigurationClosingPeriods}
								/>
							);
						})
					)}
				</div>*/}
		</div>
	);
};
/*
const LocationCard = (props: {
	location: LocationDetails;
	forceReloadTimestamp: number;
	highlightFilter?: string;
	openLocationForm: (idLocation?: number) => void;
	onClickConfigurationClosingPeriods: (idLocation: number, nameLocation: string) => void;
}) => {
	const { t } = useTranslation(["locationList"]);

	const onClick = (value: string) => {
		switch (value) {
			case "1":
				props.openLocationForm(props.location.idLocation);
				break;
			default:
				props.onClickConfigurationClosingPeriods(
					props.location.idLocation,
					props.location.nameLocation
				);
				break;
		}
	};

	const addServicesDropdown = (
		<Menu onClick={(e: any) => onClick(e.key)}>
			<Menu.Item key="1">{t("editLocationButton")}</Menu.Item>
			<Menu.Item key="2">{t("closingPeriodsButton")}</Menu.Item>
		</Menu>
	);

	const nameRenderer = (name: string) => {
		return props.highlightFilter ? (
			<Highlighter
				highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
				searchWords={[props.highlightFilter]}
				autoEscape
				textToHighlight={name}
			/>
		) : (
			name
		);
	};

	return (
		<div className="location-card__container">
			<div className="location-card__info">
				<div className="location-card-photo">
					{props.location.hasLocationPhoto ? (
						<div className="loading-img">
							<img
								style={{ cursor: 'pointer' }}
								alt=""
								src={
									URL +
									"/file?locl&idLocation=" +
									props.location.idLocation +
									"&" +
									props.forceReloadTimestamp
								}
								onClick={() => handleClickImage()}
								onLoad={(e) => {
									e.currentTarget.parentElement!.classList.remove("loading-img");
									e.currentTarget.parentElement!.style.width = "auto";
								}}
							/>
						</div>
					) : (
						<div className="card-photo-placeholder">
							<FontAwesomeIcon icon={faCameraAlt} />
						</div>
					)}
				</div>
				<div className="location-card-data">
					<span className="location-card-title">{nameRenderer(props.location.nameLocation)}</span>
					<div className="location-card-loc">
						<FontAwesomeIcon icon={faLocationDot} />
						<span>{props.location.valueAddress}</span>
					</div>
				</div>
			</div>
			<div className="card--three-dots">
				<Dropdown overlay={addServicesDropdown} trigger={["hover"]}>
					<Button size="middle" type="default" shape="circle">
						<FontAwesomeIcon icon={faEllipsis} />
					</Button>
				</Dropdown>
			</div>
		</div>
	);
};*/

export default LocationList;

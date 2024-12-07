import { useEffect, useState } from "react";

import { faCircle, faEllipsis, faUserCircle, faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Dropdown, Menu, Table, Drawer, Space } from "antd";
import EmptyCard from "comps/EmptyCard";
import PageOptions from "comps/PageOptions";
import dayjs from "dayjs";
import Highlighter from "react-highlight-words";
import { useTranslation } from "react-i18next";
import Provider from "types/entities/Provider";
import { URL } from "utils/rest";
import { TableIcons } from "utils/utils";
import "./Provider.scss";
import { IState as IStateContainer } from "./ProviderListContainer";
import tableColumns from "./ProviderTableColumns";
import ProvidersFilter from "./ProvidersFilter";
import UTILS from "../../utils/tableUtils"

interface IProps {
	openProviderForm: (idProviderSelected?: number, nameProviderSelected?: string) => void;
	openProviderHolidaysForm: (idProviderSelected?: number, nameProviderSelected?: string) => void;
	openProviderSchedules: (idProviderSelected?: number, nameProviderSelected?: string) => void;
	//searchFilter: (values: any) => void;
	countData: number;
	page: number;
	limit: number
	loadProvidersData: (
		offset?: number | undefined,
		typeStatus?: boolean | undefined,
		NameProvider?: string | undefined,
		idOrganization?: number | undefined
	) => void;
}

const ProviderList = (props: IProps & IStateContainer) => {
	const { t } = useTranslation(["providerList"]);

	const [forceReloadTimestamp, setForceReloadTimestamp] = useState<number>(0);
	const [drawerIsOpen, setDrawerIsOpen] = useState(false);
	const [typeStatus, setTypeStatus] = useState<boolean|undefined>(undefined);
	const [nameProvider, setNameProvider] = useState<string|undefined>(undefined);
	const [idOrganization, setIdOrganization] = useState<number|undefined>(undefined);

	const openDrawer = () => {
		setDrawerIsOpen(true);
	};

	const closeDrawer = () => {
		setDrawerIsOpen(false);
	};

	useEffect(() => {
		if (props.providers && props.providers.length > 0) {
			setForceReloadTimestamp(new Date().getTime());
		}
		closeDrawer();
	}, [props.providers]);

	return (
		<div className="listado_container">
			<Drawer
					className="filters-drawer"
					open={drawerIsOpen}
					onClose={closeDrawer}
					width="300px"
					placement="left"
					getContainer={false}>
					<ProvidersFilter applyFilters={props.loadProvidersData} providers={props.providers ? props.providers : []} setNameProvider={setNameProvider} setTypeStatus={setTypeStatus} idOrganization={idOrganization} setIdOrganization={setIdOrganization}/>
			</Drawer>
			<PageOptions
				title={t("staffTitle")}
				onPlusClicked={props.openProviderForm}
			/>

			<div className="page--wrapper">
				{forceReloadTimestamp > 0 && (
					<div className="table-container">
						<div className="table-container__header">
							<Space size="small" className="table-button-bar">
								<Button onClick={openDrawer} className="filter-btn">
									<FontAwesomeIcon icon={faFilter} />
								</Button>
							</Space>
						</div> 
						{!props.providers || props.providers.length === 0 ? (
							<EmptyCard
								searching={!!props.highlightFilter && props.highlightFilter.length > 0}
								description={t("addStaff")}
							/>
						) : (
							<Table
								className="table__custom-expandable-icon"
								columns={tableColumns(props.page, props.openProviderForm, props.openProviderHolidaysForm, props.openProviderSchedules, nameProvider)}
								pagination={{
									position: ["bottomCenter"],
									showSizeChanger: false,
									pageSize: props.limit,
									total: props.countData,
									current: props.page,
								}}
								onChange={(value) => {
									if(value.current)
										props.loadProvidersData(value.current, typeStatus, nameProvider, idOrganization);
								}}
								loading={props.loading}
								dataSource={props.providers}
						/>)}
					</div>
				)}
			</div>
		</div>
	);
};

export default ProviderList;

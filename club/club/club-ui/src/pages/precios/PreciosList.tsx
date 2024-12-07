import { useEffect, useState } from "react";
import {  faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Table, Space, Drawer } from "antd";
import EmptyCard from "comps/EmptyCard";
import PageOptions from "comps/PageOptions";
import { useTranslation } from "react-i18next";
import { IState as IStateContainer } from "./PreciosListContainer";
import tableColumns from "./PreciosTableColums";
import PreciosFilter from "./PreciosFilter";

//type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];

interface IProps {
	countData: number;
	page: number;
	limit: number;
	loadPreciosData: (
		offset?: number | undefined,
		NamePrecio?: string | undefined,
	) => void;
	onClickEditPreciosForm: (idPrecioselected?:  React.ReactNode, namePrecioselected?: string) => void;
	onClickDetails: (idPrecioSelected?: React.ReactNode, namePrecioSelected?: string) => void;
	onClickCompare: (idPrecioSelected?: number, namePrecioSelected?: string, idGarantia?:number) => void;
	setPrecioNameSet: (precioName?:string) => void;
}

const PreciosList = (props: IProps & IStateContainer) => {
	const { t } = useTranslation(["preciosList"]);

	const [forceReloadTimestamp, setForceReloadTimestamp] = useState<number>(0);
	const [drawerIsOpen, setDrawerIsOpen] = useState(false);

	const openDrawer = () => {
		setDrawerIsOpen(true);
	};

	const closeDrawer = () => {
		setDrawerIsOpen(false);
	};

	useEffect(() => {
		if (props.precios && props.precios.length > 0) {
			setForceReloadTimestamp(new Date().getTime());
		}
		closeDrawer();
	}, [props.precios]);

	return (
		<div className="listado_container">
			<Drawer
					className="filters-drawer"
					open={drawerIsOpen}
					onClose={closeDrawer}
					width="300px"
					placement="left"
					getContainer={false}>
					<PreciosFilter 
						applyFilters={props.loadPreciosData} 
						setNamePrecios={props.setPrecioNameSet}
						/>
			</Drawer>
			<PageOptions
				title={t("title")}
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
						{!props.precios || props.precios.length === 0 ? (
							<EmptyCard
								searching={!!props.highlightfilter && props.highlightfilter.length > 0}
								description={t("empty")}
							/>
						) : (
							<Table
								className="table__custom-expandable-icon"
                                //rowSelection={{ ...rowSelection }}
								columns={tableColumns(props.onClickEditPreciosForm,props.onClickDetails, props.onClickCompare, props.namePrecioNameSet)}
								pagination={{
									position: ["bottomCenter"],
									showSizeChanger: false,
									pageSize: props.limit,
									total: props.countData,
									current: props.page,
								}}
								onChange={(value) => {
									if(value.current)
										props.loadPreciosData(value.current);
								}}
								dataSource={props.precios}
						/>)}
					</div>
				)}
			</div>
		</div>
	);
};

export default PreciosList;

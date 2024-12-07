import { useEffect, useState } from "react";
import {  faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Table, Drawer, Space } from "antd";
import EmptyCard from "comps/EmptyCard";
import PageOptions from "comps/PageOptions";
import { useTranslation } from "react-i18next";
import CarterasFilter from "./CarterasFilter";
import { IState as IStateContainer } from "./CarterasListContainer";
import tableColumns from "./CarterasTableColums";

interface IProps {
	onClickEditCarteraForm: (idCarteraselected?: number, nameCarteraselected?: string, nameGarantiasSelected?:string,idGarantiaSelected?: number) => void;
	onClickRemoveCartera: (idCartera: number, nameCartera: string,idGarantiaSelected: number) => void;
	countData: number;
	page: number;
	limit: number
	loadCarterasData: (
		offset?: number | undefined,
		NameCartera?: string | undefined,
        idGarantia?: number
	) => void;
	filterOptions: (inputValue: string) => void;
	onChangeSearch: (idSpeciality?: number) => void;
	onClickDetails: (idCarteraSelected?: number, nameCarteraSelected?: string) => void;
	onClickCompare: (idCarteraSelected?: number, nameCarteraSelected?: string, idGarantiaSelected?: number, nameGarantiasSelected?:string) => void;
}

const CarterasList = (props: IProps & IStateContainer) => {
	const { t } = useTranslation(["carterasList"]);

	const [forceReloadTimestamp, setForceReloadTimestamp] = useState<number>(0);
	const [drawerIsOpen, setDrawerIsOpen] = useState(false);
	const [nameCartera, setNameCartera] = useState<string|undefined>(undefined);
    const [nameGarantia, setNameGarantia] = useState<string|undefined>(undefined);

	const openDrawer = () => {
		setDrawerIsOpen(true);
	};

	const closeDrawer = () => {
		setDrawerIsOpen(false);
	};

	useEffect(() => {
		if (props.carteras && props.carteras.length > 0) {
			setForceReloadTimestamp(new Date().getTime());
		}
		closeDrawer();
	}, [props.carteras]);

	return (
		<div className="listado_container">
			<Drawer
					className="filters-drawer"
					open={drawerIsOpen}
					onClose={closeDrawer}
					width="300px"
					placement="left"
					getContainer={false}>
					<CarterasFilter 
						applyFilters={props.loadCarterasData}
						carteras={props.carteras ? props.carteras : []}
						setNameCartera={setNameCartera}
						setNameGarantia={setNameGarantia}
						speciality={props.speciality}
						filterOptions={props.filterOptions}
						onChangeSearch={props.onChangeSearch} 
						idGarantia={props.idGarantiaSelectedSet ? props.idGarantiaSelectedSet :  props.idGarantiaSelected}
					/>
			</Drawer>
			<PageOptions
				title={t("title")}
				onPlusClicked={props.onClickEditCarteraForm}
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
						{!props.carteras || props.carteras.length === 0 ? (
							<EmptyCard
								searching={!!props.highlightfilter && props.highlightfilter.length > 0}
								description={t("addCartera")}
							/>
						) : (
							<Table
								className="table__custom-expandable-icon"
								columns={tableColumns(props.page,props.onClickEditCarteraForm, props.onClickDetails, props.onClickCompare ,nameCartera, nameGarantia)}
								pagination={{
									position: ["bottomCenter"],
									showSizeChanger: false,
									pageSize: props.limit,
									total: props.countData,
									current: props.page,
								}}
								onChange={(value) => {
									if(value.current)
										props.loadCarterasData(value.current, nameCartera);
								}}
								dataSource={props.carteras}
						/>)}
					</div>
				)}
			</div>
		</div>
	);
};

export default CarterasList;
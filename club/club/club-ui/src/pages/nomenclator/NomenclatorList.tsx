import { useEffect, useState } from "react";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Table, Drawer, Space } from "antd";
import EmptyCard from "comps/EmptyCard";
import PageOptions from "comps/PageOptions";
import { useTranslation } from "react-i18next";
import { IState as IStateContainer } from "./NomenclatorListContainer";
import tableColumns from "./NomenclatorTableColumns";
import NomenclatorFilter from "./NomenclatorFilter";

export interface IProps {
	onClickEditNomenclatorForm: (idSpecialitySelected?: number, idSubspecialitySelected?: number, idActSelected?: number, nameSpecialitySelected?: string, nameSubspecialitySelected?: string, nameActSelected?: string) => void;
	onClickRemoveNomenclator: (idSpeciality: number, idSubspeciality: number, idAct: number, nameSpeciality: string, nameSubspeciality: string, nameAct: string) => void;
	onClickActivateNomenclator: (idSpeciality: number, idSubspeciality: number, idAct: number, nameSpeciality: string, nameSubspeciality: string, nameAct: string) => void;
	countData: number;
	page: number;
	limit: number
	loadNomenclatorData: (
		offset?: number | undefined,
        idSpeciality?: number | undefined,
        idSubspeciality?: number | undefined,
        idAct?: number | undefined
	) => void;
    onChangeSpeciality: (idSpecialitySelected?: number) => void;
    onChangeSubspeciality: (idSubspecialitySelected?: number) => void;
    onChangeAct: (idActSelected?: number) => void;
	check: () => void;
	onClose: (save: boolean) => void;
}

const NomenclatorList = (props: IProps & IStateContainer) => {
	const { t } = useTranslation(["nomenclatorList"]);

	const [forceReloadTimestamp, setForceReloadTimestamp] = useState<number>(0);
	const [drawerIsOpen, setDrawerIsOpen] = useState(false);

	const openDrawer = () => {
		setDrawerIsOpen(true);
	};

	const closeDrawer = () => {
		setDrawerIsOpen(false);
	};

	useEffect(() => {
		if (props.nomenclators && props.nomenclators.length > 0) {
			setForceReloadTimestamp(new Date().getTime());
		}
		closeDrawer();
	}, [props.nomenclators]);
   
	return (
		<div className="listado_container">
			<Drawer
					className="filters-drawer"
					open={drawerIsOpen}
					onClose={closeDrawer}
					width="300px"
					placement="left"
					getContainer={false}>
					<NomenclatorFilter 
						{...props}
						
					/>
			</Drawer>
			<PageOptions
				title={t("title")}
				onPlusClicked={props.onClickEditNomenclatorForm}
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
						{!props.nomenclators || props.nomenclators.length === 0 ? (
							<EmptyCard
								searching={!!props.highlightfilter && props.highlightfilter.length > 0}
								description={t("addNomenclator")}
							/>
						) : (
							<Table
								className="table__custom-expandable-icon"
								columns={tableColumns(props.onClickEditNomenclatorForm, props.onClickRemoveNomenclator, props.onClickActivateNomenclator)}
								pagination={{
									position: ["bottomCenter"],
									showSizeChanger: false,
									pageSize: props.limit,
									total: props.countData,
									current: props.page,
								}}
								onChange={(value) => {
									if(value.current)
										props.loadNomenclatorData(value.current, props.idSpecialitySelectedSet, props.idSubspecialitySelectedSet ,
									 		props.idActSelectedSet  );
								}}
								dataSource={props.nomenclators}
						/>)}
					</div>
				)}
			</div>
		</div>
	);
};

export default NomenclatorList;

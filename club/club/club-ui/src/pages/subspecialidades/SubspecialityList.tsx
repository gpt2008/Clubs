import { useEffect, useState } from "react";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Table, Drawer, Space } from "antd";
import EmptyCard from "comps/EmptyCard";
import PageOptions from "comps/PageOptions";
import { useTranslation } from "react-i18next";
import { IState as IStateContainer } from "./SubspecialityListContainer";
import tableColumns from "./SubspecialityTableColumns";
import SubspecialityFilter from "./SubspecialityFilter";

interface IProps {
	onClickEditSubspecialityForm: (idSubspecialitySelected?: number, codeSubspecialitySelected?: string, nameSubspecialitySelected?: string, idSpecialitySelected?: number, nameSpecialitySelected?: string) => void;
	onClickRemoveSubspeciality: (idSubspeciality: number, nameSubspeciality: string, idSpecialitySelected?: number) => void;
	countData: number;
	page: number;
	limit: number;
	loadSubspecialityData: (
		offset?: number | undefined,
		NameSubspeciality?: string | undefined,
		idSpeciality?: number | undefined
	) => void;
	filterOptions: (inputValue: string) => void;
	onChangeSearch: (idSpeciality?: number) => void;
}

const SubspecialityList = (props: IProps & IStateContainer) => {
	const { t } = useTranslation(["subspecialityList"]);

	const [forceReloadTimestamp, setForceReloadTimestamp] = useState<number>(0);
	const [drawerIsOpen, setDrawerIsOpen] = useState(false);
	const [nameSubspeciality, setNameSubspeciality] = useState<string|undefined>(undefined);

	const openDrawer = () => {
		setDrawerIsOpen(true);
	};

	const closeDrawer = () => {
		setDrawerIsOpen(false);
	};

	useEffect(() => {
		if (props.subspecialities && props.subspecialities.length > 0) {
			setForceReloadTimestamp(new Date().getTime());
		}
		closeDrawer();
	}, [props.subspecialities]);

	return (
		<div className="listado_container">
			<Drawer
					className="filters-drawer"
					open={drawerIsOpen}
					onClose={closeDrawer}
					width="300px"
					placement="left"
					getContainer={false}>
					<SubspecialityFilter 
						applyFilters={props.loadSubspecialityData} 
						subspecialities={props.subspecialities ? props.subspecialities : []} 
						setNameSubspeciality={setNameSubspeciality}
						idSpeciality={props.idSpecialitySelectedSet ? props.idSpecialitySelectedSet : props.idSpecialitySelected}
						specialities={props.specialities}
						filterOptions={props.filterOptions}
						onChangeSearch={props.onChangeSearch}/>
			</Drawer>
			<PageOptions
				title={t("title")}
				onPlusClicked={props.onClickEditSubspecialityForm}
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
						{!props.subspecialities || props.subspecialities.length === 0 ? (
							<EmptyCard
								searching={!!props.highlightfilter && props.highlightfilter.length > 0}
								description={t("addSubspeciality")}
							/>
						) : (
							<Table
								className="table__custom-expandable-icon"
								columns={tableColumns(props.onClickEditSubspecialityForm, props.onClickRemoveSubspeciality, nameSubspeciality)}
								pagination={{
									position: ["bottomCenter"],
									showSizeChanger: false,
									pageSize: props.limit,
									total: props.countData,
									current: props.page,
								}}
								onChange={(value) => {
									if(value.current)
										props.loadSubspecialityData(value.current, nameSubspeciality, props.idSpecialitySelectedSet ? props.idSpecialitySelectedSet : props.idSpecialitySelected);
								}}
								dataSource={props.subspecialities}
						/>)}
					</div>
				)}
			</div>
		</div>
	);
};

export default SubspecialityList;

import { useEffect, useState } from "react";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Table, Drawer, Space } from "antd";
import EmptyCard from "comps/EmptyCard";
import PageOptions from "comps/PageOptions";
import { useTranslation } from "react-i18next";
import { IState as IStateContainer } from "./SpecialityListContainer";
import tableColumns from "./SpecialityTableColumns";
import SpecialityFilter from "./SpecialityFilter";

interface IProps {
	onClickEditSpecialityForm: (idSpecialitySelected?: number, codeSpecialitySelected?: string, nameSpecialitySelected?: string) => void;
	onClickRemoveSpeciality: (idSpeciality: number, nameSpeciality: string) => void;
	countData: number;
	page: number;
	limit: number
	loadSpecialityData: (
		offset?: number | undefined,
		NameSpeciality?: string | undefined,
	) => void;
}

const SpecialityList = (props: IProps & IStateContainer) => {
	const { t } = useTranslation(["specialityList"]);

	const [forceReloadTimestamp, setForceReloadTimestamp] = useState<number>(0);
	const [drawerIsOpen, setDrawerIsOpen] = useState(false);
	const [nameSpeciality, setNameSpeciality] = useState<string|undefined>(undefined);

	const openDrawer = () => {
		setDrawerIsOpen(true);
	};

	const closeDrawer = () => {
		setDrawerIsOpen(false);
	};

	useEffect(() => {
		if (props.specialities && props.specialities.length > 0) {
			setForceReloadTimestamp(new Date().getTime());
		}
		closeDrawer();
	}, [props.specialities]);

	return (
		<div className="listado_container">
			<Drawer
					className="filters-drawer"
					open={drawerIsOpen}
					onClose={closeDrawer}
					width="300px"
					placement="left"
					getContainer={false}>
					<SpecialityFilter 
						applyFilters={props.loadSpecialityData} 
						specialities={props.specialities ? props.specialities : []} 
						setNameSpeciality={setNameSpeciality}/>
			</Drawer>
			<PageOptions
				title={t("title")}
				onPlusClicked={props.onClickEditSpecialityForm}
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
						{!props.specialities || props.specialities.length === 0 ? (
							<EmptyCard
								searching={!!props.highlightfilter && props.highlightfilter.length > 0}
								description={t("addSpeciality")}
							/>
						) : (
							<Table
								className="table__custom-expandable-icon"
								columns={tableColumns(props.onClickEditSpecialityForm, props.onClickRemoveSpeciality, nameSpeciality)}
								pagination={{
									position: ["bottomCenter"],
									showSizeChanger: false,
									pageSize: props.limit,
									total: props.countData,
									current: props.page,
								}}
								onChange={(value) => {
									if(value.current)
										props.loadSpecialityData(value.current, nameSpeciality);
								}}
								dataSource={props.specialities}
						/>)}
					</div>
				)}
			</div>
		</div>
	);
};

export default SpecialityList;

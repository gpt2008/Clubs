import { useEffect, useState } from "react";
import {  faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Table, Drawer, Space } from "antd";
import EmptyCard from "comps/EmptyCard";
import PageOptions from "comps/PageOptions";
import { useTranslation } from "react-i18next";
import ActsFilter from "./ActsFilter";
import { IState as IStateContainer } from "./ActsListContainer";
import tableColumns from "./ActsTableColumns";

interface IProps {
	onClickEditActForm: (idActSelected?: number, nameActSelected?: string, codeActSelected?: string) => void;
	onClickRemoveAct: (idAct: number, nameAct: string) => void;
	countData: number;
	page: number;
	limit: number
	loadActsData: (
		offset?: number | undefined,
		NameAct?: string | undefined,
		CodeAct?: string | undefined,
	) => void;
}

const ActsList = (props: IProps & IStateContainer) => {
	const { t } = useTranslation(["actsList"]);

	const [forceReloadTimestamp, setForceReloadTimestamp] = useState<number>(0);
	const [drawerIsOpen, setDrawerIsOpen] = useState(false);
	const [nameAct, setNameAct] = useState<string|undefined>(undefined);
	const [codeAct, setCodeAct] = useState<string|undefined>(undefined);

	const openDrawer = () => {
		setDrawerIsOpen(true);
	};

	const closeDrawer = () => {
		setDrawerIsOpen(false);
	};

	useEffect(() => {
		if (props.acts && props.acts.length > 0) {
			setForceReloadTimestamp(new Date().getTime());
		}
		closeDrawer();
	}, [props.acts]);

	return (
		<div className="listado_container">
			<Drawer
					className="filters-drawer"
					open={drawerIsOpen}
					onClose={closeDrawer}
					width="300px"
					placement="left"
					getContainer={false}>
					<ActsFilter 
						applyFilters={props.loadActsData} 
						acts={props.acts ? props.acts : []} 
						setNameAct={setNameAct}
						setCodeAct={setCodeAct}/>
			</Drawer>
			<PageOptions
				title={t("title")}
				onPlusClicked={props.onClickEditActForm}
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
						{!props.acts || props.acts.length === 0 ? (
							<EmptyCard
								searching={!!props.highlightfilter && props.highlightfilter.length > 0}
								description={t("addAct")}
							/>
						) : (
							<Table
								className="table__custom-expandable-icon"
								columns={tableColumns(props.onClickEditActForm, props.onClickRemoveAct, nameAct, codeAct)}
								pagination={{
									position: ["bottomCenter"],
									showSizeChanger: false,
									pageSize: props.limit,
									total: props.countData,
									current: props.page,
								}}
								onChange={(value) => {
									if(value.current)
										props.loadActsData(value.current, nameAct, codeAct);
								}}
								dataSource={props.acts}
						/>)}
					</div>
				)}
			</div>
		</div>
	);
};

export default ActsList;

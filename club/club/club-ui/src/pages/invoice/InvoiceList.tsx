import { useEffect, useState } from "react";
import {  faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Table, Drawer, Space } from "antd";
import EmptyCard from "comps/EmptyCard";
import PageOptions from "comps/PageOptions";
import { useTranslation } from "react-i18next";
import { IState as IStateContainer } from "./InvoiceListContainer";
import tableColumns from "./InvoiceTableColumns";
import InvoiceFilter from "./InvoiceFilter";

interface IProps {
	countData: number;
	page: number;
	limit: number;
    onClickDownload: (idInvoice: number) => void;
	onClickRefund: (order:string) => void;
	loadActsData: (
		offset?: number | undefined,
		nif?: string | undefined,
		nameClient?: string | undefined,
	) => void;
	openExportModal: () => void;
}

const InvoiceList = (props: IProps & IStateContainer) => {
	const { t } = useTranslation(["invoiceList"]);

	const [forceReloadTimestamp, setForceReloadTimestamp] = useState<number>(0);
	const [drawerIsOpen, setDrawerIsOpen] = useState(false);
	const [nif, setNif] = useState<string|undefined>(undefined);
	const [nameClient, setNameClient] = useState<string|undefined>(undefined);
	const [state, setState] = useState<number|undefined>(undefined);

	const openDrawer = () => {
		setDrawerIsOpen(true);
	};

	const closeDrawer = () => {
		setDrawerIsOpen(false);
	};

	useEffect(() => {
		if (props.invoice && props.invoice.length > 0) {
			setForceReloadTimestamp(new Date().getTime());
		}
		closeDrawer();
	}, [props.invoice]);

	return (
		<div className="listado_container">
			<Drawer
					className="filters-drawer"
					open={drawerIsOpen}
					onClose={closeDrawer}
					width="300px"
					placement="left"
					getContainer={false}>
					<InvoiceFilter 
						applyFilters={props.loadActsData} 
						invoice={props.invoice} 
						setNif={setNif}
						setNameClient={setNameClient}/>
			</Drawer>
            <PageOptions
				title={t("title")}
			/>
			<div className="page--wrapper">
				{forceReloadTimestamp > 0 && (
					<div className="table-container">
						<div className="table-container__header" style={{justifyContent:"space-between"}}>
							<Space size="small" className="table-button-bar">
								<Button onClick={openDrawer} className="filter-btn">
									<FontAwesomeIcon icon={faFilter} />
								</Button>
							</Space>
							<Space size="small"  className="table-button-bar">
                                <Button className="filter-btn" style={{fontSize:"17px"}} onClick={() => {
                                   props.openExportModal();
                                }}>
                                    {t("export")}
                                </Button>
                            </Space>
						</div> 
						{!props.invoice || props.invoice.length === 0 ? (
							<EmptyCard
								searching={!!props.highlightfilter && props.highlightfilter.length > 0}
								description={t("addFactura")}
							/>
						) : (
							<Table
								className="table__custom-expandable-icon"
								columns={tableColumns(props.onClickDownload, props.onClickRefund, nif, nameClient)}
								pagination={{
									position: ["bottomCenter"],
									showSizeChanger: false,
									pageSize: props.limit,
									total: props.countData,
									current: props.page,
								}}
								onChange={(value) => {
									if(value.current)
										props.loadActsData(value.current, nif, nameClient);
								}}
								dataSource={props.invoice}
						/>)}
					</div>
				)}
			</div>
		</div>
	);
};

export default InvoiceList;

import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Drawer, Space, Table } from "antd";
import { MessageInstance } from "antd/es/message/interface";
import PageOptions from "comps/PageOptions";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AppointmentInfo } from "types/entities/Appointment";
import Provider from "types/entities/Provider";
import AppointmentsFilter from "./AppointmentsFilter";
import tableColumns from "./AppointmentsTableColumns";

interface IProps {
	dataCount: number;
	appointments: AppointmentInfo[];
	message: MessageInstance;
	applyFilters: (typeStatus?: number, idOrganization?: number) => void;
	providers: Provider[];
	loadAppointmentsData: (
		offset?: number | undefined,
		typeStatus?: number | undefined,
		idProvider?: number | undefined
	) => void;
	page: number;
	filterProviders: (inputValue: string, idOrganization?: number) => void;
}

const AppointmentsList = (props: IProps) => {
	const { t } = useTranslation("appointments");

	const [filters, setFilters] = useState<{ typeStatus?: number; idOrganization?: number }>();
	const [drawerIsOpen, setDrawerIsOpen] = useState(false);

	useEffect(() => {
		props.loadAppointmentsData(1, filters?.typeStatus, filters?.idOrganization);
	}, [filters]);

	const setFilterState = (typeStatus?: number, idOrganization?: number) => {
		setFilters({
			typeStatus: typeStatus,
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
		<>
			<div className="listado_container">
				<Drawer
					className="filters-drawer"
					open={drawerIsOpen}
					onClose={closeDrawer}
					width="300px"
					placement="left"
					getContainer={false}>
					<AppointmentsFilter
						filterProviders={props.filterProviders}
						applyFilters={setFilterState}
						providers={props.providers}
					/>
				</Drawer>
				<PageOptions title={t("appointmentTitle")}></PageOptions>
				<div className="table-container">
					<div className="table-container__header">
						<Space size="small" className="table-button-bar">
							<Button onClick={openDrawer} className="filter-btn">
								<FontAwesomeIcon icon={faFilter} />
							</Button>
						</Space>
					</div>
					<Table
						className="table__custom-expandable-icon"
						columns={tableColumns(props.page, props.loadAppointmentsData)}
						pagination={{
							position: ["bottomCenter"],
							showSizeChanger: false,
							pageSize: 10,
							total: props.dataCount,
							current: props.page,
						}}
						onChange={(value) => {
							props.loadAppointmentsData(
								value.current,
								filters?.typeStatus,
								filters?.idOrganization
							);
						}}
						dataSource={props.appointments}
					/>
				</div>
			</div>
		</>
	);
};

export default AppointmentsList;

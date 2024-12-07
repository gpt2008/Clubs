import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Drawer, FormInstance, Space, Table } from "antd";
import PageOptions from "comps/PageOptions";
import { AlignType } from "rc-table/lib/interface";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MascotasFromPersonas } from "types/entities/Mascota";
import { Personasinfo } from "types/entities/PersonasInfo";
import { Rest } from "utils/utils";
import ClientFilter from "./ClientFilter";
import "./ClientList.scss";

interface IProps {
	filtersCollapsed: any;
	Personasinfo: Personasinfo[];
	onCollapseFilters: () => void;
	searchNamePerson: (value: string) => void;
	searchPhone: (value: string) => void;
	applyFilters: (form: FormInstance) => void;
	resetFilters: () => void;
	filterKey?: number;
}

const ClientesList = (props: IProps) => {
	const MascotasfromPerson = async (id: number) => {
		try {
			const response = await Rest<{ type: string; idPropietario: number }, any[]>().operation({
				type: "SelectMascotasFromPerson",
				idPropietario: id,
			});

			for (var i = 0; i < response.length; i++) {
				const responseDate: any = await Rest<
					{ type: string; idPropietario: number; idMascota: number },
					any[]
				>().operation({
					type: "SelectMascotaLastAppointment",
					idPropietario: id,
					idMascota: response[i]["idMascota"],
				});

				console.log(responseDate);
				response[i]["dateAppointment"] = responseDate
					? responseDate["DateAppointment"].getDate() +
					  "/" +
					  responseDate["DateAppointment"].getMonth() +
					  "/" +
					  responseDate["DateAppointment"].getFullYear()
					: "";
			}

			return response;
		} catch (error) {
			console.error("Error:", error);
			throw error;
		}
	};

	const { t } = useTranslation("clientList");

	const columns = [
		{
			title: t("clientName"),
			dataIndex: "namePerson",
			key: "0",
			width: "15%",
			render: (
				_text: string,
				record: { namePerson: string; apellido1: string; apellido2: string }
			) => (
				<span>{`${record.namePerson} ${record.apellido1 || ""} ${record.apellido2 || ""}`}</span>
			),
			align: "left" as AlignType,
		},
		{
			title: t("phone"),
			dataIndex: "valuePhone",
			ellipsis: true,
			key: "1",
			width: "15%",
			align: "left" as AlignType,
		},
		{
			title: t("email"),
			dataIndex: "valueEmail",
			ellipsis: true,
			key: "2",
			width: "25%",
			align: "left" as AlignType,
		},
		{
			title: t("nextAppointment"),
			dataIndex: "dateAppointmentNext",
			ellipsis: true,
			key: "3",
			width: "15%",
			render: (_text: string, record: { dateAppointmentNext: Date }) => (
				<span>
					{`${
						record.dateAppointmentNext
							? record.dateAppointmentNext.getDate() +
							  "/" +
							  record.dateAppointmentNext.getMonth() +
							  "/" +
							  record.dateAppointmentNext.getFullYear()
							: "-----"
					}`}
				</span>
			),
			align: "center" as AlignType,
		},
		{
			title: t("creationDate"),
			dataIndex: "dateCreation",
			key: "5",
			width: "15%",
			ellipsis: true,
			render: (_text: string, record: { dateCreation: Date }) => (
				<span>
					{`${
						record.dateCreation
							? record.dateCreation.getDate() +
							  "/" +
							  record.dateCreation.getMonth() +
							  "/" +
							  record.dateCreation.getFullYear()
							: "-----"
					}`}
				</span>
			),
			align: "center" as AlignType,
		},
	];

	const [drawerIsOpen, setDrawerIsOpen] = useState(!props.filtersCollapsed);

	const openDrawer = () => {
		console.log(drawerIsOpen);
		setDrawerIsOpen(true);
	};

	const closeDrawer = () => {
		setDrawerIsOpen(false);
		if (props.onCollapseFilters) {
			props.onCollapseFilters();
		}
	};

	const MascotasDisplay = (props: { idPropietario: number }) => {
		const [mascotas, setMascotas] = useState<MascotasFromPersonas[]>();

		useEffect(() => {
			const cargarMascotas = async () => {
				try {
					const resultado = await MascotasfromPerson(props.idPropietario);
					setMascotas(resultado);
				} catch (error) {
					console.error("Error al cargar mascotas:", error);
				}
			};
			cargarMascotas();
		}, [props.idPropietario]);

		return (
			<div className="petinfo-container">
				{mascotas?.map((mascota, index) => (
					<p className="petinfo-container__row" key={index}>
						{" "}
						<span className="petinfo">{mascota.nameMascota}</span>{" "}
						<span>{mascota.nameEspecie}</span> <span>{mascota.nameRaza}</span>
						{mascota.dateAppointment.length > 0 ? (
							<span>{t("lastService") + mascota.dateAppointment}</span>
						) : (
							""
						)}
					</p>
				))}
			</div>
		);
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
					<ClientFilter {...props} key={props.filterKey} />
				</Drawer>
				<PageOptions title={t("clientsTitle")} />
				<div className="table-container">
					<div className="table-container__header">
						<Space size="small" className="table-button-bar">
							<Button onClick={openDrawer} className="filter-btn">
								<FontAwesomeIcon icon={faFilter} />
							</Button>
						</Space>
					</div>
					<Table
						className="table__custom-expandable-icon table-clients"
						columns={columns}
						pagination={{
							position: ["bottomCenter"],
							hideOnSinglePage: true,
							showSizeChanger: false,
							pageSize: 10,
						}}
						dataSource={props.Personasinfo}
					/>
				</div>
			</div>
		</>
	);
};

export default ClientesList;

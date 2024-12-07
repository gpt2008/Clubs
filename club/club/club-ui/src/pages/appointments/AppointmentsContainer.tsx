import useMessage from "antd/es/message/useMessage";
import { useEffect, useState } from "react";
import { AppointmentInfo } from "types/entities/Appointment";
import Provider from "types/entities/Provider";
import { GetAppointmentInfo } from "types/operations/Appointment";
import { Rest } from "utils/utils";
import AppointmentsList from "./AppointmentsList";

const AppointmentsContainer = () => {
	const [appointments, setAppointments] = useState<AppointmentInfo[]>([] as AppointmentInfo[]);
	const [providers, setProviders] = useState<Provider[]>([] as Provider[]);
	const [countData, setCountData] = useState(0);
	const [typeStatusState, setTypeStatus] = useState<number | undefined>();
	const [providerIdState, setProviderId] = useState<number | undefined>();
	const [organizationIdState, setOrganizationId] = useState<number | undefined>();

	const [message, messageContext] = useMessage();

	const [page, setPage] = useState(1);

	useEffect(() => {
		loadData();
	}, []);

	const applyFilters = (offset?: number, typeStatus?: number, idOrganization?: number) => {
		filterData(offset, typeStatus, idOrganization);
	};

	const filterData = (offset?: number, typeStatus?: number, idOrganization?: number) => {
		if (offset) {
			setPage(offset);
		} else {
			setPage(0);
		}

		Rest<
			GetAppointmentInfo,
			{ limit: string; offset: string; dataCount: string; data: AppointmentInfo[] }
		>()
			.operation({
				type: "SelectAppointmentsOfOrganizationAndStatus",
				typeStatus: typeStatus ? typeStatus : undefined,
				idOrganization: idOrganization ? idOrganization : undefined,
				limit: 10,
				offset: offset ? (offset - 1) * 10 : 0,
			})
			.then((response) => {
				setAppointments(response.data);
				setCountData(Number(response.dataCount));
			})
			.catch(() => {
				message.error("Error al cargar las citas.");
			});
	};

	const loadData = () => {
		filterData();
		Rest<{ type: string }, Provider[]>()
			.operation({ type: "SelectProviderByName" })
			.then((response) => {
				setProviders(response);
			});
	};

	const filterProviders = (inputValue: string, idOrganization?: number) => {
		if (inputValue != "") {
			Rest<{ type: string; inputValue: string; idOrganization?: number }, any>()
				.operation({
					type: "SelectProviderByName",
					inputValue: inputValue,
					idOrganization: idOrganization,
				})
				.then((response) => {
					setProviders(response);
				});
		}
	};

	return (
		<>
			{messageContext}
			<AppointmentsList
				filterProviders={filterProviders}
				page={page}
				loadAppointmentsData={filterData}
				dataCount={countData}
				appointments={appointments}
				message={message}
				applyFilters={applyFilters}
				providers={providers}
			/>
		</>
	);
};

export default AppointmentsContainer;

import { FormInstance } from "antd";
import ClientList from "components/clientList/ClientList";
import _ from "lodash";
import { useEffect, useState } from "react";
import { Personasinfo } from "types/entities/PersonasInfo";
import { Rest } from "utils/utils";

const ClientesContainer = () => {
	const [personasInfo, setPersonasInfo] = useState<Personasinfo[]>([]);

	const [filtersCollapsed, setFiltersCollapsed] = useState(true);
	const [lastFilter, setLastFilter] = useState<any>();
	const [filterKey, setFilterKey] = useState(new Date().getTime());

	const onCollapseFilters = () => {
		setFiltersCollapsed(!filtersCollapsed);
	};

	const applyFilters = (form: FormInstance) => {
		const values = form.getFieldsValue();
		setLastFilter(values);
		setFiltersCollapsed(true);
	};

	const resetFilters = () => {
		setLastFilter(undefined);
		setFilterKey(new Date().getTime());
	};

	useEffect(() => {
		loadData();
	}, []);

	const loadData = (page?: number) => {
		const filter = {} as any;

		if (lastFilter) {
			filter.namePerson = lastFilter.namePerson ? lastFilter.namePerson : undefined;
			filter.valuePhone = lastFilter.valuePhone ? lastFilter.valuePhone : undefined;
		}

		Rest<{ type: string }, any[]>()
			.operation({
				type: "SelectPatientList",
				...filter,
			})
			.then((response) => {
				for (var i = 0; i < response.length; i++) {
					response[i]["key"] = i;
				}

				response.sort((a, b) => {
					let nameA = a.namePerson.toUpperCase();
					let nameB = b.namePerson.toUpperCase();
					if (nameA < nameB) {
						return -1;
					}
					if (nameA > nameB) {
						return 1;
					}
					return 0;
				});
				setPersonasInfo(response);
			});
	};

	useEffect(() => {
		loadData();
	}, [lastFilter]);

	const searchNamePerson = _.debounce((value: string) => doSearchNamePerson(value), 500);
	const doSearchNamePerson = (value: string) => {
		if (value.length < 3) {
			return;
		}
	};

	const searchPhone = _.debounce((value: string) => doSearchPhone(value), 500);
	const doSearchPhone = (value: string) => {
		if (value.length < 3) {
			return;
		}
	};

	return (
			<ClientList
				onCollapseFilters={onCollapseFilters}
				applyFilters={applyFilters}
				resetFilters={resetFilters}
				searchNamePerson={searchNamePerson}
				searchPhone={searchPhone}
				Personasinfo={personasInfo}
				filtersCollapsed={filtersCollapsed}
				filterKey={filterKey}></ClientList>
	);
};

export default ClientesContainer;

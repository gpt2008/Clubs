import i18n from "i18n/i18n";
import { AlignType } from "rc-table/lib/interface";
import Highlighter from "react-highlight-words";
import LocationsActionTable from "./LocationsActionTable";

export const locationsTableColumns = (
	forceReloadTimestamp: number,
	openLocationForm: (idLocation?: number) => void,
	onClickConfigurationClosingPeriods: (idLocation: number, nameLocation: string) => void,
	highlightFilter?: string
) => {
	return [
		{
			title: i18n.t("locations:nameLocation"),
			dataIndex: "location",
			key: "0",
			render: (_text: string, record: { nameLocation: string; nameOrganization: string,dateUltimoCambioPerfil: Date }) => (
				<>
					<div>
						<strong>{i18n.t("locations:locationLabel")}</strong>
						{highlightFilter ? (
							<Highlighter
								highlightStyle={{ backgroundColor: "#f8d19b", padding: 0 }}
								searchWords={[highlightFilter]}
								autoEscape
								textToHighlight={record.nameLocation}></Highlighter>
						) : (
							record.nameLocation
						)}
					</div>
					<div>
						<strong>{i18n.t("locations:organizationLabel")}</strong>
						{record.nameOrganization}
					</div>
					{record.dateUltimoCambioPerfil && (
					<div>
						<strong>{i18n.t("locations:dateModalUpdateLabel")}</strong>
						{
						record.dateUltimoCambioPerfil.getUTCDate()
							?
							record.dateUltimoCambioPerfil.getUTCDate() +
							  "/" +
							  (record.dateUltimoCambioPerfil.getUTCMonth() + 1).toString().padStart(2, '0') +
							  "/" +
							  record.dateUltimoCambioPerfil.getUTCFullYear().toString()
							: "-----"
						}
					</div>)}
				</>
			),
			align: "left" as AlignType,
		},
		{
			title: i18n.t("locations:address"),
			dataIndex: "address",
			key: "0",
			render: (_text: string, record: { valueAddress: string; nameProvince: string }) => (
				<>
					{record.valueAddress && (
						<div>
							<strong>{i18n.t("locations:addressLabel")}</strong>
							{record.valueAddress}
						</div>
					)}
					{record.nameProvince && (
						<div>
							<strong>{i18n.t("locations:nameProvince")}</strong>
							{record.nameProvince}
						</div>
					)}
				</>
			),
			align: "left" as AlignType,
		},
		{
			title: i18n.t("locations:contactLocation"),
			dataIndex: "contact",
			key: "0",
			render: (_text: string, record: { valuePhone: string; valueEmail: string }) => (
				<>
					{record.valuePhone && (
						<div>
							<strong>{i18n.t("locations:phoneLabel")}</strong>
							{record.valuePhone}
						</div>
					)}
					{record.valueEmail && (
						<div>
							<strong>{i18n.t("locations:emailLabel")}</strong>
							{record.valueEmail}
						</div>
					)}
				</>
			),
			align: "left" as AlignType,
		},
		{
			title: "",
			dataIndex: "action",
			key: "0",
			render: (_text: string, record: { nameLocation: string; idLocation: number }) => (
				<div>
					<LocationsActionTable
						nameLocation={record.nameLocation}
						idLocation={record.idLocation}
						forceReloadTimestamp={forceReloadTimestamp}
						openLocationForm={openLocationForm}
						onClickConfigurationClosingPeriods={onClickConfigurationClosingPeriods}
					/>
				</div>
			),
			align: "center" as AlignType,
		},
	];
};

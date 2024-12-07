import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Select } from "antd";
import { DefaultOptionType } from "antd/es/select";
import cx from "classnames";
import _ from "lodash";
import { CSSProperties, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ProviderNameAndPhoto from "types/entities/Provider";
import { URL } from "../../../utils/rest";

const ProvidersDropDown = (props: {
	idProviderSelected?: number;
	providers?: ProviderNameAndPhoto[];
	forceProviderPhotoReloadKey?: number;
	idOrganization?: number;
	filterProviders: (inputValue: string, idOrganization?: number) => void;
	selectProvider: (idProvider: number | undefined) => void;
	disabled?: boolean;
	style?: CSSProperties;
}) => {
	const { t } = useTranslation(["agendasSchedule"]);
	const [deff, setDefault] = useState<number | undefined>();

	const [drop, setDrop] = useState<DefaultOptionType[]>([]);

	useEffect(() => {
		const updated = props.providers?.map((provider) => ({
			value: provider.idProvider,
			name: provider.value,
			label: (
				<div className="providers-dropdown" key={provider.idProvider}>
					<div className="providers-dropdown-item">
						<div
							className={cx("header--providers-dropdown-selector", {
								selected: props.idProviderSelected === provider.idProvider,
							})}>
							<div
								className={cx("providers-name", {
									selected: props.idProviderSelected === provider.idProvider,
								})}>
								{provider.value}
							</div>
							{provider.hasProviderAvatar ? (
								<div className="img-container loading-img">
									<img
										alt=""
										src={URL + "/file?pa&idProvider=" + provider.idProvider}
										onLoad={(e) => {
											e.currentTarget.parentElement!.classList.remove("loading-img");
											e.currentTarget.parentElement!.style.width = "auto";
										}}
									/>
								</div>
							) : (
								<div className="img-container">
									<div
										className={cx("icon", {
											selected: props.idProviderSelected === provider.idProvider,
										})}>
										<FontAwesomeIcon icon={faUserCircle} />
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			),
		}));
		if (updated) {
			setDrop(updated);
		}
	}, [props.providers, props.idProviderSelected]);

	useEffect(() => {
		if (!props.idProviderSelected) {
			props.selectProvider(undefined);
		}
		setDefault(props.idProviderSelected);
	}, [props.idProviderSelected]);

	useEffect(() => {
		if (deff) {
			props.selectProvider(deff);
		}
	}, [deff]);

	const searchNameProvider = _.debounce((value: string) => {
		props.filterProviders(value, props.idOrganization);
	}, 500);

	return (
		<Select
			size="large"
			style={props.style}
			autoFocus
			options={drop}
			filterOption={false}
			showSearch
			allowClear
			placement="bottomLeft"
			placeholder={t("inputprestador")}
			value={deff}
			//defaultValue={deff}
			//defaultValue={props.idProviderSelected}
			onChange={(idProvider) => {
				props.selectProvider(idProvider);
			}}
			onSearch={(inputValue) => {
				searchNameProvider(inputValue);
			}}
			onClear={() => {
				searchNameProvider(" ");
			}}
			disabled={props.disabled ? props.disabled : false}
		/>
	);
};

export default ProvidersDropDown;

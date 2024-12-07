import { Empty } from "antd";
import DateTitle from "components/dateTitle/DateTitle";
import ProviderCard from "components/providerCard/ProviderCard";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { ProviderStepInfo, SlotStepInfo } from "types/entities/StepsInfo";
import { Rest } from "utils/utils";
import StepsButtons from "../StepsButtons";
import "./ProviderStep.scss";

interface IProps {
	slotStepInfo?: SlotStepInfo;
	currentProvider?: ProviderStepInfo;
	onBackStep?: () => void;
	saveProvider: (provider?: ProviderStepInfo) => void;
	idProvider?: number;
	idLocation?: number;
}

function ProviderStep(props: IProps) {
	const [providers, setProviders] = useState<ProviderStepInfo[]>();
	const [selectedProvider, setSelectedProvider] = useState<ProviderStepInfo>();

	const loadData = () => {
		if (props.slotStepInfo) {
			Rest<
				{
					type: string;
					dateAvailability: Date;
					valueTimeMinutes: number;
					idProvider?: number;
					idLocation?: number;
				},
				ProviderStepInfo[]
			>()
				.operation({
					type: "SelectProvidersByAvailabilty",
					dateAvailability: props.slotStepInfo
						? props.slotStepInfo.dateAvailability
						: dayjs().toDate(),
					valueTimeMinutes: props.slotStepInfo ? props.slotStepInfo.valueTimeMinutes : 0,
					idProvider: props.idProvider,
					idLocation: props.idLocation,
				})
				.then((response) => {
					/*if (response?.length === 1) {
                            props.saveProvider(response.at(0));
                        }*/
					setProviders(response);
				});
		}
	};

	const onSelectProvider = (providerId?: number) => {
		props.saveProvider(providers?.find((prov) => prov.idProvider === providerId));
	};

	useEffect(() => {
		setSelectedProvider(props.currentProvider);
		loadData();
	}, []);

	return (
		<>
			{props.slotStepInfo && (
				<div style={{ padding: "8px" }}>
					<DateTitle
						date={{
							dateAppointment: props.slotStepInfo.dateAvailability,
							valueTimeAppointment: props.slotStepInfo.valueTime,
						}}
					/>
				</div>
			)}
			<div className="provider__cards__container">
				{providers ? (
					providers?.map((provider: ProviderStepInfo) => {
						return (
							<ProviderCard
								key={provider.idProvider}
								providerStepInfo={provider}
								selected={selectedProvider?.idProvider === provider.idProvider}
								onSelectProvider={onSelectProvider}
							/>
						);
					})
				) : (
					<div className="justify-center" style={{ width: "100%" }}>
						<Empty
							image={Empty.PRESENTED_IMAGE_SIMPLE}
							description={<div>No se han encontrado resultados</div>}
						/>
					</div>
				)}
			</div>
			<StepsButtons onBackClicked={props.onBackStep} />
		</>
	);
}

export default ProviderStep;

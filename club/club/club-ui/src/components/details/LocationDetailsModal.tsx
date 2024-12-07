import { APIProvider, AdvancedMarker, Map, Pin } from "@vis.gl/react-google-maps";
import "./LocationDetailsModal.scss"
//import "../providerInfo/providerDetails/ProviderDetailsModal.scss"
import "../providerInfo/providerDetails/ProviderDetails.scss"
import { useEffect, useRef, useState, useTransition } from "react";
import Speciality from "types/entities/Speciality";
import { useTranslation } from "react-i18next";
import { API_KEY, calculateCenter, calculateDistance, calculateZoom } from "utils/map";
import { Button, message, Rate, Tag, Tooltip } from "antd";
import CalendarWidgetContainer from "components/calendar/slots/CalendarWidgetContainer";
import ImageSlider from "components/imageSlider/ImageSlider";
import ProviderInfo from "components/providerInfo/ProviderInfo";
import AppointmentLimit from "components/appointmentLimit/AppointmentLimit";
import img1 from "images/imagenCentro1.jpg";
import img2 from "images/imagenCentro2.jpg";
import img3 from "images/imagenCentro3.jpg";
import img4 from "images/imagenCentro4.jpg";
import { Coordinates, LocationByCoordinates } from "types/entities/Location";
import  ProviderByLocation from "types/entities/Provider";
import { SlotStepInfo } from "types/entities/StepsInfo";
import { Rest } from "utils/utils";
import "./LocationDetailsModal.scss";
import { IState as IStateContainer } from "./LocationDetailsFormContainer";
//import { ColectivoThemeSelector } from "utils/colectivoThemeSelector";

type Service = {
	codeService: string;
};

type PetType = {
	idEspecie: number;
};

type Props = {
	userCoordinates?: Coordinates;
	onNextStep?: (slotStepInfo?: SlotStepInfo) => void;
	visible?: boolean;
	servicesPreview?: any[];
};


const schedule = "L a V: 9:30-13:30 / 16:00-20:30";

function LocationDetailsModal(props: Props  & IStateContainer) {
	const { t } = useTranslation("locationDetails");

	const [providers, setProviders] = useState<ProviderByLocation[]>([]);
	const [languages, setLanguages] = useState<string>();
	const [services, setServices] = useState<Service[]>();
	const [specialities, setSpecialities] = useState<Speciality[]>();
	const [petTypes, setPetTypes] = useState<string>();
	const [selectedSlot, setSelectedSlot] = useState<SlotStepInfo>();
	const [appointmentLimit, setAppointmentLimit] = useState(false);
	const colorPrimary = document.documentElement.style.getPropertyValue("--color-primary");
	const hasShownMessage = useRef(false);

	const onSelectSlot = (slotStepInfo?: SlotStepInfo) => {
		// Limitacion de uso
		if (slotStepInfo) {

			Rest<{ type: string; weekDate: Date }, number>()
				.operation({
					type: "SelectLoggedUserAppointmentCountPerWeek",
					weekDate: slotStepInfo.dateAvailability,
				})
				.then((response) => {
					if (response > 0) {
						setAppointmentLimit(true);
					} else {
						if (props.onNextStep) {
							props.onNextStep(slotStepInfo);
						}
					}
				});
		}
	};

	useEffect(()=> {
		const languages: string[] = [];
		props.servicesPreview?.map((service) => service.codeService.startsWith("Idioma") && languages.push(t(service.codeService)))
		const languageTooltip = languages.join(", ");
		setLanguages(languageTooltip);
		setServices(props.servicesPreview);
	},[props?.servicesPreview])

	const loadProviders = () => {
		Rest<{ type: string; idLocation: number }, ProviderByLocation[]>()
			.operation({
				type: "SelectProviderListByLocation",
				idLocation: props.locationDetails!.idLocation,
			})
			.then((response) => {
				setProviders(response);
			});
	};


	const loadSpecialities = () => {
		Rest<{ type: string; idLocation: number }, Speciality[]>()
			.operation({
				type: "SelectSpecialitiesByLocation",
				idLocation: props.locationDetails!.idLocation,
			})
			.then((response) => {
				setSpecialities(response);
			});
	};

	const loadPetTypes = () => {
		Rest<{ type: string; idLocation: number }, PetType[]>()
			.operation({
				type: "SelectPetTypesByLocation",
				idLocation: props.locationDetails!.idLocation,
			})
			.then((response) => {
				const petTypes: string[] = [];
				response.map((response) => petTypes.push(t("petType:" + response.idEspecie)));
				const uniqueData = Array.from(new Set(petTypes));
				const petTypeTooltip = uniqueData.join(", ");
				setPetTypes(petTypeTooltip);
			});
	};

	useEffect(() => {
		loadProviders();
		loadSpecialities();
		loadPetTypes();

		if(props.visible && hasShownMessage.current == false){
			message.success('Esta es la vista previa del perfil Público con los daton modificados, no son definitivos')
			hasShownMessage.current = true;
		}
	}, []);

	return (
		<>
			<AppointmentLimit
				open={appointmentLimit}
				onCancel={() => setAppointmentLimit(false)}
			/>
			<div className="location__details__modal__container">
				<div style={{fontWeight:'bold'}}className="strong h4 primary justify-center">{t("publicProfile") + props.locationDetails?.nameLocation}</div>
				<div className="location__details__card--double">
					<div className="card-primary location__details__card--single" style={{ width: "50%" }}>
						<div className="location__details__card__title">
							<i className="fa-thin fa-file-lines location__details__card__icon" />
							<div className="p primary">{t("details")}</div>
						</div>
						<Rate allowHalf defaultValue={4.5} style={{ marginBottom: "8px" }} />
						<div className="location__details__card__details">
							<div>
								<i
									className="fa-solid fa-location-dot location__details__card__details__location__dot"
									style={{ marginRight: "4px" }}
								/>
								{props.locationDetails?.valueAddress}
								<br />
								{props.userCoordinates+ " " + props.locationDetails?.nameLocation /*province*/}
							</div>
							<div>
								{props.userCoordinates &&
									props.locationDetails!.valueLat !== 0 &&
									props.locationDetails!.valueLong !== 0 &&
									Math.round(
										calculateDistance(props.userCoordinates, {
											latitude: props.locationDetails!.valueLat,
											longitude: props.locationDetails!.valueLong,
										}) * 100
									) /
										100 +
										" Km"}
							</div>
						</div>
						{props.locationDetails?.valuePhone && (
							<div>
								<i
									className="fa-regular fa-phone"
									style={{ color: colorPrimary, marginRight: "4px" }}
								/>
								<a href={"tel:" + props.locationDetails?.valuePhone} style={{ color: colorPrimary }}>
									{props.locationDetails?.valuePhone}
								</a>
							</div>
						)}
						{props.locationDetails?.valueEmail && (
							<div>
								<i
									className="fa-regular fa-at"
									style={{ color: colorPrimary, marginRight: "4px" }}
								/>
								{props.locationDetails?.valueEmail}
							</div>
						)}
						<div>
							<i
								className="fa-regular fa-clock"
								style={{ color: colorPrimary, marginRight: "4px" }}
							/>
							{schedule}
						</div>
						<div className="location__details__card__details__icons">
							{props.servicesPreview && props.servicesPreview.length > 0 ?
								props.servicesPreview?.filter(service => !service.codeService.toLowerCase().includes("idioma")).map((service) => {
									return (
										<Tooltip key={service.codeService} title={t(service.codeService)}>
											<i className={"fa-regular " + t(service.codeService + "Icon")} />
										</Tooltip>
									);
								})
								:
								services?.map((service) => {
									return (
										<Tooltip key={service.codeService} title={t(service.codeService)}>
											<i className={"fa-regular " + t(service.codeService + "Icon")} />
										</Tooltip>
									);
								})}
							{petTypes && (
								<Tooltip title={petTypes}>
									<i className="fa-regular fa-paw" />
								</Tooltip>
							)}
							{languages && (
								<Tooltip title={languages}>
									<i className="fa-regular fa-language" />
								</Tooltip>
							)}
						</div>
					</div>
					<div className="location__details__card--single" style={{ width: "50%",padding:'0'}}>
						<APIProvider apiKey={API_KEY}>
							<Map
								disableDefaultUI
								gestureHandling={"greedy"}
								defaultZoom={calculateZoom(props.locationDetails ?  [props.locationDetails]: [])}
								defaultCenter={calculateCenter(props.locationDetails ?  [props.locationDetails]: [])}
								mapId={"LOCATION_MAP_" + props.locationDetails?.idLocation}
								className="map">
								<AdvancedMarker
									position={{ lat: props.locationDetails!.valueLat, lng: props.locationDetails!.valueLong}}>
									<Pin
										background={document.documentElement.style.getPropertyValue("--color-primary")}
										glyphColor={"#fff"}
										borderColor={"#fff"}
									/>
								</AdvancedMarker>
							</Map>
						</APIProvider>
					</div>
				</div>

				<div className="location__details__card--double" style={{}}>
					<div className="card-primary" style={{ width: "50%", padding: 0, overflow: "hidden" }}>
						<ImageSlider images={props.imagesLocation || [img1, img2, img3, img4]} interval={5000} />
					</div>
					{specialities && specialities.length > 0 ? (
						<div
							className="card-primary location__details__card--single"
							style={{ width: "50%", height: "fit-content" }}>
							<div className="location__details__card__title">
								<i className="fa-thin fa-stethoscope location__details__card__icon" />
								<div className="p primary">{t("specialities")}</div>
							</div>
							<div className="location__details__card__specialities">
								{specialities.map((speciality) => (
									<Tag className="tag" key={speciality.codeSpeciality}>
										{speciality.nameSpeciality}
									</Tag>
								))}
							</div>
						</div>
					) : (
						<></>
					)}
				</div>

				{providers.length > 0 && (
					<div className="card-primary location__details__card--single">
						<div className="location__details__card__title">
							<i className="fa-thin fa-user-doctor location__details__card__icon" />
							<div className="p primary">{t("providers")}</div>
						</div>
						<div className="location__details__card__providers">
							{providers?.map((provider) => {
								return (
									<div
										key={provider.idProvider}
										className="card-secondary"
										style={{ boxShadow: "none" }}>
										<ProviderInfo
											nameProvider={provider.fullNameProvider}
											providerStepInfo={{
												idProvider: provider.idProvider,
												namePerson: "",
												nameSurname1: "",
												nameSurname2: "",
												namePosition: provider.namePosition,
												hasProviderPhoto: provider.hasProviderPhoto,
												typeProvider: provider.typeProvider,
											}}
										/>
									</div>
								);
							})}
						</div>
					</div>
				)}
					{/*
					<>
						<div className="card-primary location__details__card--schedule">
							<div className="location__details__card__title">
								<i className="fa-thin fa-calendar-days location__details__card__icon" />
								<div className="p primary">{t("schedule")}</div>
							</div>
							<CalendarWidgetContainer
								idLocation={props?.locationDetails?.idLocation}
								currentSlot={selectedSlot}
								selectSlot={onSelectSlot}
							/>
						</div>
					</>
				*/}
			</div>
		</>
	);
}
export default LocationDetailsModal
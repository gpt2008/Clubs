import { Checkbox, message, Rate, Tag } from "antd";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Provider, { ProviderDetails, ProviderModal } from "types/entities/Provider";
import { URL } from "utils/rest";
import { Rest } from "utils/utils";
import ProviderIcon from "./providerIcon/ProviderIcon";

type Props = {
  provider: any;
  providerDataAux?: ProviderDetails;
	visible?: boolean;
  
};

function ProviderDetailsModal(props: Props) {
	const { t } = useTranslation("providerDetails");

	const [providerDetails, setProviderDetails] = useState<ProviderModal>();
	const hasShownMessage = useRef(false);


	useEffect(() => {
		Rest<{ type: string; idProvider: number }, ProviderModal>()
			.operation({ type: "SelectProviderDetailsById", idProvider: props.provider.idProvider })
			.then((response) => {
				setProviderDetails(response);

				if(props.providerDataAux){
					setProviderDetails( (prevDetails: any) => ({
						...prevDetails,
						providerData: props.providerDataAux
					}));
				}
			});

			if(props.visible && hasShownMessage.current == false){
				message.success('Esta es la vista previa del perfil Público con los daton modificados, no son definitivos')
				hasShownMessage.current = true;
			}

	}, []);


	return (
		<>
			<div className="provider__sheet__container">
				<div className="card-primary provider__info">
					<div className="provider__info__avatar">
						{providerDetails?.providerData?.hasProviderPhoto ? (
							<div className="loading-img">
								<img
									alt=""
									src={URL + "/file?pa&idProvider=" + props.provider.idProvider}
									onLoad={(e) => {
										e.currentTarget.parentElement!.classList.remove("loading-img");
										e.currentTarget.parentElement!.style.width = "auto";
									}}
								/>
							</div>
						) : (
                            <ProviderIcon size="large" />
						)}
					</div>
					<div className="provider__info__description neutral">
						<div className="h4 primary" style={{fontSize:'1.75rem'}}>
							{providerDetails?.providerData?.namePerson} {providerDetails?.providerData?.nameSurname1}{" "}
							{providerDetails?.providerData?.nameSurname2}
						</div>
						{/*<Rate allowHalf defaultValue={4.5} disabled /> */}
						<div className="p">
							<strong>{providerDetails?.providerData?.namePosition}</strong>
						</div>
						<div className="p">
							{providerDetails?.providerData?.codeProfessionalCollege ? t("collegeNumber") + providerDetails?.providerData.codeProfessionalCollege : "" }
						</div>
					</div>
				</div>

				{(providerDetails?.providerData?.descEducation || providerDetails?.providerData?.descEducation ) && (
					<div className="card-primary provider__data__card--single">
						<div className="provider__data__card__title">
						<i className="fa-thin fa-user-doctor provider__data__card__icon" />
							<div className="p primary">{t("description")}</div>
						</div>
						<div
							className="p"
							style={{ whiteSpace: "pre", textWrap: "wrap", textAlign: "justify" }}>
							{providerDetails?.providerData.descEducation ? providerDetails?.providerData.descEducation : providerDetails?.providerData.descEducation}
						</div>
					</div>
				)}

				{/*<div className="provider__data__card--double">
					<div className="card-primary--noBorder provider__data__card--single" style={{ width: "50%" }}>
						<div className="provider__data__card__title">
							<i className="fa-thin fa-paw provider__data__card__icon" />
							<div className="p primary">{t("petTypes")}</div>
						</div>
						<div className="provider__data__card__tags__container">
							{props?.provider.species && props.provider.species.length > 0 ? (
								props?.provider.species.map((species) => {
									return (
										<Tag key={species.idEspecie} className="tag">
											{t("petType" + species.idEspecie)}
										</Tag>
									);
								})
							) : (
								<>{t("noData")}</>
							)}
						</div>
					</div>*/}
					
					<div className="card-primary provider__data__card--single" /*style={{ width: "50%" }}*/>
						<div className="provider__data__card__title">
						<i className="fa-thin fa-stethoscope provider__data__card__icon" />
							<div className="p primary">{t("specialities")}</div>
						</div>
						<div className="provider__data__card__tags__container">
							{props?.provider.specialities && props.provider.specialities.length > 0 ? (
								props?.provider.specialities.map((specility: any) => {
									return <Tag className="tag">{specility.nameSpeciality}</Tag>;
								})
							) : (
								<>{t("noData")}</>
							)}
						</div>
					</div>
				{/*</div>*/}

				{providerDetails?.providerData?.descCareer && (
					<div className="card-primary provider__data__card--single">
						<div className="provider__data__card__title">
							<i className="fa-thin fa-graduation-cap provider__data__card__icon" />
							<div className="p primary">{t("formation")}</div>
						</div>
						<div
							className="p"
							style={{ whiteSpace: "pre", textWrap: "wrap", textAlign: "justify" }}>
							{providerDetails?.providerData.descCareer}
						</div>
						{/* <pre
							className="p"
							style={{ whiteSpace: "pre", textWrap: "wrap", textAlign: "justify" }}>
							{provider?.providerData.descEducation}
						</pre> */}
					</div>
				)}

				<div className={props?.provider.languages && props?.provider.languages.length > 0 ? "provider__data__card--double" : ""}>
					<div className="card-primary provider__data__card--single" style={{ width: props?.provider.languages && props?.provider.languages.length > 0 ? "50%" : "" }}>
						<div className="provider__data__card__title">
							<i className="fa fa-video provider__data__card__icon" />
							<div className="p primary">{t("typeOnline")}</div>
						</div>
						{/*<div className="provider__data__card__tags__container">
							<div className="provider__data__card__checkbox-container">
							<Checkbox style={{color: 'black'}} checked={providerDetails?.providerData.typeOnline == 0 ||providerDetails?.providerData.typeOnline == 2 ? true : false} disabled>
								<div style={{color:'black'}}>{t("presencial")}</div>
							</Checkbox> 
							 <Checkbox checked={providerDetails?.providerData.typeOnline == 1 ||providerDetails?.providerData.typeOnline == 2 ? true : false} disabled>
							 	<div style={{color:'black'}}>{t("videoconsulta")}</div>
							</Checkbox></div>
					
						</div>*/}
						 <div className="provider__data__card__checks">
							<div>
								<i
								className={"fa-solid primary " + (providerDetails?.providerData?.typeOnline == 0 ||providerDetails?.providerData?.typeOnline == 2  ? "fa-check" : "fa-x")}
								style={{
									marginRight: providerDetails?.providerData?.typeOnline == 0 ||providerDetails?.providerData?.typeOnline == 2 ? "8px" : "10px",
									marginLeft: providerDetails?.providerData?.typeOnline == 0 ||providerDetails?.providerData?.typeOnline == 2 ? "" : "2px",
									fontSize: providerDetails?.providerData?.typeOnline == 0 ||providerDetails?.providerData?.typeOnline == 2 ? "" : "12px",
								}}
								/>
								{t("presencial")}
							</div>
							<div>
								<i
								className={"fa-solid primary " + (providerDetails?.providerData?.typeOnline == 1 ||providerDetails?.providerData?.typeOnline == 2 ? "fa-check" : "fa-x")}
								style={{
									marginRight: providerDetails?.providerData?.typeOnline == 1 ||providerDetails?.providerData?.typeOnline == 2 ?  "8px" : "10px",
									marginLeft: providerDetails?.providerData?.typeOnline == 1 ||providerDetails?.providerData?.typeOnline == 2 ?  "" : "2px",
									fontSize: providerDetails?.providerData?.typeOnline == 1 ||providerDetails?.providerData?.typeOnline == 2 ?  "" : "12px",
								}}
								/>
								{t("videoconsulta")}
							</div>
						</div>
					</div>
					{props?.provider.languages && props?.provider.languages.length  > 0 && (
					<div className="card-primary provider__data__card--single" style={{ width: "50%" }}>
						<div className="provider__data__card__title">
							<i className="fa-thin fa-language provider__data__card__icon" />
							<div className="p primary">{t("languages")}</div>
						</div>
						<div className="provider__data__card__tags__container">
							{props?.provider.languages && props?.provider.languages.length > 0 ? (
								props?.provider.languages.map((language: any) => {
									return (
										<Tag key={language.codeLanguage} className="tag">
											{t(language.codeLanguage)}
										</Tag>
									);
								})
							) : (
								<>{t("noData")}</>
							)}
						</div>
					</div>)}

				</div>

				<div className="card-primary provider__data__card--single">
					<div className="provider__data__card__title">
						<i className="fa-thin fa-location-dot provider__data__card__icon" />
						<div className="p primary">{t("modality")}</div>
					</div>
					<div>
						{providerDetails?.locations && providerDetails?.locations.length > 0 ? (
							<div className="provider__data__card__locations">
								{providerDetails?.locations.map((location) => (
									<div key={location.nameLocation}>
										<i
											className="fa-solid fa-house-medical primary"
											style={{ marginRight: "8px" }}
										/>
										{location.nameLocation}
									</div>
								))}
							</div>
						) : (
							<div>
								<i className="fa-solid fa-video primary" style={{ marginRight: "8px" }} />
								Videoconsulta
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
}

export default ProviderDetailsModal;

import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Divider, Rate } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ProviderPetLanguageInfo from "types/entities/Provider";
import { URL } from "utils/rest";
import { Rest } from "utils/utils";
import "./ProviderDetails.scss";

type Props = {
	idProvider: number;
};

function ProviderDetails(props: Props) {
	const { t } = useTranslation("providerDetails");

	const [provider, setProvider] = useState<ProviderPetLanguageInfo>();

	useEffect(() => {
		Rest<{ type: string; idProvider: number }, ProviderPetLanguageInfo>()
			.operation({ type: "SelectProviderDetailsById", idProvider: props.idProvider })
			.then((response) => {
				setProvider(response);
			});
	}, []);

	return (
		<>
			<div className="provider__sheet__container">
				<div className="provider__info">
					<div className="provider__info__avatar">
						{provider?.providerData.hasProviderPhoto ? (
							<div className="loading-img">
								<img
									alt=""
									src={URL + "/file?pa&idProvider=" + provider.providerData.idProvider}
									onLoad={(e) => {
										e.currentTarget.parentElement!.classList.remove("loading-img");
										e.currentTarget.parentElement!.style.width = "auto";
									}}
								/>
							</div>
						) : (
							<FontAwesomeIcon icon={faUserCircle} className="icon" />
						)}
					</div>
					<div className="provider__info__description neutral">
						<div className="h4 primary">
							{provider?.providerData.namePerson} {provider?.providerData.nameSurname1}{" "}
							{provider?.providerData.nameSurname2}
						</div>
						<Rate allowHalf defaultValue={4.5} />
						<div className="p">
							<strong>{provider?.providerData.namePosition}</strong>
						</div>
						<div className="p">
							{t("collegeNumber") + provider?.providerData.codeProfessionalCollege}
						</div>
					</div>
				</div>
				{provider?.providerData.descCareer && (
					<>
						<Divider />
						<div className="provider__data__card">
							<i className="fa-thin fa-user-doctor provider__data__card__icon" />
							<div className="p">{provider?.providerData.descCareer}</div>
						</div>
					</>
				)}
				<Divider />
				<div className="provider__data__card">
					<div className="provider__data__card--inner" style={{ width: "50%" }}>
						<i className="fa-thin fa-dog provider__data__card__icon" />
						<div>
							<div className="p primary">{t("petTypes")}</div>
							{provider?.petTypes && provider.petTypes.length > 0 ? (
								provider?.petTypes.map((petType) => {
									return <div key={petType.idEspecie}>{t("petType" + petType.idEspecie)}</div>;
								})
							) : (
								<>Sin datos</>
							)}
						</div>
					</div>
					{provider?.providerData.nameSpeciality && (
						<div className="provider__data__card--inner">
							<i className="fa-thin fa-stethoscope provider__data__card__icon" />
							<div>
								<div className="p primary">{t("specialities")}</div>
								<div>{provider?.providerData.nameSpeciality}</div>
							</div>
						</div>
					)}
				</div>
				{provider?.providerData.descEducation && (
					<>
						<Divider />
						<div className="provider__data__card">
							<i className="fa-thin fa-graduation-cap provider__data__card__icon" />
							<div>
								<div className="p primary">{t("formation")}</div>
								<div className="p">{provider?.providerData.descEducation}</div>
							</div>
						</div>
					</>
				)}
				<Divider />
				<div className="provider__data__card">
					<div className="provider__data__card--inner" style={{ width: "50%" }}>
						<i className="fa-thin fa-video provider__data__card__icon" />
						<div>
							<div className="p primary">{t("modality")}</div>
							<div>Videoconsulta</div>
						</div>
					</div>
					<div className="provider__data__card--inner">
						<i className="fa-thin fa-language provider__data__card__icon" />
						<div>
							<div className="p primary">{t("languages")}</div>
							{provider?.languages && provider.languages.length > 0 ? (
								provider?.languages.map((language) => {
									return <div key={language.codeLanguage}>{t(language.codeLanguage)}</div>;
								})
							) : (
								<>Sin datos</>
							)}
						</div>
					</div>
				</div>
				<Divider />
				<div className="provider__data__card">
					<i className="fa-thin fa-house-medical provider__data__card__icon" />
					<div>
						<div className="p primary">{t("location")}</div>
						<div className="p">Solo servicio de videollamada</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default ProviderDetails;

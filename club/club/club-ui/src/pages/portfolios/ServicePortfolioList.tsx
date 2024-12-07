import { useEffect, useState } from "react";

import { faCameraAlt, faEllipsis, faPen, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Col, Dropdown, Menu, Row } from "antd";
import EmptyCard from "comps/EmptyCard";
import PageOptions from "comps/PageOptions";
import { useTranslation } from "react-i18next";
import { default as Portfolio, default as PortfolioService } from "types/entities/Portfolio";
import { URL } from "utils/rest";
import "./Portfolio.scss";
import { IState as IStateContainer } from "./ServicePortfolioListContainer";

interface IProps {
	openPortfolioForm: (idPortfolioSelected?: number, namePortfolioSelected?: string) => void;
	openPortfolioServiceForm: (
		idPortfolioSelected?: number,
		namePortfolioSelected?: string,
		idPortfolioServiceSelected?: number
	) => void;
}

const ServicePortfolioList = (props: IProps & IStateContainer) => {
	const { t } = useTranslation(["portfolioList"]);

	const [forceReloadTimestamp, setForceReloadTimestamp] = useState<number>(0);

	useEffect(() => {
		if (props.portfolios && props.portfolios.length > 0) {
			setForceReloadTimestamp(new Date().getTime());
		}
	}, [props.portfolios]);

	return (
		<div className="page--container">
			<PageOptions
				title={t("portfolioListTitle")}
				onPlusClicked={props.openPortfolioForm}
				searchFilter={() => {}}
			/>

			<div className="page--wrapper">
				{!props.portfolios || props.portfolios.length === 0 ? (
					<EmptyCard
						searching={!!props.highlightFilter && props.highlightFilter.length > 0}
						description={t("addPortfolio")}
					/>
				) : (
					forceReloadTimestamp > 0 &&
					props.portfolios.map((portfolio) => {
						return (
							<PortfolioCard
								key={portfolio.idPortfolio}
								portfolio={portfolio}
								forceReloadTimestamp={forceReloadTimestamp}
								highlightFilter={props.highlightFilter}
								openPortfolioServiceForm={props.openPortfolioServiceForm}
								onEditPortfolio={props.openPortfolioForm}
							/>
						);
					})
				)}
			</div>
		</div>
	);
};

const PortfolioCard = (props: {
	portfolio: Portfolio;
	forceReloadTimestamp: number;
	highlightFilter?: string;
	openPortfolioServiceForm: (
		idPortfolioSelected?: number,
		namePortfolioSelected?: string,
		idPortfolioServiceSelected?: number
	) => void;
	onEditPortfolio: (idPortfolioSelected?: number, namePortfolioSelected?: string) => void;
}) => {
	const { t } = useTranslation(["portfolioList"]);

	return (
		<Row gutter={[24, 24]}>
			<Col span={24}>
				<div className="portfolio-card__container">
					<Row align="middle" gutter={16}>
						<Col>
							<span className="portfolio-card-title">{props.portfolio.namePortfolio}</span>
						</Col>
						<Col className="page--icon--inner">
							<Button
								type="primary"
								shape="circle"
								className="page--icon"
								onClick={() =>
									props.openPortfolioServiceForm(
										props.portfolio.idPortfolio,
										props.portfolio.namePortfolio
									)
								}>
								<FontAwesomeIcon icon={faPlus} />
							</Button>
						</Col>
						<Col>
							<Button
								type="primary"
								shape="circle"
								onClick={() =>
									props.onEditPortfolio(props.portfolio.idPortfolio, props.portfolio.namePortfolio)
								}>
								<FontAwesomeIcon icon={faPen} />
							</Button>
						</Col>
					</Row>
					<div className="page--elements" style={{ paddingLeft: 0, paddingRight: 0 }}>
						{!props.portfolio.services || props.portfolio.services.length === 0 ? (
							<EmptyCard searching={false} description={t("addService")} isService />
						) : (
							props.portfolio.services.map((service) => {
								return (
									<PortfolioServiceCard
										key={service.idPortfolioService}
										portfolio={props.portfolio}
										service={service}
										forceReloadTimestamp={props.forceReloadTimestamp}
										openPortfolioServiceForm={props.openPortfolioServiceForm}
									/>
								);
							})
						)}
					</div>
				</div>
			</Col>
		</Row>
	);
};

const PortfolioServiceCard = (props: {
	portfolio: Portfolio;
	service: PortfolioService;
	forceReloadTimestamp: number;
	openPortfolioServiceForm: (
		idPortfolioSelected?: number,
		namePortfolioSelected?: string,
		idPortfolioServiceSelected?: number
	) => void;
}) => {
	const { t } = useTranslation(["portfolioList"]);

	const onClick = (value: string) => {
		switch (value) {
			case "1":
				props.openPortfolioServiceForm(
					props.portfolio.idPortfolio,
					props.portfolio.namePortfolio,
					props.service.idPortfolioService
				);
				break;
		}
	};

	const addServicesDropdown = (
		<Menu onClick={(e: any) => onClick(e.key)}>
			<Menu.Item key="1">{t("editServiceButton")}</Menu.Item>
		</Menu>
	);

	return (
		<div className="service-card__container">
			<div className="service-card__info">
				<div className="service-card-photo">
					{props.service.hasServicePhoto ? (
						<div className="loading-img">
							<img
								alt=""
								src={
									URL +
									"/file?psl&idPortfolioService=" +
									props.service.idPortfolioService +
									"&" +
									props.forceReloadTimestamp
								}
								onLoad={(e) => {
									e.currentTarget.parentElement!.classList.remove("loading-img");
									e.currentTarget.parentElement!.style.width = "auto";
								}}
							/>
						</div>
					) : (
						<div className="card-photo-placeholder">
							<FontAwesomeIcon icon={faCameraAlt} />
						</div>
					)}
				</div>
				<div className="service-card-data">
					<span className="service-card-title">{props.service.nameService}</span>
					<span className="service-card-speciality">{props.service.nameSpeciality}</span>
				</div>
			</div>
			<div className="card--three-dots">
				<Dropdown overlay={addServicesDropdown} trigger={["hover"]}>
					<Button type="default" size="middle" shape="circle">
						<FontAwesomeIcon icon={faEllipsis} />
					</Button>
				</Dropdown>
			</div>
		</div>
	);
};

export default ServicePortfolioList;

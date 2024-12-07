import { notification } from "antd";
import ServiceFormContainer from "components/services/ServiceFormContainer";
import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import Portfolio from "types/entities/Portfolio";
import { Rest } from "utils/utils";
import ServicePortfolioFormContainer from "./ServicePortfolioFormContainer";
import View from "./ServicePortfolioList";

export interface IState {
	portfolios?: Portfolio[];
	highlightFilter?: string;
	portfolioFormVisible?: boolean;
	portfolioFormKey?: number;
	portfolioServiceFormVisible?: boolean;
	portfolioServiceFormKey?: number;
	idPortfolioSelected?: number;
	namePortfolioSelected?: string;
	idPortfolioServiceSelected?: number;
}

class ServicePortfolioListContainer extends React.Component<WithTranslation, IState> {
	public state: IState = {};

	public componentDidMount() {
		this.loadData();
	}

	public render() {
		return (
			<>
				<View
					{...this.state}
					openPortfolioForm={this.openPortfolioForm}
					openPortfolioServiceForm={this.openServiceForm}
				/>

				<ServicePortfolioFormContainer
					visible={this.state.portfolioFormVisible}
					key={this.state.portfolioFormKey}
					idPortfolio={this.state.idPortfolioSelected}
					namePortfolio={this.state.namePortfolioSelected}
					onClose={this.closePortfolioForm}
				/>

				<ServiceFormContainer
					visible={this.state.portfolioServiceFormVisible}
					key={this.state.portfolioServiceFormKey}
					idPortfolio={this.state.idPortfolioSelected!}
					namePortfolio={this.state.namePortfolioSelected!}
					idPortfolioService={this.state.idPortfolioServiceSelected}
					onClose={this.closeServiceForm}
				/>
			</>
		);
	}

	private loadData = () => {
		Rest<{ type: string }, any>()
			.operation({
				type: "GetPortfoliosAndServices",
			})
			.then((response) => {
				this.setState({ portfolios: response });
			});
	};

	private openPortfolioForm = (idPortfolioSelected?: number, namePortfolioSelected?: string) => {
		this.setState({
			portfolioFormVisible: true,
			portfolioFormKey: new Date().getTime(),
			idPortfolioSelected,
			namePortfolioSelected,
		});
	};

	private closePortfolioForm = (save: boolean) => {
		this.setState(
			{
				portfolioFormVisible: false,
				idPortfolioSelected: undefined,
				namePortfolioSelected: undefined,
			},
			() => {
				if (save) {
					notification["success"]({
						message: this.props.t("titles:actionPerformed"),
					});
					this.loadData();
				}
			}
		);
	};

	private openServiceForm = (
		idPortfolioSelected?: number,
		namePortfolioSelected?: string,
		idPortfolioServiceSelected?: number
	) => {
		this.setState({
			portfolioServiceFormVisible: true,
			portfolioServiceFormKey: new Date().getTime(),
			idPortfolioSelected,
			namePortfolioSelected,
			idPortfolioServiceSelected,
		});
	};

	private closeServiceForm = (save: boolean) => {
		this.setState(
			{
				portfolioServiceFormVisible: false,
				idPortfolioSelected: undefined,
				namePortfolioSelected: undefined,
				idPortfolioServiceSelected: undefined,
			},
			() => {
				if (save) {
					notification["success"]({
						message: this.props.t("titles:actionPerformed"),
					});
					this.loadData();
				}
			}
		);
	};
}

export default withTranslation("portfolioList")(ServicePortfolioListContainer);

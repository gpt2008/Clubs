import { FormInstance } from "antd";
import { Store } from "antd/lib/form/interface";
import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import Portfolio from "types/entities/Portfolio";
import { Rest } from "utils/utils";
import View from "./ServicePortfolioForm";

interface IProps {
	visible?: boolean;
	idPortfolio?: number;
	namePortfolio?: string;
	onClose: (save: boolean, idPortfolio?: number, namePortfolio?: string) => void;
}

export interface IState {
	portfolio?: Portfolio;
	loaded?: boolean;
}

class ServicePortfolioFormContainer extends React.Component<WithTranslation & IProps, IState> {
	public state: IState = {};

	public componentDidMount() {
		if (this.props.idPortfolio) {
			this.loadData();
		} else {
			this.setState({ loaded: true });
		}
	}

	public render() {
		return this.state.loaded ? (
			<View
				{...this.state}
				visible={this.props.visible}
				namePortfolio={this.props.namePortfolio}
				onCancel={() => this.props.onClose(false)}
				onSubmit={this.validateAndSave}
			/>
		) : (
			<></>
		);
	}

	private loadData = () => {
		Rest<{ type: string; id: number }, Portfolio>()
			.operation({
				type: "SelectServicePortfolioById",
				id: this.props.idPortfolio!,
			})
			.then((response) => {
				this.setState({ portfolio: response, loaded: true });
			});
	};

	private validateAndSave = (form: FormInstance) => {
		form.validateFields().then((values) => {
			this.save(values);
		});
	};

	private save = (values: Store) => {
		Rest<
			{
				type: string;
				idPortfolio?: number;
				namePortfolio: string;
				descPortfolio: string;
			},
			any
		>()
			.operation({
				type: this.props.idPortfolio ? "EditPortfolio" : "NewPortfolio",
				idPortfolio: this.props.idPortfolio,
				namePortfolio: values.namePortfolio,
				descPortfolio: values.descPortfolio,
			})
			.then((response) => this.props.onClose(true));
	};
}

export default withTranslation("portfolioForm")(ServicePortfolioFormContainer);

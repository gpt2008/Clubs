import React from "react";

import { WithTranslation, withTranslation } from "react-i18next";
import AppHeader from "./AppHeader";
import { HomeInfo } from "./MainLayout";

export interface IProps {
	homeInfo?: HomeInfo;
}

class AppContent extends React.Component<IProps & WithTranslation> {
	private t = this.props.t;

	public render() {
		return <AppHeader homeInfo={this.props.homeInfo} />;
	}
}

export default withTranslation()(AppContent);

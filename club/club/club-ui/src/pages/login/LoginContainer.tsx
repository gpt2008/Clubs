import React from "react";

import { WithTranslation, withTranslation } from "react-i18next";
import router from "router";
import { agendas } from "utils/router-utils";
import { UserInfo } from "utils/utils";
import View from "./Login";

export interface IState {
	loading: boolean;
}

class LoginContainer extends React.Component<WithTranslation, IState> {
	public componentDidMount() {
		if (UserInfo.isPresent()) {
			router.navigate(agendas);
			//this.props.history.push("/app");
		}
	}

	public render() {
		return (
			<>
				<View />
			</>
		);
	}
}

export default withTranslation("login")(LoginContainer);

import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { OrganizationResume } from "types/entities/Organization";
import View from "./Home";

interface IProps {
	organizationResume: OrganizationResume;
	patientReservationUrl: string;
	onPageClicked: (key: number) => void;
}

class HomeContainer extends React.Component<IProps & WithTranslation> {
	public render() {
		return (
			<View
				organizationResume={this.props.organizationResume}
				patientReservationUrl={this.props.patientReservationUrl}
				onPageClicked={this.props.onPageClicked}
			/>
		);
	}
}

export default withTranslation("home")(HomeContainer);

import React from "react";

import { WithTranslation, withTranslation } from "react-i18next";
import { Rest } from "utils/utils";
import View from "./ScheduleActionsForm";

interface IProps {
	visible?: boolean;
	nameProvider: string;
	idSchedule?: number;
	nameSchedule?: string;
	activate?: boolean;
	drop?: boolean;
	onClose: (save: boolean) => void;
}

class ScheduleActionsFormContainer extends React.Component<WithTranslation & IProps> {
	public render() {
		return (
			<View {...this.props} onCancel={() => this.props.onClose(false)} save={this.saveAction} />
		);
	}

	private saveAction = () => {
		Rest<{ type: string; idSchedule: number; activate?: boolean }, any>()
			.operation({
				type: this.props.drop ? "DeleteSchedule" : "ChangeScheduleStatus",
				idSchedule: this.props.idSchedule!,
				activate: !this.props.drop && this.props.activate,
			})
			.then((response) => {
				this.props.onClose(true);
			});
	};
}

export default withTranslation("scheduleManagement")(ScheduleActionsFormContainer);

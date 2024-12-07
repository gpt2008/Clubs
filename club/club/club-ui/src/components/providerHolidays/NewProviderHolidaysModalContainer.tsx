import React from "react";

import { FormInstance } from "antd";
import { Store } from "antd/lib/form/interface";
import { WithTranslation, withTranslation } from "react-i18next";
import enumClosingPeriodDateType from "types/enums/EnumClosingPeriodDateType";
import FormErrorField from "utils/form/formErrorField";
import { Rest } from "utils/utils";
import View from "./NewProviderHolidaysModal";

interface IProps {
	idProvider: number;
	visible?: boolean;
	onClose: (saved: boolean) => void;
}

export interface IState {
	errorFields: FormErrorField[];
}

class NewProviderHolidaysModalContainer extends React.Component<WithTranslation & IProps, IState> {
	public state: IState = {
		errorFields: [],
	};

	public render() {
		return (
			<View
				{...this.state}
				visible={this.props.visible}
				onClose={this.props.onClose}
				onSubmit={this.validateAndSave}
			/>
		);
	}

	private validateAndSave = (form: FormInstance) => {
		form.validateFields().then((values) => this.saveNewHolidayPeriod(values));
	};

	private saveNewHolidayPeriod = (values: Store) => {
		const dateFrom = values.dateFrom;
		const dateTo =
			values.periodType === enumClosingPeriodDateType.ONE_DAY ? values.dateFrom : values.dateTo;

		if (dateFrom.isAfter(dateTo)) {
			const dateError = { fieldName: "dateFrom" };

			this.setState({ errorFields: [dateError] });
			return;
		}

		Rest<
			{
				type: string;
				idProvider: number;
				nameHoliday: string;
				dateFrom: Date;
				dateTo: Date;
			},
			any
		>()
			.operation({
				type: "SaveProviderHolidayPeriod",
				idProvider: this.props.idProvider,
				nameHoliday: values.nameHoliday,
				dateFrom,
				dateTo,
			})
			.then(() => this.props.onClose(true));
	};
}

export default withTranslation("providerHolidayForm")(NewProviderHolidaysModalContainer);

import React from "react";

import { FormInstance } from "antd/es/form/Form";
import { Store } from "antd/lib/form/interface";
import { WithTranslation, withTranslation } from "react-i18next";
import FormErrorField from "utils/form/formErrorField";
import { Rest } from "utils/utils";
import View from "./InvoiceExportModal";
import { URL } from "utils/rest";

interface IProps {
	visible?: boolean;
	dateFrom?: Date;
	dateTo?: Date;
	onClose: (save: boolean) => void;
}
export interface IState {
    errorFields: FormErrorField[];
	loaded?: boolean;
	dateFromS?: string;
	dateToS?: string;
}

class InvoiceExportModalContainer extends React.Component<WithTranslation & IProps> {
	public state: IState = {
        loaded: false,
		errorFields: [],
	};

	public componentDidMount() {
		this.setState({
            loaded: true,
        });
	};
	
	public render() {
		return this.state.loaded ? (
			<View
				visible={this.props.visible}
				dateFrom={this.props.dateFrom}
				dateTo={this.props.dateTo}
				onCancel={() => this.props.onClose(false)}
				onSubmit={this.validateAndSave}
				onChangeDateFrom={this.onChangeDateFrom}
				onChangeDateTo={this.onChangeDateTo}
			/>
		) : (
			<></>
		);
	};

	private validateAndSave = (form: FormInstance) => {
		form
			.validateFields()
			.then((values) => {
				this.internalValidation(values, true);
			})
			.catch((info) => {
				this.internalValidation(info.values, false);
			});
	};

	private internalValidation = (values: Store, formValidationSucceded: boolean) => {
		this.validate(values)?.then((errors) => {
			if (formValidationSucceded && (!errors || errors.length === 0)) {
				this.loadPDF(values);
			} else {
				this.setState({ errorFields: errors });
			}
		});
	};

	private validate = (values: Store) => {
		return new Promise((resolve: (f: FormErrorField[]) => void) => {
			let errors: FormErrorField[] = [];

			resolve(errors);
		});
	};

	private loadPDF = (values: Store) => {
		let url = URL + "/file?bif&dateFrom=" +  this.state.dateFromS + "&dateTo=" + this.state.dateToS;
        const link = document.createElement("a");
        link.href = url;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
	};

	private onChangeDateFrom = (dateFrom: string)=> {
		this.setState({
			dateFromS: dateFrom
		})
	}

	private onChangeDateTo = (dateTo: string)=> {
		this.setState({
			dateToS: dateTo
		})
	}
}

export default withTranslation("invoiceList")(InvoiceExportModalContainer);

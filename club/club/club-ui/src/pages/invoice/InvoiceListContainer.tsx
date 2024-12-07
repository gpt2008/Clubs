import _ from "lodash";
import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { Rest } from "utils/utils";
import UTILS from "../../utils/tableUtils"
import View from "./InvoiceList";
import InvoiceDetails, { FileInvoice } from "types/entities/Invoice";
import InvoiceExportModalContainer from "./InvoiceExportModalContainer";
import { URL } from "utils/rest";
import { notification } from "antd";

export interface IState {
	invoice?: InvoiceDetails[];
	loaded?: boolean;
	forceReloadTimestamp?: number;
	highlightfilter?: string;
    countData?: number;
	page?: number;
    limit?: number;
	exportKey?: number;
	exportVisible?: boolean;
	dateFrom?: Date;
	dateTo?: Date;
}

class InvoiceListContainer extends React.Component<WithTranslation, IState> {
    public state: IState = {};

    public componentDidMount() {
		this.loadData();
	}

    public render() {
        return (
            <>
                <View
					invoice={this.state.invoice}
					limit = {this.state.limit ? this.state.limit : 1}
					highlightfilter={this.state.highlightfilter}
					countData={this.state.countData ? this.state.countData : 0}
					page={this.state.page ? this.state.page : 1}
					loadActsData={this.loadData}
                    onClickDownload={this.handleDownloadInvoice}
					onClickRefund={this.onClickRefund}
					openExportModal={this.openExportModal}
				/>

				<InvoiceExportModalContainer
					key={this.state.exportKey}
					visible={this.state.exportVisible}
					dateFrom={this.state.dateFrom}
					dateTo={this.state.dateTo}
					onClose={this.onCloseExport}
				/>
            </>
        )
    };

    private loadData = (offset?: number, nif?: string, nameClient?: string) => {
		if (offset) this.setState({page: offset});
		let limit = UTILS.calculatePageSizeForMainTableOther().limit;
		Rest<{ type: string, offset?:number, limit: number, nif?:string, nameClient?: string},
         {limit:number, offset:string, dataCount:string, data: InvoiceDetails[]}>()
			.operation({
				type: "GetInvoiceDetails",
				limit: limit,
				offset: offset ? (offset - 1) * limit : 0,
				nif: nif,
				nameClient: nameClient,
			})
			.then((response) => {
				this.setState({ invoice: response.data, countData: Number(response.dataCount), limit: response.limit});
			});
	};

	private onClickRefund = (order:string) => {
        Rest<{ type: string, order:string},
		{result:string, response:any, errorCode: string}>()
			.operation({
				type: "RefundRedSysPayment",
                order: order
			})
			.then((response) => {
                if (response.response){
					notification["success"]({
                    	message: this.props.t("titles:actionPerformed"),
                    });
					this.loadData(this.state.page);
                }
				else{
					notification["error"]({
                        message: this.props.t("titles:actionNotPerformed") + " Error: " +response.errorCode,
                    });
				}
			});
    };

	private handleDownloadInvoice = (idInvoice?: number) => {
	
		const fileUrl = URL + "/file?inv&idInvoice=" + idInvoice;
	
		if (fileUrl) {
		  fetch(fileUrl)
			.then((response) => {
			 	if (response.ok) {
				return response.blob();
			  }
			})
			.then((blob) => {
			  if (blob) {
				const url = window.URL.createObjectURL(blob);
				const a = document.createElement("a");
				a.style.display = "none";
				a.href = url;
				a.download = idInvoice + ".pdf";
				document.body.appendChild(a);
				a.click();
				window.URL.revokeObjectURL(url);
			  }
			})
			.catch((error) => {
			  console.error("An error occurred during the download:", error);
			});
		}
	};

	private openExportModal = () => {
		this.setState({
			exportVisible: true,
			exportKey: new Date().getTime(),
		});
	};

	private onCloseExport = (save: boolean) => {
		this.setState(
			{
				exportVisible: false,
			}
		);
	};

}

export default withTranslation("invoiceList")(InvoiceListContainer);
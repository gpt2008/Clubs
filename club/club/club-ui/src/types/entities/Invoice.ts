

export default interface InvoiceDetails {
    idInvoice: number;
	codeInvoice: string;
	typeInvoice: number;
	dni: string;
	nameClient: string;
    expeditionDate: Date;
    totalAmount: number;
	order: string;
	reembolsado: number;
}

export interface FileInvoice {
	nameFile: string;
	type: string;
    blobFile: any;
}
export default interface PortfolioService {
	idPortfolioService: number;
	nameService: string;
	codeSpeciality: string;
	nameSpeciality: string;
	valueDuration: number;
	amtPrice: number;
	flagAllowOnlineRes: boolean;
	flagAllowOnlineVid: boolean;
	flagShowPrice: boolean;
	flagAllowPriorPayment: boolean;
	dateCreation: Date;
	hasServicePhoto: boolean;
}

export default interface Portfolio {
	idPortfolio: number;

	namePortfolio: string;

	services?: PortfolioService[];
}

export default interface SavePortfolioService {
    type: string;

    idPortfolio?: number;

    idPortfolioService?: number;

    speciality?: string;

    nameService: string;

    valueDuration: number;

    amtPrice?: number;

    flagAllowOnlineRes: number;

    flagAllowOnlineVid: number;

    flagShowPrice: number;
    
    flagAllowPriorPayment: number;

    base64ImageService?: any;

    hasServicePhoto: boolean;        
}
export interface CardInfo {
    company: string,
    treatment: string,
    name: string,
    surname1: string,
    surname2: string,
    cardNumber: string,
    productName: string
}

export interface CardInfoOperation extends CardInfo {
    type: string
}
export interface OrganizationResume {
    patients: number;
    agendasAndStaff: number;
    locations: number;
    services: number;
    users: number;
    reports: number;
    billing: number;
    pdfCards: number;
}

export default interface Organization {
    idOrganization: number;
    nameOrganization: string;
    blobLogo: string;
}
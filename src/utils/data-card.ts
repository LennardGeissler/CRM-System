export type Status = 'Qualified Lead' | 'Contact Made' | 'Offer Made' | 'In Development' | 'Negotiation Started';

export type Customer = {
    KundenID: string,
    Kundenname: string,
    Unternehmen: string,
    Wert: number,
    Status: Status,
}

export const statuses: Status[] = ['Qualified Lead', 'Contact Made', 'In Development', 'Offer Made', 'Negotiation Started'];
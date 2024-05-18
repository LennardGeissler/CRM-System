export type Status = 'Qualified Lead' | 'Contact Made' | 'Offer Made' | 'In Development' | 'Negotiation Started';

export type Customer = {
    id: string,
    person: string,
    company: string,
    money: number,
    status: Status,
}

export const statuses: Status[] = ['Qualified Lead', 'Contact Made', 'In Development', 'Offer Made', 'Negotiation Started'];
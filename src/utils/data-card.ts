export type Status = 'Qualifizierter Lead' | 'Kontakt aufgenommen' | 'Angebot gemacht' | 'In Entwicklung' | 'In Verhandlung';

export type Customer = {
    KundenID: string,
    Kundenname: string,
    Unternehmen: string,
    Wert: number,
    Status: Status,
}

export const statuses: Status[] = ['Qualifizierter Lead', 'Kontakt aufgenommen', 'Angebot gemacht', 'In Entwicklung', 'In Verhandlung'];
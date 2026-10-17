export class TerminoCondicionEntity {
    id: string;
    title: string;
    content: string;
    order: number;
    isActive: boolean;
    version: string;
    createdAt?: Date;
    updatedAt?: Date;
}

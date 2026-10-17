// src/modules/auth/domain/TermItem.ts

export interface TermItem {
    id: string | number;
    title: string;
    content: string;
    order?: number;
    isActive?: boolean;
}

export interface TermsRepository {
    getTerms(): Promise<TermItem[]>;
}

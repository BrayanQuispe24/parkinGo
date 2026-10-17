export interface User {
    id?: string;
    email: string;
    role: string;
    roleId?: string;
    firstName?: string;
    lastName?: string;
    fullname?: string;
    estado?: string;
    sexo?: string;
    gender?: string;
    birthdate?: string;
    birthDate?: string;
    ci?: string;
    phone?: string;
    token?: string;
    createdAt?: string;
    isLoggedIn?: boolean;
    acceptedTerms?: boolean;
    termsAccepted?: boolean;
    isVerified?: boolean;
    requiresVerification?: boolean;
    status?: string;
    requiresDocumentReview?: boolean;
    document?: File;
}


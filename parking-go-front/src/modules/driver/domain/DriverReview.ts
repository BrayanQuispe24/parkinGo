// src/modules/driver/domain/DriverReview.ts

export interface DriverReview {
    id: string;
    parkingName: string;
    driverName: string;
    rating: number; // 1 a 5
    comment: string;
    date: string;
    verifiedStay: boolean;
}

export interface CreateReviewPayload {
    parkingName: string;
    rating: number;
    comment: string;
}

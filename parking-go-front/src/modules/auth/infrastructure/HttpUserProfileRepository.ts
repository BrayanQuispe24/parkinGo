// src/modules/auth/infrastructure/HttpUserProfileRepository.ts
import { parkingoApi } from '../../../core/api/parkingoApi';
import type { UpdateUserProfilePayload } from '../domain/UserProfile';

export class HttpUserProfileRepository {
    async updateUserProfile(userId: string, payload: UpdateUserProfilePayload): Promise<void> {
        await parkingoApi.patch(`/usuarios/${userId}`, payload);
    }
}

export const userProfileRepository = new HttpUserProfileRepository();

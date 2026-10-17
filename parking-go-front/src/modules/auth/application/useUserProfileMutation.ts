// src/modules/auth/application/useUserProfileMutation.ts
import { useMutation } from '@tanstack/react-query';
import { userProfileRepository } from '../infrastructure/HttpUserProfileRepository';
import type { UpdateUserProfilePayload } from '../domain/UserProfile';

export const useUpdateUserProfileMutation = () => {
    return useMutation({
        mutationFn: ({ userId, payload }: { userId: string; payload: UpdateUserProfilePayload }) =>
            userProfileRepository.updateUserProfile(userId, payload),
    });
};

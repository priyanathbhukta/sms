import api from './axios';
import { logger } from '../utils/constants';

export const profileApi = {
    uploadImage: async (file) => {
        logger.info('Uploading profile image');
        const formData = new FormData();
        formData.append('image', file);

        const response = await api.post('/api/profile/image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
};

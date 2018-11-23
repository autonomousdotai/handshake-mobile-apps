import { APIPostCreator } from '@/guru/stores/api';
import { API_URL } from '@/constants';

/* Common Actions */
export const updateLoading = (payload = {}) => {
  return {
    type: 'GURU:UPDATE_LOADING',
    payload
  };
};

export const userHabit = APIPostCreator({
  type: 'API:DETAIL_HABIT',
  url: API_URL.CRYPTOSIGN.USER_HABIT
});

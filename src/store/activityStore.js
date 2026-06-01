import { create } from 'zustand';
import api from '../services/api';

const useActivityStore = create((set) => ({
  activities: [],
  loading: false,

  fetchActivities: async (limit = 30) => {
    set({ loading: true });
    try {
      const { data } = await api.get(`/activity?limit=${limit}`);
      set({ activities: data.activities || [], loading: false });
      return data.activities || [];
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  }
}));

export default useActivityStore;

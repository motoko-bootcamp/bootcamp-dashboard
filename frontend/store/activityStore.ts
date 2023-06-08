import {create} from 'zustand';
import { persist } from 'zustand/middleware';
import { Activity } from '../types/types';
import { getActivityFeed } from '../services/actorService';



export interface ActivityStore {
  activities: Activity[] | undefined;
  getActivityError: string | undefined;
  getActivityFeed: () => Promise<Activity[] | undefined>;
}

const createActivityStore = (
  set: (state: Partial<ActivityStore>) => void,
  get: () => ActivityStore
): ActivityStore => ({
  activities: undefined,
  getActivityError: undefined,
  getActivityFeed: async (): Promise<Activity[] | undefined> => {
    try {
    const fetchedActivities: Activity[] = await getActivityFeed();
      set({ activities: fetchedActivities });
      return fetchedActivities;
    } catch (error) {
      // Handle the error and update the state with the error message
      const errorMessage = 'Error fetching activities';
      set({ getActivityError: errorMessage });
      return undefined;
    }
  },
});

export const useActivityStore = create<ActivityStore> ()(
  persist(
    (set, get) => createActivityStore(set, get) as any,
    {
      name: 'activityStore',
      getStorage: () => sessionStorage,
    }
  )
);

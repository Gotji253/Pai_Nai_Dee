// src/services/planService.ts
import { Location } from '../data/mockData'; // Assuming Location objects are what we save

const LOCAL_STORAGE_KEY = 'travelPlan';

export interface TravelPlan {
  id: string; // A unique ID for the plan
  name: string; // User-defined name for the plan
  locations: Location[];
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

/**
 * Saves a travel plan to localStorage.
 * For simplicity, this mock service saves only one plan.
 * A more advanced version would manage multiple plans.
 */
export const savePlanToLocalStorage = (plan: TravelPlan): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(plan));
      console.log('Plan saved to localStorage:', plan);
      resolve();
    } catch (error) {
      console.error('Failed to save plan to localStorage:', error);
      reject(error);
    }
  });
};

/**
 * Loads a travel plan from localStorage.
 */
export const loadPlanFromLocalStorage = (): Promise<TravelPlan | null> => {
  return new Promise((resolve) => {
    try {
      const savedPlanJson = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedPlanJson) {
        const plan = JSON.parse(savedPlanJson) as TravelPlan;
        console.log('Plan loaded from localStorage:', plan);
        resolve(plan);
      } else {
        console.log('No plan found in localStorage.');
        resolve(null);
      }
    } catch (error) {
      console.error('Failed to load plan from localStorage:', error);
      resolve(null); // Resolve with null on error to avoid breaking app
    }
  });
};

/**
 * Deletes the travel plan from localStorage.
 */
export const deletePlanFromLocalStorage = (): Promise<void> => {
  return new Promise((resolve) => {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      console.log('Plan deleted from localStorage.');
      resolve();
    } catch (error) {
      console.error('Failed to delete plan from localStorage:', error);
      // Still resolve, as the item might be gone or inaccessible
      resolve();
    }
  });
};

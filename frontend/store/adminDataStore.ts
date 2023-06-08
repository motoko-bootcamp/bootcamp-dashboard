import { DailyTotalMetrics, Result, Result_1, Result_2, Result_4, Result_5, Result_6, Result_7 } from 'src/declarations/Verifier/Verifier.did';
import {create} from 'zustand';
import { persist } from 'zustand/middleware';
import { getVerifierActor } from '../services/actorService';
import { toastError, toast, ToastType, toastPromise } from '../services/toastService';




export interface AdminDataStore {
    getTotalStudents: () => Promise<string>;
    getTotalTeams: () => Promise<string>;
    getTotalProjectsCompleted: () => Promise<string>;
    adminCreateTeam: (teamName: string, isSpanish: boolean) => Promise<Result_7>;
    registerAdmin: (principalId: string) => Promise<Result>;
    adminManuallyVerifyStudentDay:(day: bigint, principalId: string) => Promise<Result_1>;
    getTotalCompletedPerDay: () => Promise<DailyTotalMetrics>;
    adminGrantsBonusPoints: (principalId: string, description: string) => Promise<Result>;
    getStudentPrincipalByName: (name: string) => Promise<Result_4>;
    adminAnnounceTimedEvent: (message: string) => Promise<void>;
    
    totalTeams: string;
    totalStudents: string;
    totalProjectsCompleted: string;
  
    totalCompletedPerDay: DailyTotalMetrics;
    nameToPrincipalId : string;
  
}

const createAdminDataStore = (
  set: (state: Partial<AdminDataStore>) => void,
  get: () => AdminDataStore
): AdminDataStore => ({
    totalStudents: "0",
    totalTeams: "0",
    totalProjectsCompleted: "0",
    totalCompletedPerDay: {day1: "0", day2: "0", day3: "0", day4: "0", day5: "0"},
    nameToPrincipalId: "0",
    
    

  


    adminAnnounceTimedEvent: async (message: string): Promise<void> => {
        const resultPromise = (await getVerifierActor()).adminAnnounceTimedEvent(message);

        await toastPromise(resultPromise, {

            loading: 'Announcing timed event...',
            success: 'Timed event announced!',
            error: 'Error announcing timed event.',
        }, ToastType.Success);
    },
    
    
    adminGrantsBonusPoints: async (principalId: string, description: string): Promise<Result> => {
        const resultPromise = (await getVerifierActor()).adminGrantBonusPoints(principalId, description);

        await toastPromise(resultPromise, {

            loading: 'Granting bonus points...',
            success: 'Bonus points granted!',
            error: 'Error granting bonus points.',
        }, ToastType.Success);

        const result = await resultPromise;

        if ('err' in result) {

            const errorString = JSON.stringify(result.err);
            console.error(errorString);
            toastError(errorString);
        } else {

            console.log("adminGrantBonusPoints", result);
        }

        return result;
    },

    getStudentPrincipalByName : async (name: string): Promise<Result_4> => {
   
        const resultPromise = (await getVerifierActor()).getStudentPrincipalByName(name);

       
        await toastPromise(resultPromise, {
            loading: 'Getting student principal...',
            success: 'Student principal found!',
            error: 'Error getting student principal.',
        }, ToastType.Success);

     
        const result = await resultPromise;

        if ('err' in result) {
            const errorString = JSON.stringify(result.err);
            console.error(errorString);
            toastError(errorString);
        } else {
            
            set({ nameToPrincipalId: result.ok });
            return result;
        }

        return result;
    },

    getTotalCompletedPerDay: async (): Promise<DailyTotalMetrics> => {
        const result = await (await getVerifierActor()).getTotalCompletedPerDay();
        console.log("getTotalCompletedPerDay", result)
        if ('err' in result) {
            console.error(result.err);
            } else {
                set({ totalCompletedPerDay: result });
            }
            return result;
    },


    adminManuallyVerifyStudentDay: async (day: bigint, principalId: string): Promise<Result_1> => {
      const resultPromise = (await getVerifierActor()).adminManuallyVerifyStudentDay(day, principalId);
    
      await toastPromise(resultPromise, {
        loading: 'Verifying day...',
        success: 'Day Verified!',
        error: 'Error verifying day.',
      }, ToastType.Success);
    
      const result = await resultPromise;
    
      if ('err' in result) {
        const errorString = JSON.stringify(result.err);
        console.error(errorString);
        toastError(errorString);
      } else {
        console.log("adminManuallyVerifyStudentDay", result);
      }
      return result;
    },
    
    
   

   
   
      registerAdmin: async (principalId: string): Promise<Result> => {
        const resultPromise = (await getVerifierActor()).registerAdmin(principalId);
        await toastPromise(resultPromise, {
          loading: 'Registering admin...',
          success: 'Help is on the way! Admin Registered.',
          error: 'Error registering admin.',
        }, ToastType.Success);
        const result = await resultPromise;
        console.log("registerAdmin", result);
        return result;
      },
      adminCreateTeam: async (teamName: string, isSpanish: boolean): Promise<Result_7> => {
        const resultPromise = (await getVerifierActor()).adminCreateTeam(teamName, isSpanish);
        await toastPromise(resultPromise, {
          loading: 'Creating team...',
          success: 'Team Created!',
          error: 'Error creating team.',
        }, ToastType.Success);
        const result = await resultPromise;
        console.log("adminCreateTeam", result);
        
        return result;
      },


    getTotalStudents: async (): Promise<string> => {
        const result = await (await getVerifierActor()).getTotalStudents();
        console.log("totalStudents", result)
        
            set({
                totalStudents: result,
            });
            return result;
       
    },

    getTotalTeams: async (): Promise<string> => {
        const result = await (await getVerifierActor()).getTotalTeams();
        console.log("totalTeams", result)
    

            set({
                totalTeams: result,
            });
            return result;

    },

    getTotalProjectsCompleted: async (): Promise<string> => {
        const result = await (await getVerifierActor()).getTotalProjectsCompleted();
        console.log("totalProjectsCompleted", result)
        
            set({
                totalProjectsCompleted: result,
            });
            return result;

    },

  
});

export const useAdminDataStore = create<AdminDataStore> ()(
  persist(
    (set, get) => createAdminDataStore(set, get) as any,
    {
      name: 'AdminDataStore',
      getStorage: () => sessionStorage,
    }
  )
);

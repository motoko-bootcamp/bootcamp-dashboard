import { GetState, SetState, StateCreator, StoreApi, create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Student } from '../types/types';
import { getVerifierActor } from '../services/actorService';
import {  Result_1,Result_2, Result_3, VerifyProject } from 'src/declarations/Verifier/Verifier.did';
import { toastError, toast, ToastType, toastPromise } from '../services/toastService';
import {  DailyProjectText } from '../../src/declarations/Verifier/Verifier.did';


export interface UserStore {
  readonly user: Student | undefined;
  readonly registered: boolean;
  readonly completedDays: DailyProjectText[];


  registerUser: (
    handle: string,
    teamName: string,
    isSpanish: boolean
  ) => Promise<Result_1>;
  
  getUser: (principalId: string) => Promise<Student | undefined>;
  clearUser: () => Promise<void>;
  clearAll: () => void;
  verifyProject: (canisterId: string, day: number) => Promise<VerifyProject>;
  getStudentcompletedDays: () => Promise<void>;
  isStudent: (principalId: string) => Promise<boolean>;
  result: any; 

}


const toUserModel = (user: Student): Student => {
  return {
    ...user,
  } as Student;
};

const serialize = (state: UserStore): string => {
  const replacer = (key: string, value: any) => {
    if (typeof value === 'bigint') {
      return value.toString() + 'n';
    }
    return value;
  };
  return JSON.stringify(state, replacer);
};

const deserialize = (str: string): UserStore => {
  const reviver = (key: string, value: any) => {
    if (typeof value === 'string' && value.endsWith('n')) {
      return BigInt(value.slice(0, -1));
    }
    return value;
  };
  return JSON.parse(str, reviver);
};




const createUserStore = (
  set: SetState<UserStore>,
  get: GetState<UserStore>,
  store: StoreApi<UserStore>
): UserStore => ({
  completedDays: [],
  user: undefined,
  registered: true,
  result: undefined,

  

  

 
registerUser: async (
  handle: string,
  teamName: string,
  isSpanish: boolean
): Promise<Result_1> => {
  const resultPromise = (await getVerifierActor()).registerStudent(handle, teamName, isSpanish);

  await toastPromise(resultPromise, {
    loading: 'Registering...',
    success: `${handle}, welcome to Motoko BootCamp`,
    error: 'Error registering student.',
  }, ToastType.Success);

  const result = await resultPromise;

  if ('err' in result) {
    console.error(result.err);
    toastError(result.err);
  } else {
    set({ user: toUserModel(result.ok) });
  }
  return result;
},



  getStudentcompletedDays: async (): Promise<void> => {
    const result = await (
      await getVerifierActor()
    ).getStudentCompletedDays();
    if ('err' in result) {
      console.error("err", result.err);
    } else {
      set({ completedDays: result.ok });
      console.log("completedDays", result.ok)
    }
  },

  isStudent: async ( principal ): Promise<boolean> => {
    const isStudent = await (await (await getVerifierActor()).isStudent(principal));
    return isStudent;
  },

  getUser: async (principalId): Promise<Student> => {
    const result = await (await getVerifierActor()).getUser();
    //const registeredStatus = await (await (await getVerifierActor()).isStudent(principalId));
    if ('err' in result) {
      set({
        user: undefined,
        registered: false,
      });
    } else {
      let user = toUserModel(result.ok);
      set({
        user,
        registered: true,
      });
      console.log("getUser", user)
      return user;
    }
  },

  clearUser: async (): Promise<void> => {
    set({ user: undefined });
  },

  clearAll: (): void => {
    set({}, true);
  },
  verifyProject: async (canisterId: string, day: number): Promise<VerifyProject> => {
    console.log("USER STORE day: ", day);
    const resultPromise = (await getVerifierActor()).verifyProject(canisterId, BigInt(day));
  
    await toastPromise(resultPromise, {
      loading: 'Verifying project...',
      success: 'Project verified!',
      error: 'Error verifying project.',
    }, ToastType.Success);
  
    const result = await resultPromise;
  
    if ('err' in result) {
      console.error(result.err);
      toastError(JSON.stringify(result.err));
    } else {
      set({ result: { result } });
      console.log("Result from verifyProject:", result);
    }
    return result;
  },
  
  
});




export const useUserStore = create<UserStore>()(
  persist(
    (set, get, store) => createUserStore(set, get, store) as any,
    {
      name: 'userStore',
      getStorage: () => sessionStorage,
      
    }
  )
);


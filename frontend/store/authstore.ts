import { StoreApi, create } from "zustand";
import { AuthClient } from "@dfinity/auth-client";
import { Principal } from "@dfinity/principal";
import { toastError, toast, ToastType } from "../services/toastService";
import { Identity } from "@dfinity/agent";
import { useUserStore } from "./userStore";

const isLocal = process.env.NODE_ENV === "development";
const identityProvider = isLocal ? 'http://qhbym-qaaaa-aaaaa-aaafq-cai.localhost:8080/#authorize' : "https://identity.ic0.app/#authorize";
const sessionTimeout = BigInt(480) * BigInt(60) * BigInt(1_000_000_000);
const fakeProvider = process.env.II_PROVIDER_USE_FAKE == "true";
const derivationOrigin: string = "https://24ytc-bqaaa-aaaan-qdl7q-cai.ic0.app";
var authClient: AuthClient;

export interface AuthState {
  principal: Principal | null;
  principalString: string | null;
  identity: Identity | null;
  isLoggedIn: boolean;
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  getIdentity: () => Promise<void>;
  init: () => Promise<void>;
}


async function getAuthClient() {
  if (!authClient) {
    authClient = await AuthClient.create();
  }
  return authClient;
}

const loginOptions = {
  identityProvider: identityProvider,
  maxTimeToLive: BigInt(7) * BigInt(24) * BigInt(3_600_000_000_000), // 1 week
  derivationOrigin: isLocal ? undefined : derivationOrigin,
  windowOpenerFeatures:
    "toolbar=0,location=0,menubar=0,width=500,height=500,left=100,top=100",
  onSuccess: async () => {
    console.log("Login Successful!");
    toast("Login Successful!", ToastType.Success);
    let registered = await useUserStore.getState().isStudent(useAuthStore.getState().principalString);
    // if (registered === false) {
    //  window.location.href = '/register';
    // }
    useUserStore.setState({ registered: registered });
    
  },
  onError: (error) => {
    console.error("Login Failed: ", error);
    toastError("Login Failed: " + error);
    
  },
};

async function initAuth(set) {
  console.log("initAuth")
  const storedState = sessionStorage.getItem("auth-storage");
 
  if (storedState) {
    try {
      const { principal, identity, isAuthenticated, isLoggedIn } = JSON.parse(storedState);
      set({ principal, identity, isAuthenticated });
      set ({ isLoggedIn: useAuthStore.getState().principalString !== "2vxsx-fae" });
      
    } catch (e) {
      console.error("Unable to parse stored state from sessionStorage:", e);
    }
  }

  const client = await getAuthClient();
  if (await client.isAuthenticated()) {
    const identity = await client.getIdentity();

    if (identity) {
      const principal = identity.getPrincipal();
      // handle successful authentication
    } else {
      // handle failed authentication
      toastError("Authentication failed");
    }
  }
}

const sessionStorageMiddleware = (config) => (set, get, api) =>
  config(
    (args) => {
      set(args);
      try {
        sessionStorage.setItem(
          "auth-storage",
          JSON.stringify(api.getState())
        );
      } catch (e) {
        console.error("Unable to store data in sessionStorage:", e);
      }
    },
    get,
    api
  );

export const useAuthStore = create(
  sessionStorageMiddleware((set, get, api: StoreApi<AuthState>) => ({
    // Initial state
    principal: null,
    identity: null,
    isAuthenticated: false,
    

    // Actions
    login: async () => {
      const client = await getAuthClient();
      await client.login(loginOptions);
    },

    getIdentity: async () => {
      const client = await getAuthClient();
      const identity = await client.getIdentity();
      if (identity) {
        const principal = identity.getPrincipal();
        set({ principal: principal, identity: identity, isAuthenticated: true, principalString: principal.toText() });
        console.log ("principal: ", principal.toText())
      } else {
        set({ principal: null, identity: null, isAuthenticated: false });
      }
    },

    logout: async () => {
      const client = await getAuthClient();
      await client.logout();
      set({ principal: null, identity: null, isAuthenticated: false, isLoggedIn: false });
    },

    // Initialization
    init: async () => {
      await initAuth(set);
    },
  }))
);


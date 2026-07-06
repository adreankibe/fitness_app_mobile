import "react-native-url-polyfill/auto";

import { createClient } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

import { appEnv } from "@/constants/env";

type SupabaseStorage = {
  getItem: (key: string) => Promise<string | null> | string | null;
  setItem: (key: string, value: string) => Promise<void> | void;
  removeItem: (key: string) => Promise<void> | void;
};

const memoryStorage = new Map<string, string>();

function canUseLocalStorage() {
  return (
    typeof globalThis.localStorage !== "undefined" &&
    typeof globalThis.localStorage.getItem === "function" &&
    typeof globalThis.localStorage.setItem === "function" &&
    typeof globalThis.localStorage.removeItem === "function"
  );
}

export function createSupabaseStorage(platform: typeof Platform.OS): SupabaseStorage {
  if (platform === "web") {
    return {
      getItem: (key) => {
        if (!canUseLocalStorage()) {
          return memoryStorage.get(key) ?? null;
        }

        return globalThis.localStorage.getItem(key);
      },
      setItem: (key, value) => {
        if (!canUseLocalStorage()) {
          memoryStorage.set(key, value);
          return;
        }

        globalThis.localStorage.setItem(key, value);
      },
      removeItem: (key) => {
        if (!canUseLocalStorage()) {
          memoryStorage.delete(key);
          return;
        }

        globalThis.localStorage.removeItem(key);
      },
    };
  }

  return {
    getItem: (key) => SecureStore.getItemAsync(key),
    setItem: (key, value) => SecureStore.setItemAsync(key, value),
    removeItem: (key) => SecureStore.deleteItemAsync(key),
  };
}

export const supabase = createClient(
  appEnv.supabaseUrl,
  appEnv.supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      detectSessionInUrl: false,
      persistSession: true,
      storage: createSupabaseStorage(Platform.OS),
    },
  },
);

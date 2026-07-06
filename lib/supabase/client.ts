import "react-native-url-polyfill/auto";

import { createClient } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";

import { appEnv } from "@/constants/env";

const secureStoreAdapter = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};

export const supabase = createClient(
  appEnv.supabaseUrl,
  appEnv.supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      detectSessionInUrl: false,
      persistSession: true,
      storage: secureStoreAdapter,
    },
  },
);

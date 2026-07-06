import { z } from "zod";

const envSchema = z.object({
  EXPO_PUBLIC_API_URL: z.string().url(),
  EXPO_PUBLIC_SUPABASE_URL: z.string().url(),
  EXPO_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
});

export type PublicEnv = {
  apiUrl: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
};

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

export function createEnv(source: Record<string, string | undefined>): PublicEnv {
  const env = envSchema.parse(source);

  return {
    apiUrl: trimTrailingSlash(env.EXPO_PUBLIC_API_URL),
    supabaseUrl: trimTrailingSlash(env.EXPO_PUBLIC_SUPABASE_URL),
    supabaseAnonKey: env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  };
}

export const appEnv = createEnv({
  EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
  EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
  EXPO_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
});

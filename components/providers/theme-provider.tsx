import { useColorScheme } from "nativewind";
import React from "react";

import { useThemeStore } from "@/store/modules/theme";

export function ThemeProvider({ children }: React.PropsWithChildren) {
  const mode = useThemeStore((state) => state.mode);
  const setColorScheme = useColorScheme().setColorScheme;

  React.useEffect(() => {
    setColorScheme(mode);
  }, [mode, setColorScheme]);

  return <>{children}</>;
}

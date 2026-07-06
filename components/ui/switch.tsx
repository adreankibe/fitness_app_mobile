import React from "react";
import { Switch as NativeSwitch, type SwitchProps } from "react-native";

export function Switch(props: SwitchProps) {
  return (
    <NativeSwitch
      ios_backgroundColor="#e4e7ec"
      thumbColor="#ffffff"
      trackColor={{ false: "#e4e7ec", true: "#1b1b41" }}
      {...props}
    />
  );
}

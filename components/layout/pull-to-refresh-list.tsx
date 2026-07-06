import React from "react";
import {
  FlatList,
  RefreshControl,
  type FlatListProps,
} from "react-native";

type PullToRefreshListProps<T> = FlatListProps<T> & {
  refreshing: boolean;
  onRefresh: () => void;
};

export function PullToRefreshList<T>({
  onRefresh,
  refreshing,
  ...props
}: PullToRefreshListProps<T>) {
  return (
    <FlatList
      refreshControl={
        <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
      }
      {...props}
    />
  );
}

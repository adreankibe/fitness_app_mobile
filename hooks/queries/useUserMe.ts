import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/hooks/queries/keys";
import { usersService } from "@/services/users";

export function useUserMe(enabled = true) {
  return useQuery({
    queryKey: queryKeys.userMe,
    queryFn: usersService.me,
    enabled,
  });
}

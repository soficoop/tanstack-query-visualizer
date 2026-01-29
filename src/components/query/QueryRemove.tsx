import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Minus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useQueryListData } from "@/hooks/useQueryListData";
import type { QueryItem } from "@/lib/types";

interface Props {
  queryItem: QueryItem;
}
export function QueryRemove({ queryItem }: Props) {
  const { removeItem } = useQueryListData();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      queryClient.removeQueries({ queryKey: queryItem.queryKey });
      return await removeItem(queryItem.id);
    },
    onSuccess: () => {
      toast("Removed Query");
    },
  });

  return (
    <Button
      aria-label="Remove"
      onClick={() => mutation.mutate()}
      size="icon"
      variant="ghost"
    >
      <Minus />
    </Button>
  );
}

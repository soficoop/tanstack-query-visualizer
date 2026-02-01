import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Zap } from "lucide-react";
import { toast } from "sonner";
import { InteractiveItem } from "@/components/InteractiveItem";
import { MutationEditSheet } from "@/components/mutation/MutationEditSheet";
import { MutationRemove } from "@/components/mutation/MutationRemove";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { QueryItem } from "@/lib/types";

interface Props {
  queryItem: QueryItem;
}

export function MutationCard({ queryItem }: Props) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    onSuccess: () => {
      const matchingQueries = queryClient.getQueriesData({
        queryKey: queryItem.queryKey,
      });

      queryClient.invalidateQueries({
        queryKey: queryItem.queryKey,
      });

      toast.info(`invalided ${matchingQueries.length} queries`);
    },
  });

  return (
    <InteractiveItem
      actions={
        <Tooltip delayDuration={2000}>
          <TooltipTrigger asChild>
            <Button
              aria-label="Invalidate"
              className="size-10"
              onClick={() => mutation.mutate()}
              variant={"secondary"}
            >
              <Zap className="size-5 text-red-700/80" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Invalidate</p>
          </TooltipContent>
        </Tooltip>
      }
      queryItem={queryItem}
      remove={<MutationRemove id={queryItem.id} />}
      Sheet={MutationEditSheet}
    />
  );
}

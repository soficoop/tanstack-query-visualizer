import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Radiation } from "lucide-react";
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
      queryClient.invalidateQueries({
        queryKey: queryItem.queryKey,
      });
    },
  });

  return (
    <InteractiveItem
      actions={
        <Tooltip delayDuration={2000}>
          <TooltipTrigger asChild>
            <Button
              aria-label="Invalidate"
              className="size-10 border-2 border-primary!"
              onClick={() => mutation.mutate()}
              variant={"outline"}
            >
              <Radiation className="size-6 text-primary" />
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

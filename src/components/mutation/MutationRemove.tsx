import { useMutation } from "@tanstack/react-query";
import { Minus } from "lucide-react";
import { useCallback } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useMutationListData } from "@/hooks/useMutationListData";

export function MutationRemove({ id }: { id: string }) {
  const { removeItem } = useMutationListData();

  const { mutate } = useMutation({
    mutationFn: async () => removeItem(id),
    onSuccess: () => {
      toast("Removed Mutation");
    },
  });

  const handleRemove = useCallback(() => mutate(), [mutate]);

  return (
    <Button
      aria-label="Remove"
      onClick={handleRemove}
      size="icon"
      variant="ghost"
    >
      <Minus />
    </Button>
  );
}

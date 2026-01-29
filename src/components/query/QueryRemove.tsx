import { useMutation } from "@tanstack/react-query";
import { Minus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useQueryListData } from "@/hooks/useQueryListData";

export function QueryRemove({ id }: { id: string }) {
  const { removeItem } = useQueryListData();

  const mutation = useMutation({
    mutationFn: async () => removeItem(id),
    onSuccess: () => {
      toast("Removed Mutation");
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

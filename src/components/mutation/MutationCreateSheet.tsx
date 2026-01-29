import { Plus } from "lucide-react";
import { FormSheet } from "@/components/FormSheet";
import { QueryItemForm } from "@/components/QueryItemForm";
import { Button } from "@/components/ui/button";
import { useMutationListData } from "@/hooks/useMutationListData";
import type { QueryItem } from "@/lib/types";

const defaultValues: QueryItem = {
  id: crypto.randomUUID(),
  label: "",
  queryKey: [],
} as const;

export function MutationCreateSheet() {
  const { pushItem } = useMutationListData();

  return (
    <FormSheet
      current={defaultValues}
      FormComponent={QueryItemForm}
      onSave={pushItem}
      side="right"
      title="Create Mutation"
      toastString={"New Mutation Created"}
    >
      <Button size={"icon-lg"} variant={"ghost"}>
        <Plus className="size-6" />
      </Button>
    </FormSheet>
  );
}

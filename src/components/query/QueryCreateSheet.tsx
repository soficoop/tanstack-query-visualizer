import { Plus } from "lucide-react";
import { FormSheet } from "@/components/FormSheet";
import { QueryItemForm } from "@/components/QueryItemForm";
import { Button } from "@/components/ui/button";
import { useQueryListData } from "@/hooks/useQueryListData";
import type { QueryItem } from "@/lib/types";

const defaultValues: QueryItem = {
  id: crypto.randomUUID(),
  label: "",
  queryKey: [],
} as const;

export function QueryCreateSheet() {
  const { pushItem } = useQueryListData();

  return (
    <FormSheet
      current={defaultValues}
      FormComponent={QueryItemForm}
      onSave={pushItem}
      side="left"
      title="Create Query"
      toastString={"New Query Created"}
    >
      <Button size={"icon-lg"} variant={"ghost"}>
        <Plus className="size-6" />
      </Button>
    </FormSheet>
  );
}

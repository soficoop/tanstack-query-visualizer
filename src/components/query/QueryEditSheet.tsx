import { FormSheet } from "@/components/FormSheet";
import { QueryItemForm } from "@/components/QueryItemForm";
import { useMutationListData } from "@/hooks/useMutationListData";
import type { QueryItem } from "@/lib/types";

interface Props {
  current: QueryItem;
  children: React.ReactNode;
}

export function QueryEditSheet({ children, current }: Props) {
  const { replaceItem } = useMutationListData();

  return (
    <FormSheet
      current={current}
      FormComponent={QueryItemForm}
      onSave={replaceItem}
      side={"left"}
      title="Edit Query"
      toastString={"Query Saved"}
      variant="blue"
    >
      {children}
    </FormSheet>
  );
}

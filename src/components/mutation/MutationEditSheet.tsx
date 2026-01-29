import { FormSheet } from "@/components/FormSheet";
import { QueryItemForm } from "@/components/QueryItemForm";
import { useMutationListData } from "@/hooks/useMutationListData";
import type { QueryItem } from "@/lib/types";

interface Props {
  current: QueryItem;
  children: React.ReactNode;
}

export function MutationEditSheet({ children, current }: Props) {
  const { replaceItem } = useMutationListData();

  return (
    <FormSheet
      children={children}
      current={current}
      FormComponent={QueryItemForm}
      onSave={replaceItem}
      side={"right"}
      title="Edit Mutation"
      toastString={"Mutation Saved"}
    />
  );
}

import { ItemList } from "@/components/ItemList";
import { MutationCreateSheet } from "@/components/mutation/MutationCreateSheet";
import { useMutationListData } from "@/hooks/useMutationListData";
import { MutationCard } from "./MutationCard";

export function MutationList() {
  const { list } = useMutationListData();

  return (
    <ItemList>
      {list.map((e) => (
        <MutationCard key={e.id} queryItem={e} />
      ))}
      {list.length < 10 && <MutationCreateSheet />}
    </ItemList>
  );
}

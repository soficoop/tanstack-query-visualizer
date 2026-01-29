import { ItemList } from "@/components/ItemList";
import { QueryCreateSheet } from "@/components/query/QueryCreateSheet";
import { useQueryListData } from "@/hooks/useQueryListData";
import { QueryCard } from "./QueryCard";

export function QueryList() {
  const { list } = useQueryListData();
  return (
    <ItemList>
      {list.map((e) => (
        <QueryCard key={e.id} queryItem={e} />
      ))}
      {list.length < 10 && <QueryCreateSheet />}
    </ItemList>
  );
}

import { useStorage } from "@/components/providers/StorageProvider";
import type { QueryItem } from "@/lib/types";

export function useMutationListData() {
  const { storage, setStorage } = useStorage();

  const pushItem = (item: QueryItem) => {
    setStorage((prev) => ({
      ...prev,
      mutationList: [...prev.mutationList, item],
    }));
  };

  const replaceItem = (newItem: QueryItem) => {
    setStorage((prev) => ({
      ...prev,
      mutationList: prev.mutationList.map((item) =>
        item.id === newItem.id ? newItem : item
      ),
    }));
  };

  const removeItem = (id: string) => {
    setStorage((prev) => ({
      ...prev,
      mutationList: prev.mutationList.filter((item) => item.id !== id),
    }));
  };

  return { list: storage.mutationList, pushItem, removeItem, replaceItem };
}

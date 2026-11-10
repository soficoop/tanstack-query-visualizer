import { useStorage } from "@/components/providers/StorageProvider";
import type { QueryItem } from "@/lib/types";

export function useQueryListData() {
  const { storage, setStorage } = useStorage();

  const pushItem = (item: QueryItem) => {
    setStorage((prev) => ({
      ...prev,
      queryList: [...prev.queryList, item],
    }));
  };

  const replaceItem = (newItem: QueryItem) => {
    setStorage((prev) => ({
      ...prev,
      queryList: prev.queryList.map((item) =>
        item.id === newItem.id ? newItem : item
      ),
    }));
  };

  const removeItem = (id: string) => {
    setStorage((prev) => ({
      ...prev,
      queryList: prev.queryList.filter((item) => item.id !== id),
    }));
  };

  return { list: storage.queryList, pushItem, removeItem, replaceItem };
}

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { QueryItem } from "@/lib/types";

const KEY = "localStorageData" as const;

interface LocalStorageData {
  queryList: QueryItem[];
  mutationList: QueryItem[];
}

const EMPTY: LocalStorageData = {
  queryList: [],
  mutationList: [],
} as const;

const DEFAULT_VALUE: LocalStorageData = {
  queryList: [
    {
      id: crypto.randomUUID(),
      label: "dog #1",
      queryKey: ["dog", "detail", 1],
    },
    {
      id: crypto.randomUUID(),
      label: "dog #2",
      queryKey: ["dog", "detail", 2],
    },
    {
      id: crypto.randomUUID(),
      label: "dog list page 2",
      queryKey: ["dog", "list", {}, 2],
    },
    {
      id: crypto.randomUUID(),
      label: "dog list filters page 0",
      queryKey: [
        "dog",
        "list",
        { search: "golden", orderBy: { date: "ASC" } },
        0,
      ],
    },
    {
      id: crypto.randomUUID(),
      label: "cat #1",
      queryKey: [{ scope: "cat", entity: "detail", id: 1 }],
    },
    {
      id: crypto.randomUUID(),
      label: "dog list page 0",
      queryKey: [
        {
          scope: "cat",
          entity: "list",
          page: 0,
        },
      ],
    },
    {
      id: crypto.randomUUID(),
      label: "dog list filters page 1",
      queryKey: [
        {
          scope: "cat",
          entity: "list",
          search: "orange",
          orderBy: { date: "ASC" },
          page: 1,
        },
      ],
    },
  ],
  mutationList: [
    {
      id: crypto.randomUUID(),
      label: "all dogs",
      queryKey: ["dog"],
    },
    {
      id: crypto.randomUUID(),
      label: "all dog lists",
      queryKey: ["dog", "list"],
    },
    {
      id: crypto.randomUUID(),
      label: "dog #2",
      queryKey: ["dog", "detail", 2],
    },
    {
      id: crypto.randomUUID(),
      label: "specific dog list",
      queryKey: [
        "dog",
        "list",
        { search: "golden", orderBy: { date: "ASC" } },
        0,
      ],
    },
    {
      id: crypto.randomUUID(),
      label: "all cats",
      queryKey: [{ scope: "cat" }],
    },
    {
      id: crypto.randomUUID(),
      label: "all cats lists",
      queryKey: [{ scope: "cat", entity: "list" }],
    },
    {
      id: crypto.randomUUID(),
      label: "specific cat list",
      queryKey: [
        {
          scope: "cat",
          entity: "list",
          search: "orange",
          orderBy: { date: "ASC" },
          page: 1,
        },
      ],
    },
    {
      id: crypto.randomUUID(),
      label: "cat #1",
      queryKey: [{ scope: "cat", entity: "detail", id: 1 }],
    },
  ],
} as const;

interface StorageContextType {
  storage: LocalStorageData;
  setStorage: React.Dispatch<React.SetStateAction<LocalStorageData>>;
  clear: () => void;
  reset: () => void;
}

const StorageContext = createContext<StorageContextType | undefined>(undefined);

export function StorageProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<LocalStorageData>(() => {
    const saved = localStorage.getItem(KEY);
    return saved ? JSON.parse(saved) : DEFAULT_VALUE;
  });

  const clear = useCallback(() => {
    setData(EMPTY);
  }, []);

  const reset = useCallback(() => {
    setData(DEFAULT_VALUE);
  }, []);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(data));
  }, [data]);

  return (
    <StorageContext.Provider
      value={{ storage: data, setStorage: setData, clear, reset }}
    >
      {children}
    </StorageContext.Provider>
  );
}

export function useStorage() {
  const context = useContext(StorageContext);
  if (!context) {
    throw new Error("useStorage must be used within a StorageProvider");
  }
  return context;
}

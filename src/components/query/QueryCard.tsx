import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { InteractiveItem } from "@/components/InteractiveItem";
import { QueryEditSheet } from "@/components/query/QueryEditSheet";
import { QueryRemove } from "@/components/query/QueryRemove";
import type { QueryItem } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Props {
  queryItem: QueryItem;
}

export function QueryCard({ queryItem }: Props) {
  const query = useQuery({ queryKey: queryItem.queryKey });

  const dataUpdatedAt = useRef(0);
  const [highlight, setHighlight] = useState(false);

  useEffect(() => {
    if (dataUpdatedAt.current !== query.dataUpdatedAt) {
      setHighlight(true);
      const t = setTimeout(() => setHighlight(false), 800);
      return () => clearTimeout(t);
    }
    dataUpdatedAt.current = query.dataUpdatedAt;
  }, [query.dataUpdatedAt]);

  return (
    <InteractiveItem
      className={cn(
        "transition-colors duration-300",
        highlight && "bg-primary/50!"
      )}
      queryItem={queryItem}
      remove={<QueryRemove id={queryItem.id} />}
      Sheet={QueryEditSheet}
    />
  );
}

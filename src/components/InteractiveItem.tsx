import { QueryKeys } from "@/components/QueryKeys";
import { Button } from "@/components/ui/button";
import { Item, ItemContent, ItemTitle } from "@/components/ui/item";
import { Separator } from "@/components/ui/separator";
import type { QueryItem } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Props {
  queryItem: QueryItem;
  remove: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
  Sheet: React.ComponentType<{ current: QueryItem; children: React.ReactNode }>;
}

export function InteractiveItem({
  Sheet,
  className,
  queryItem,
  remove,
  actions,
}: Props) {
  const { queryKey, label } = queryItem;

  return (
    <div className="flex w-full items-center gap-4">
      {remove}
      <Sheet current={queryItem}>
        <Button
          className={cn("flex h-fit flex-1 px-0 py-2", className)}
          variant={"outline"}
        >
          <Item>
            <ItemContent className={"flex flex-row flex-wrap gap-4"}>
              <ItemTitle>{label}</ItemTitle>
              <Separator orientation={"vertical"} />
              <QueryKeys className="flex-1" list={queryKey} />
            </ItemContent>
          </Item>
        </Button>
      </Sheet>
      {actions}
    </div>
  );
}
